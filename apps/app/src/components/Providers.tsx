"use client";

import React from "react";
import { ContactDialogProvider } from "./ContactDialogProvider";
import { LazyMotion, domAnimation } from "framer-motion";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <ContactDialogProvider>
        {children}
      </ContactDialogProvider>
    </LazyMotion>
  );
}

export default Providers;
