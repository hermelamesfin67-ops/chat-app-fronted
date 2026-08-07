import { Metadata } from "next";
import logoImg from "@public/logo.png";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";

enum MODE {
  DARK = "dark",
  LIGHT = "light",
}

export const siteSeo = {
  title: "Chatty",
  description: `Chatty`,
  logo: logoImg,
  icon: "/favicon.ico",
  mode: MODE.LIGHT,
};

export const metaObject = (
  title?: string,
  openGraph?: OpenGraph,
  description: string = siteSeo.description,
): Metadata => {
  return {
    title: title ? `${title}` : siteSeo.title,
    description,
    openGraph: openGraph ?? {
      title: title || "Chatty",
      description,
      siteName: "Chatty",
      locale: "en_US",
      type: "website",
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
};
