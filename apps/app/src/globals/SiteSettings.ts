import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "siteTitle",
      type: "text",
      required: true,
      defaultValue: "My Site",
    },
    {
      name: "termsOfService",
      type: "richText",
      required: true,
    },
    {
      name: "privacyPolicy",
      type: "richText",
      required: true,
    },
  ],
};
