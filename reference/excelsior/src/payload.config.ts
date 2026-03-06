import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { searchPlugin } from "@payloadcms/plugin-search";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

// Collections
import { ArticleCategories } from "./collections/ArticleCategories";
import { ArticleTags } from "./collections/ArticleTags";
import { Articles } from "./collections/Articles";
import { ArticleGenerationCheckpoints } from "./collections/ArticleGenerationCheckpoints";
import { IndustryGenerationCheckpoints } from "./collections/IndustryGenerationCheckpoints";
import { IndustryLandingPages } from "./collections/IndustryLandingPages";
import { Media } from "./collections/Media";
import { Projects } from "./collections/Projects";
import { Users } from "./collections/Users";

// Globals
import { ContentGenerationSettings } from "./globals/ContentGenerationSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Projects,
    ArticleCategories,
    ArticleTags,
    Articles,
    ArticleGenerationCheckpoints,
    IndustryLandingPages,
    IndustryGenerationCheckpoints,
  ],
  globals: [ContentGenerationSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "excelsior-creative-secret-change-me",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    push: false,
    pool: {
      connectionString: process.env.DATABASE_URL,
      max: 3, // Low pool size for Supabase free tier
      min: 0, // Allow pool to fully close when idle
      idleTimeoutMillis: 20000, // Close idle connections after 20s
      connectionTimeoutMillis: 10000, // 10s timeout for connection
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
  email: resendAdapter({
    defaultFromAddress: "noreply@excelsiorcreative.com",
    defaultFromName: "Excelsior Creative",
    apiKey: process.env.RESEND_API_KEY || "",
  }),
  plugins: [
    vercelBlobStorage({
      collections: {
        media: {
          disableLocalStorage: true,
        },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
    searchPlugin({
      collections: ["articles", "projects", "industry-landing-pages"],
      defaultPriorities: {
        articles: 10,
        projects: 20,
        "industry-landing-pages": 30,
      },
      searchOverrides: {
        fields: ({ defaultFields }) => [
          ...defaultFields,
          {
            name: "excerpt",
            type: "text",
            admin: {
              readOnly: true,
            },
          },
        ],
      },
      beforeSync: ({ originalDoc, searchDoc }) => {
        const { title, excerpt, summary, industryName, hero } = originalDoc;

        const excerptStr = excerpt || summary || hero?.description || "";
        
        return {
          ...searchDoc,
          title: title || industryName || hero?.headline || searchDoc.title,
          excerpt: excerptStr,
        };
      },
    }),
  ],
  sharp,
});
