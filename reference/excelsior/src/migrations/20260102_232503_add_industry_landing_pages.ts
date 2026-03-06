import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "industry_landing_pages_pain_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "industry_landing_pages_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service_title" varchar NOT NULL,
  	"industry_specific_benefit" varchar NOT NULL
  );
  
  CREATE TABLE "industry_landing_pages_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step_number" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "industry_landing_pages_statistics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"source" varchar
  );
  
  CREATE TABLE "industry_landing_pages_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "industry_landing_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"industry_name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"hero_headline" varchar NOT NULL,
  	"hero_tagline" varchar NOT NULL,
  	"hero_description" varchar NOT NULL,
  	"cta_title" varchar NOT NULL,
  	"cta_description" varchar NOT NULL,
  	"featured_image_id" integer,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_keywords" varchar,
  	"generation_costs_industry_research_input_tokens" numeric,
  	"generation_costs_industry_research_output_tokens" numeric,
  	"generation_costs_industry_research_cost" numeric,
  	"generation_costs_content_generation_input_tokens" numeric,
  	"generation_costs_content_generation_output_tokens" numeric,
  	"generation_costs_content_generation_cost" numeric,
  	"generation_costs_featured_image_model" varchar,
  	"generation_costs_featured_image_predict_time" numeric,
  	"generation_costs_featured_image_cost" numeric,
  	"generation_costs_total_cost" numeric,
  	"generation_costs_generated_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "industry_landing_pages_id" integer;
  ALTER TABLE "industry_landing_pages_pain_points" ADD CONSTRAINT "industry_landing_pages_pain_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industry_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industry_landing_pages_services" ADD CONSTRAINT "industry_landing_pages_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industry_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industry_landing_pages_process" ADD CONSTRAINT "industry_landing_pages_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industry_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industry_landing_pages_statistics" ADD CONSTRAINT "industry_landing_pages_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industry_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industry_landing_pages_faqs" ADD CONSTRAINT "industry_landing_pages_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industry_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industry_landing_pages" ADD CONSTRAINT "industry_landing_pages_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "industry_landing_pages_pain_points_order_idx" ON "industry_landing_pages_pain_points" USING btree ("_order");
  CREATE INDEX "industry_landing_pages_pain_points_parent_id_idx" ON "industry_landing_pages_pain_points" USING btree ("_parent_id");
  CREATE INDEX "industry_landing_pages_services_order_idx" ON "industry_landing_pages_services" USING btree ("_order");
  CREATE INDEX "industry_landing_pages_services_parent_id_idx" ON "industry_landing_pages_services" USING btree ("_parent_id");
  CREATE INDEX "industry_landing_pages_process_order_idx" ON "industry_landing_pages_process" USING btree ("_order");
  CREATE INDEX "industry_landing_pages_process_parent_id_idx" ON "industry_landing_pages_process" USING btree ("_parent_id");
  CREATE INDEX "industry_landing_pages_statistics_order_idx" ON "industry_landing_pages_statistics" USING btree ("_order");
  CREATE INDEX "industry_landing_pages_statistics_parent_id_idx" ON "industry_landing_pages_statistics" USING btree ("_parent_id");
  CREATE INDEX "industry_landing_pages_faqs_order_idx" ON "industry_landing_pages_faqs" USING btree ("_order");
  CREATE INDEX "industry_landing_pages_faqs_parent_id_idx" ON "industry_landing_pages_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "industry_landing_pages_slug_idx" ON "industry_landing_pages" USING btree ("slug");
  CREATE INDEX "industry_landing_pages_featured_image_idx" ON "industry_landing_pages" USING btree ("featured_image_id");
  CREATE INDEX "industry_landing_pages_updated_at_idx" ON "industry_landing_pages" USING btree ("updated_at");
  CREATE INDEX "industry_landing_pages_created_at_idx" ON "industry_landing_pages" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_industry_landing_pages_fk" FOREIGN KEY ("industry_landing_pages_id") REFERENCES "public"."industry_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_industry_landing_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("industry_landing_pages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "industry_landing_pages_pain_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "industry_landing_pages_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "industry_landing_pages_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "industry_landing_pages_statistics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "industry_landing_pages_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "industry_landing_pages" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "industry_landing_pages_pain_points" CASCADE;
  DROP TABLE "industry_landing_pages_services" CASCADE;
  DROP TABLE "industry_landing_pages_process" CASCADE;
  DROP TABLE "industry_landing_pages_statistics" CASCADE;
  DROP TABLE "industry_landing_pages_faqs" CASCADE;
  DROP TABLE "industry_landing_pages" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_industry_landing_pages_fk";
  
  DROP INDEX "payload_locked_documents_rels_industry_landing_pages_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "industry_landing_pages_id";`)
}
