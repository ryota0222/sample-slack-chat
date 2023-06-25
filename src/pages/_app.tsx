import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "@/components/features/Header";
import { queryClient } from "@/lib/react-query";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps?.session}>
      <QueryClientProvider client={queryClient}>
        <Header />
        <Component {...pageProps} />
        <Toaster />
      </QueryClientProvider>
    </SessionProvider>
  );
}
