import React from "react";
import { getPayload } from "payload";
import config from "@/payload.config";
import { Container } from "@/components/Container";

export const dynamic = 'force-dynamic';

export default async function TermsPage() {
  const payload = await getPayload({ config });
  const siteSettings = await payload.findGlobal({
    slug: "site-settings",
  });

  return (
    <div className="py-20">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {!siteSettings.termsOfService ? (
              <p className="text-muted-foreground italic">
                Terms of service content has not been populated in the CMS yet.
              </p>
            ) : (
              <p>Content is driven by the Site Settings global in the backend.</p>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

