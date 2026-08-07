"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Session } from "next-auth";

const queryClient = new QueryClient();
export default function AppProvider({
  children,
  session,
  nonce,
}: {
  children: React.ReactNode;
  session: Session | null;
  nonce: string;
}): React.ReactNode {
  return (
    <SessionProvider
      refetchOnWindowFocus={true}
      refetchInterval={0}
      session={session}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          defaultTheme="light"
          nonce={nonce}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
