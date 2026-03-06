"use client";

import { Flame } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useContactDialog } from "../ContactDialogProvider";

type ButtonVariant = "primary" | "secondary";

type ButtonBaseProps = {
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
  showFlame?: boolean;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    as?: "button";
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    as: "link";
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseStyles =
  "group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all overflow-hidden";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-[#FF5722] to-[#E91E63] text-white shadow-[0_0_20px_rgba(233,30,99,0.4)] hover:shadow-[0_0_50px_rgba(255,87,34,0.8)] hover:translate-y-[-2px]",
  secondary:
    "bg-zinc-900 border border-white/20 text-white hover:border-[#FF5722] hover:scale-105 backdrop-blur-sm",
};

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(({ variant = "primary", children, className = "", showFlame, ...props }, ref) => {
  const { openContactDialog } = useContactDialog();
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      {variant === "primary" && (
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 rounded-full pointer-events-none" />
      )}
      {variant === "secondary" && (
        <span className="absolute w-0 h-full bg-[#FF5722] left-0 top-0 transition-all duration-300 group-hover:w-full opacity-20 rounded-full pointer-events-none" />
      )}
      <span
        className={`relative z-10 flex items-center gap-2 ${
          variant === "secondary" ? "group-hover:text-[#FF5722] transition-colors" : ""
        }`}
      >
        {children}
        {showFlame && (
          <Flame className="w-4 h-4 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
        )}
      </span>
    </>
  );

  if (props.as === "link") {
    const { as, href, ...linkProps } = props;

    // Intercept /#contact links to open the dialog
    if (href === "/#contact") {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          onClick={(e) => {
            e.preventDefault();
            openContactDialog();
          }}
          className={combinedClassName}
          {...(linkProps as any)}
        >
          {content}
        </button>
      );
    }

    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={combinedClassName}
        {...linkProps}
      >
        {content}
      </Link>
    );
  }

  const { as, ...buttonProps } = props as ButtonAsButton;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={combinedClassName}
      {...buttonProps}
    >
      {content}
    </button>
  );
});

Button.displayName = "Button";

export default Button;

