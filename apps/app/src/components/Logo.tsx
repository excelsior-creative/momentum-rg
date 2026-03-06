import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  /** "white" = white logo for dark bg (default), "gold" | "orange" = gold-toned logo, "charcoal" = dark logo for light bg */
  variant?: "white" | "gold" | "orange" | "charcoal";
};

export const Logo = ({ className, variant = "white" }: LogoProps) => {
  const src =
    variant === "charcoal"
      ? "/logo-charcoal.svg"
      : variant === "gold" || variant === "orange"
        ? "/logo-orange.svg"
        : "/logo.svg";

  return (
    <Link href="/" className={className}>
      <Image
        src={src}
        alt="Momentum Realty Group"
        width={174}
        height={78}
        className="h-14 w-auto"
      />
    </Link>
  );
};
