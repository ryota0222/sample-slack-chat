import Image from "next/image";
import { Inter } from "next/font/google";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/hooks/useAuth";

const inter = Inter({ subsets: ["latin"] });

const SignUp = () => {
  const authService = useAuth();
  return (
    <main
      className={`flex flex-col items-center gap-8 p-24 ${inter.className}`}
    >
      <h1 className="text-xl">Sign Up</h1>

      <button
        className="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded-full inline-flex items-center gap-2 border-gray-50 border w-full justify-center"
        onClick={authService.handleGoogleSignUp}
      >
        <FcGoogle size={20} />
        <span>Google</span>
      </button>
    </main>
  );
};

export default SignUp;
