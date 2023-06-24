import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  getAdditionalUserInfo,
} from "firebase/auth";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { convertErrorMessageFromEnToJa } from "@/functions/firebase";

import client from "@/lib/axios";
import { firebaseApp } from "@/lib/firebase";

import type { AuthProvider } from "firebase/auth";

type UseAuth = () => {
  pending: boolean;
  handleGoogleSignIn: () => void;
  handleGoogleSignUp: () => void;
};

// 定型メッセージ
const PENDING = "処理中";
const NEED_SIGN_UP =
  "アカウントが存在しないか、無効なアカウントです。正しい情報を入力してください";
const RECOMMEND_SIGN_IN =
  "アカウントの作成ができませんでした。入力情報を確認して再度お試しください";

const googleProvider = new GoogleAuthProvider();

export const useAuth: UseAuth = () => {
  const [pending, setPending] = useState(false);
  const auth = getAuth(firebaseApp);
  auth.languageCode = "ja";
  const router = useRouter();
  const redirectUrl = useMemo(() => {
    if (typeof router.query.callbackUrl === "string") {
      return `${process.env.NEXT_PUBLIC_APP_URL}${router.query.callbackUrl}`;
    }
    return `${process.env.NEXT_PUBLIC_APP_URL}`;
  }, [router.query]);
  console.log(redirectUrl)
  useEffect(() => {
    (async () => {
      if (router.isReady) {
        const session = await getSession();
        // session情報がある場合、認証済みとしてリダイレクト
        if (session !== null) {
          router.replace(redirectUrl);
        }
      }
    })();
  }, [router.isReady]);
  /**
   * サインイン
   */
  // SNS認証
  const handleOAuthSignIn = useCallback(
    (provider: AuthProvider) => {
      let toastId: string | null = toast.loading(PENDING);
      setPending(true);
      signInWithPopup(auth, provider)
        // 認証に成功したら ID トークンを NextAuth に渡す
        .then(async (credential) => {
          const idToken = await credential.user.getIdToken(true);
          const isNewUser = getAdditionalUserInfo(credential)?.isNewUser;
          // 新規ユーザーであった場合エラーで終了
          if (isNewUser) {
            toast.error(NEED_SIGN_UP, {
              id: toastId as string,
            });
            toastId = null;
            credential.user.delete();
            throw new Error(NEED_SIGN_UP);
          }
          return {
            refreshToken: credential.user.refreshToken,
            idToken,
            uid: credential.user.uid,
          };
        })
        .then((result) => {
          signIn("credentials", {
            ...result,
            callbackUrl: redirectUrl,
          });
        })
        .catch((error) => {
          let errorMessage: string | null = error.message;
          const errorCode = error.code;
          if (errorMessage !== NEED_SIGN_UP) {
            errorMessage = convertErrorMessageFromEnToJa(errorCode, "signin");
          }
          if (toastId) {
            toast.error(errorMessage, {
              id: toastId as string,
            });
            toastId = null;
          }
        })
        .finally(() => {
          if (toastId) toast.dismiss(toastId);
          setPending(false);
        });
    },
    [auth, redirectUrl]
  );
  /**
   * サインアップ
   */
  // SNS認証
  const handleOAuthSignUp = useCallback(
    (provider: AuthProvider) => {
      let toastId: string | null = toast.loading(PENDING);
      setPending(true);
      signInWithPopup(auth, provider)
        // 認証に成功したら新規登録API実行
        .then(async (credential) => {
          const isNewUser = getAdditionalUserInfo(credential)?.isNewUser;
          // 登録済みユーザーであった場合エラーで終了
          if (!isNewUser) {
            toast.error(RECOMMEND_SIGN_IN, {
              id: toastId as string,
            });
            toastId = null;
            throw new Error(NEED_SIGN_UP);
          }
          return {
            credential,
          };
        })
        // 新規登録APIにリクエスト
        .then(async ({ credential }) => {
          const idToken = await credential.user.getIdToken(true);
          try {
            await client.post('/api/users', {
              name: credential.user.displayName,
              avatar: credential.user.photoURL,
              id: credential.user.uid,
              webhookUrl: '',
            })
          } catch (error) {
            credential.user.delete();
            if (error instanceof Error) {
              throw new Error(error.message);
            }
          }
          return {
            refreshToken: credential.user.refreshToken,
            idToken,
            uid: credential.user.uid,
          };
        })
        .then((result) => {
          signIn("credentials", {
            ...result,
            callbackUrl: redirectUrl,
          });
        })
        .catch((error) => {
          let errorMessage: string | null = error.message;
          const errorCode = error.code;
          if (
            errorMessage !== NEED_SIGN_UP &&
            errorMessage !== RECOMMEND_SIGN_IN
          ) {
            errorMessage = convertErrorMessageFromEnToJa(errorCode, "signup");
          }
          if (toastId) {
            toast.error(errorMessage, {
              id: toastId as string,
            });
            toastId = null;
          }
        })
        .finally(() => {
          if (toastId) toast.dismiss(toastId);
          setPending(false);
        });
    },
    [auth, redirectUrl]
  );
  return {
    pending,
    handleGoogleSignIn: useCallback(
      () => handleOAuthSignIn(googleProvider),
      [handleOAuthSignIn]
    ),
    handleGoogleSignUp: useCallback(
      () => handleOAuthSignUp(googleProvider),
      [handleOAuthSignUp]
    ),
  };
};
