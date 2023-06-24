import { signOut, useSession } from "next-auth/react";
import React, { memo } from "react";
import { UserProfile } from "./components/UserProfile";
import { Spacer } from "../misc/Spacer";

export const Header: React.FC = memo(() => {
  const { status } = useSession();
  return (
    <header className="w-screen flex px-4 py-2 border-b border-slate-600 gap-4 items-center">
      <span>sample-slack-chat</span>
      {/* ローディング中 */}
      {status === "loading" && <></>}
      {/* 認証時 */}
      {status === "authenticated" && (
        <>
          <Spacer />
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 text-white"
            onClick={() => signOut({ callbackUrl: "/sign_in" })}
          >
            sign out
          </button>
          <UserProfile />
        </>
      )}
      {/* 未認証時 */}
      {status === "unauthenticated" && <></>}
    </header>
  );
});
