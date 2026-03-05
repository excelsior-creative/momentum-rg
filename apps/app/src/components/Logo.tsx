import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  /** "white" = white logo for dark bg (default), "gold" | "orange" = gold-toned logo for light bg */
  variant?: "white" | "gold" | "orange";
};

export const Logo = ({ className, variant = "white" }: LogoProps) => {
  return (
    <Link href="/" className={className}>
      <Image
        src={variant === "gold" || variant === "orange" ? "/logo-orange.svg" : "/logo.svg"}
        alt="Momentum Realty Group"
        width={140}
        height={42}
        className="h-10 w-auto"
      />
    </Link>
  );
};
