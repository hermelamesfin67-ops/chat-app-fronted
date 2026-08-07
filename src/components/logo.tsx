import { cn } from "@/utils";
import LogoImage from "@public/logo.png";
import Image, { StaticImageData } from "next/image";

export default function Logo({
  className,
  image,
}: {
  className?: string;
  image?: StaticImageData;
}) {
  return (
    <Image
      src={image ?? LogoImage}
      alt="logo"
      className={cn("h-12 object-contain w-full", className)}
      priority
    />
  );
}
