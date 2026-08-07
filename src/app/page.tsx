"use client"
import SplashScreen from "@/components/splash-screen";
import HomePage from "@/features";
import Login from "@/features/auth/login";
import { useSession } from "next-auth/react";
import React from "react";

export default function Home() {
  const { data: session } = useSession()
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }
  if (session) return <HomePage />
  return (
    <Login />
  );
}
