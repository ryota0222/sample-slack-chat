import { Inter } from "next/font/google";
import { useSession } from "next-auth/react";
import { Loader } from "@/components/ui/Loader";
import { WebhookForm } from "@/components/features/WebhookForm";
import { MessageForm } from "@/components/features/MessageForm";
import { MessageContent } from "@/components/features/MessageContent";
import Link from "next/link";
import { BotTokenForm } from "@/components/features/BotTokenForm";

const inter = Inter({ subsets: ["latin"] });

const Home = () => {
  const { status } = useSession();
  return (
    <main className={`flex flex-col items-center px-24 ${inter.className}`}>
      {/* ローディング中 */}
      {status === "loading" && (
        <div className="w-full py-12 flex justify-center">
          <Loader />
        </div>
      )}
      {/* 認証時 */}
      {status === "authenticated" && (
        <div className="grid grid-cols-1 divide-y divide-slate-600 w-full">
          <WebhookForm />
          <BotTokenForm />
          <MessageForm />
          <MessageContent />
        </div>
      )}
      {/* 未認証時 */}
      {status === "unauthenticated" && (
        <div className="w-full py-12 justify-center grid gap-4">
          <div className="text-center text-6xl">👨‍💻</div>
          <p className="text-xl font-bold text-center">ログインはこちら</p>
          <Link
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 text-white"
            href="/sign_in"
          >
            sign in
          </Link>

          <div className="text-center text-6xl mt-12">👩‍💻</div>
          <p className="text-xl font-bold text-center">
            アカウント登録はこちら
          </p>
          <Link
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 text-white"
            href="/sign_up"
          >
            sign up
          </Link>
        </div>
      )}
    </main>
  );
};

export default Home;
