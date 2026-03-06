import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Create enum type if it doesn't exist
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_articles_image_style" AS ENUM('illustration', 'photorealistic-people', 'photorealistic-abstract', 'tech-minimal');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  // Create content_generation_settings tables
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "content_generation_settings_featured_image_styles" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "model" varchar NOT NULL,
      "prompt" varchar NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS "content_generation_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "topic_research_prompt" varchar,
      "article_generation_prompt" varchar,
      "infographic_data_extraction_prompt" varchar,
      "infographic_image_generation_prompt" varchar,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
  `)

  // Add image_style column if it doesn't exist
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "articles" ADD COLUMN "image_style" "enum_articles_image_style";
    EXCEPTION
      WHEN duplicate_column THEN null;
    END $$;
  `)

  // Add foreign key and indexes if they don't exist
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "content_generation_settings_featured_image_styles" 
        ADD CONSTRAINT "content_generation_settings_featured_image_styles_parent_id_fk" 
        FOREIGN KEY ("_parent_id") REFERENCES "public"."content_generation_settings"("id") 
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "content_generation_settings_featured_image_styles_order_idx" 
      ON "content_generation_settings_featured_image_styles" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "content_generation_settings_featured_image_styles_parent_id_idx" 
      ON "content_generation_settings_featured_image_styles" USING btree ("_parent_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "content_generation_settings_featured_image_styles" CASCADE;
    DROP TABLE IF EXISTS "content_generation_settings" CASCADE;
    ALTER TABLE "articles" DROP COLUMN IF EXISTS "image_style";
    DROP TYPE IF EXISTS "public"."enum_articles_image_style";
  `)
}
