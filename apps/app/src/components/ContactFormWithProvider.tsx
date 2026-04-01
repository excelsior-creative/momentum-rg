"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ContactForm, ContactFormInner } from "./ContactForm";

export function ContactFormWithProvider() {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!recaptchaSiteKey) return <ContactFormInner />;

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaSiteKey}
      scriptProps={{ async: true, defer: true, appendTo: "head" }}
    >
      <ContactForm />
    </GoogleReCaptchaProvider>
  );
}
