import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { firebaseAdmin } from "@/lib/firebaseAdmin";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
  try {
    const url =
      `https://securetoken.googleapis.com/v1/token?` +
      new URLSearchParams({
        key: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const refreshedTokens = await response.json();
    // response example
    // {
    //   "expires_in": "3600",
    //   "token_type": "Bearer",
    //   "refresh_token": "[REFRESH_TOKEN]",
    //   "id_token": "[ID_TOKEN]",
    //   "user_id": "tRcfmLH7o2XrNELi...",
    //   "project_id": "1234567890"
    // }
    if (!response.ok) {
      throw refreshedTokens;
    }
    return {
      ...token,
      accessToken: refreshedTokens.id_token,
      accessTokenExpires: Math.round(
        Date.now() / 1000 + Number(refreshedTokens.expires_in)
      ),
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      authorize: async (credentials) => {
        const { idToken, refreshToken } = credentials;
        if (idToken != null) {
          try {
            const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
            return { ...decoded, idToken, refreshToken };
          } catch (error) {}
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user }) => {
      // Initial sign in
      if (user) {
        token.accessToken = user.idToken;
        token.refreshToken = user.refreshToken;
        token.uid = user.uid;
        token.accessTokenExpires = user.exp;
        return token;
      }
      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires * 1000) {
        return token;
      }
      // Access token has expired, try to update it
      const item = await refreshAccessToken(token);
      return item;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.uid = token.uid;
      session.user.accessTokenExpires = token.accessTokenExpires;
      return session;
    },
  },
};

export default NextAuth(authOptions);
