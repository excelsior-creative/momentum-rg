import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_article_generation_checkpoints_stage" AS ENUM('topic', 'content', 'infographic', 'images', 'upload', 'create');
  CREATE TYPE "public"."enum_article_generation_checkpoints_status" AS ENUM('in_progress', 'failed', 'completed');
  CREATE TABLE "articles_generation_costs_section_generation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section" varchar,
  	"input_tokens" numeric,
  	"output_tokens" numeric,
  	"cost" numeric
  );
  
  CREATE TABLE "articles_generation_costs_inline_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"context" varchar,
  	"model" varchar,
  	"predict_time" numeric,
  	"cost" numeric
  );
  
  CREATE TABLE "articles_generation_costs_additional_infographics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"model" varchar,
  	"predict_time" numeric,
  	"cost" numeric
  );
  
  CREATE TABLE "article_generation_checkpoints" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generation_id" varchar NOT NULL,
  	"stage" "enum_article_generation_checkpoints_stage" DEFAULT 'topic',
  	"status" "enum_article_generation_checkpoints_status" DEFAULT 'in_progress',
  	"topic" jsonb,
  	"article" jsonb,
  	"infographic_data" jsonb,
  	"image_results" jsonb,
  	"uploaded_media" jsonb,
  	"costs" jsonb,
  	"options" jsonb,
  	"error_message" varchar,
  	"started_at" timestamp(3) with time zone NOT NULL,
  	"last_updated_at" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "articles" ADD COLUMN "generation_costs_topic_parsing_input_tokens" numeric;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_topic_parsing_output_tokens" numeric;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_topic_parsing_cost" numeric;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_outline_generation_input_tokens" numeric;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_outline_generation_output_tokens" numeric;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_outline_generation_cost" numeric;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_composition_input_tokens" numeric;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_composition_output_tokens" numeric;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_composition_cost" numeric;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "article_generation_checkpoints_id" integer;
  ALTER TABLE "articles_generation_costs_section_generation" ADD CONSTRAINT "articles_generation_costs_section_generation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_generation_costs_inline_images" ADD CONSTRAINT "articles_generation_costs_inline_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_generation_costs_additional_infographics" ADD CONSTRAINT "articles_generation_costs_additional_infographics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "articles_generation_costs_section_generation_order_idx" ON "articles_generation_costs_section_generation" USING btree ("_order");
  CREATE INDEX "articles_generation_costs_section_generation_parent_id_idx" ON "articles_generation_costs_section_generation" USING btree ("_parent_id");
  CREATE INDEX "articles_generation_costs_inline_images_order_idx" ON "articles_generation_costs_inline_images" USING btree ("_order");
  CREATE INDEX "articles_generation_costs_inline_images_parent_id_idx" ON "articles_generation_costs_inline_images" USING btree ("_parent_id");
  CREATE INDEX "articles_generation_costs_additional_infographics_order_idx" ON "articles_generation_costs_additional_infographics" USING btree ("_order");
  CREATE INDEX "articles_generation_costs_additional_infographics_parent_id_idx" ON "articles_generation_costs_additional_infographics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "article_generation_checkpoints_generation_id_idx" ON "article_generation_checkpoints" USING btree ("generation_id");
  CREATE INDEX "article_generation_checkpoints_updated_at_idx" ON "article_generation_checkpoints" USING btree ("updated_at");
  CREATE INDEX "article_generation_checkpoints_created_at_idx" ON "article_generation_checkpoints" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_article_generation_checkpoi_fk" FOREIGN KEY ("article_generation_checkpoints_id") REFERENCES "public"."article_generation_checkpoints"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_featured_idx" ON "projects" USING btree ("featured");
  CREATE INDEX "projects_order_idx" ON "projects" USING btree ("order");
  CREATE INDEX "article_categories_order_idx" ON "article_categories" USING btree ("order");
  CREATE INDEX "articles_status_idx" ON "articles" USING btree ("status");
  CREATE INDEX "articles_published_at_idx" ON "articles" USING btree ("published_at");
  CREATE INDEX "articles_featured_idx" ON "articles" USING btree ("featured");
  CREATE INDEX "payload_locked_documents_rels_article_generation_checkpo_idx" ON "payload_locked_documents_rels" USING btree ("article_generation_checkpoints_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles_generation_costs_section_generation" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "articles_generation_costs_inline_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "articles_generation_costs_additional_infographics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "article_generation_checkpoints" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "articles_generation_costs_section_generation" CASCADE;
  DROP TABLE "articles_generation_costs_inline_images" CASCADE;
  DROP TABLE "articles_generation_costs_additional_infographics" CASCADE;
  DROP TABLE "article_generation_checkpoints" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_article_generation_checkpoi_fk";
  
  DROP INDEX "projects_featured_idx";
  DROP INDEX "projects_order_idx";
  DROP INDEX "article_categories_order_idx";
  DROP INDEX "articles_status_idx";
  DROP INDEX "articles_published_at_idx";
  DROP INDEX "articles_featured_idx";
  DROP INDEX "payload_locked_documents_rels_article_generation_checkpo_idx";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_topic_parsing_input_tokens";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_topic_parsing_output_tokens";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_topic_parsing_cost";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_outline_generation_input_tokens";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_outline_generation_output_tokens";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_outline_generation_cost";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_composition_input_tokens";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_composition_output_tokens";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_composition_cost";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "article_generation_checkpoints_id";
  DROP TYPE "public"."enum_article_generation_checkpoints_stage";
  DROP TYPE "public"."enum_article_generation_checkpoints_status";`)
}
