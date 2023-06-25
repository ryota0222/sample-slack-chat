import { Inter } from "next/font/google";
import { useSession } from "next-auth/react";
import { Loader } from "@/components/ui/Loader";
import { WebhookForm } from "@/components/features/WebhookForm";
import { MessageForm } from "@/components/features/MessageForm";
import { MessageContent } from "@/components/features/MessageContent";

const inter = Inter({ subsets: ["latin"] });

const Home = () => {
  const { status } = useSession();
  return (
    <main className={`flex flex-col items-center px-24 ${inter.className}`}>
      {/* ローディング中 */}
      {status === "loading" && (
        <div className="w-full py-12">
          <Loader />
        </div>
      )}
      {/* 認証時 */}
      {status === "authenticated" && (
        <div className="grid grid-cols-1 divide-y divide-slate-600 w-full">
          <WebhookForm />
          <MessageForm />
          <MessageContent />
        </div>
      )}
      {/* 未認証時 */}
      {status === "unauthenticated" && <>unauthenticated</>}
    </main>
  );
};

export default Home;
