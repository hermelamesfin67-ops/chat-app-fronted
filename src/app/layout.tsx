import type { Metadata, Viewport } from "next";
import LocalFont from "next/font/local";
import "./globals.css";
import AppProvider from "@/layout/app-provider";
import { authOptions } from "./api/auth/[...nextauth]/auth-options";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";

const fontOutfit = LocalFont({
  src: [
    {
      path: "./Outfit-Black.ttf",
      weight: "900",
      style: "black",
    },
    {
      path: "./Outfit-ExtraBold.ttf",
      weight: "800",
      style: "extra-bold",
    },
    {
      path: "./Outfit-Bold.ttf",
      weight: "700",
      style: "bold",
    },
    {
      path: "./Outfit-SemiBold.ttf",
      weight: "600",
      style: "semibold",
    },
    {
      path: "./Outfit-Medium.ttf",
      weight: "500",
      style: "medium",
    },

    {
      path: "./Outfit-Regular.ttf",
      weight: "400",
      style: "normal",
    },

    {
      path: "./Outfit-Light.ttf",
      weight: "300",
      style: "light",
    },
    {
      path: "./Outfit-ExtraLight.ttf",
      weight: "200",
      style: "extra-light",
    },
    {
      path: "./Outfit-Thin.ttf",
      weight: "100",
      style: "extra-thin",
    },
  ],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Chatty",
  description: "Awesome chat app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Chatty",
  },
  icons: {
    icon: "/icons/icon512_rounded.png",
    apple: "/icons/icon512_maskable.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await getServerSession(authOptions);
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || "";
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontOutfit.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <AppProvider session={session} nonce={nonce}>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
