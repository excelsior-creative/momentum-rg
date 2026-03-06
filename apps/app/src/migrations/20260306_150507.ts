import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_content_generation_runs_status" AS ENUM('queued', 'skipped', 'generating', 'published', 'failed');
  CREATE TYPE "public"."enum_content_generation_runs_trigger_source" AS ENUM('cron', 'manual');
  CREATE TYPE "public"."enum_content_generation_settings_topic_research_provider" AS ENUM('serpapi');
  CREATE TABLE "content_generation_runs_secondary_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "content_generation_runs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_content_generation_runs_status" DEFAULT 'queued' NOT NULL,
  	"trigger_source" "enum_content_generation_runs_trigger_source" DEFAULT 'cron' NOT NULL,
  	"fingerprint" varchar NOT NULL,
  	"started_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone,
  	"topic_title" varchar NOT NULL,
  	"topic_query" varchar,
  	"primary_keyword" varchar,
  	"geo_target" varchar,
  	"audience_segment" varchar,
  	"search_intent" varchar,
  	"topic_score" numeric,
  	"skip_reason" varchar,
  	"error_message" varchar,
  	"provider_data" jsonb,
  	"models_research_provider" varchar,
  	"models_text_model" varchar,
  	"models_image_model" varchar,
  	"costs_candidate_count" numeric,
  	"costs_estimated_input_tokens" numeric,
  	"costs_estimated_output_tokens" numeric,
  	"post_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "content_generation_settings_target_geographies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "content_generation_settings_audience_segments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"audience" varchar NOT NULL
  );
  
  CREATE TABLE "content_generation_settings_banned_topics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"topic" varchar NOT NULL
  );
  
  CREATE TABLE "content_generation_settings_manual_topic_queue" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"primary_keyword" varchar NOT NULL,
  	"geography" varchar,
  	"audience" varchar,
  	"angle" varchar
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "content_generation_runs_id" integer;
  ALTER TABLE "content_generation_settings" ADD COLUMN "operations_enabled" boolean DEFAULT false;
  ALTER TABLE "content_generation_settings" ADD COLUMN "operations_cadence_hours" numeric DEFAULT 72 NOT NULL;
  ALTER TABLE "content_generation_settings" ADD COLUMN "operations_quality_threshold" numeric DEFAULT 70 NOT NULL;
  ALTER TABLE "content_generation_settings" ADD COLUMN "operations_max_research_seeds" numeric DEFAULT 8 NOT NULL;
  ALTER TABLE "content_generation_settings" ADD COLUMN "operations_max_topic_candidates" numeric DEFAULT 24 NOT NULL;
  ALTER TABLE "content_generation_settings" ADD COLUMN "operations_system_author_email" varchar;
  ALTER TABLE "content_generation_settings" ADD COLUMN "topic_research_provider" "enum_content_generation_settings_topic_research_provider" DEFAULT 'serpapi';
  ALTER TABLE "content_generation_runs_secondary_keywords" ADD CONSTRAINT "content_generation_runs_secondary_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_generation_runs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_generation_runs" ADD CONSTRAINT "content_generation_runs_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "content_generation_settings_target_geographies" ADD CONSTRAINT "content_generation_settings_target_geographies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_generation_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_generation_settings_audience_segments" ADD CONSTRAINT "content_generation_settings_audience_segments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_generation_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_generation_settings_banned_topics" ADD CONSTRAINT "content_generation_settings_banned_topics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_generation_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_generation_settings_manual_topic_queue" ADD CONSTRAINT "content_generation_settings_manual_topic_queue_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_generation_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "content_generation_runs_secondary_keywords_order_idx" ON "content_generation_runs_secondary_keywords" USING btree ("_order");
  CREATE INDEX "content_generation_runs_secondary_keywords_parent_id_idx" ON "content_generation_runs_secondary_keywords" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "content_generation_runs_fingerprint_idx" ON "content_generation_runs" USING btree ("fingerprint");
  CREATE INDEX "content_generation_runs_post_idx" ON "content_generation_runs" USING btree ("post_id");
  CREATE INDEX "content_generation_runs_updated_at_idx" ON "content_generation_runs" USING btree ("updated_at");
  CREATE INDEX "content_generation_runs_created_at_idx" ON "content_generation_runs" USING btree ("created_at");
  CREATE INDEX "content_generation_settings_target_geographies_order_idx" ON "content_generation_settings_target_geographies" USING btree ("_order");
  CREATE INDEX "content_generation_settings_target_geographies_parent_id_idx" ON "content_generation_settings_target_geographies" USING btree ("_parent_id");
  CREATE INDEX "content_generation_settings_audience_segments_order_idx" ON "content_generation_settings_audience_segments" USING btree ("_order");
  CREATE INDEX "content_generation_settings_audience_segments_parent_id_idx" ON "content_generation_settings_audience_segments" USING btree ("_parent_id");
  CREATE INDEX "content_generation_settings_banned_topics_order_idx" ON "content_generation_settings_banned_topics" USING btree ("_order");
  CREATE INDEX "content_generation_settings_banned_topics_parent_id_idx" ON "content_generation_settings_banned_topics" USING btree ("_parent_id");
  CREATE INDEX "content_generation_settings_manual_topic_queue_order_idx" ON "content_generation_settings_manual_topic_queue" USING btree ("_order");
  CREATE INDEX "content_generation_settings_manual_topic_queue_parent_id_idx" ON "content_generation_settings_manual_topic_queue" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_content_generation_runs_fk" FOREIGN KEY ("content_generation_runs_id") REFERENCES "public"."content_generation_runs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_content_generation_runs_id_idx" ON "payload_locked_documents_rels" USING btree ("content_generation_runs_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "content_generation_runs_secondary_keywords" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_generation_runs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_generation_settings_target_geographies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_generation_settings_audience_segments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_generation_settings_banned_topics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_generation_settings_manual_topic_queue" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "content_generation_runs_secondary_keywords" CASCADE;
  DROP TABLE "content_generation_runs" CASCADE;
  DROP TABLE "content_generation_settings_target_geographies" CASCADE;
  DROP TABLE "content_generation_settings_audience_segments" CASCADE;
  DROP TABLE "content_generation_settings_banned_topics" CASCADE;
  DROP TABLE "content_generation_settings_manual_topic_queue" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_content_generation_runs_fk";
  
  DROP INDEX "payload_locked_documents_rels_content_generation_runs_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "content_generation_runs_id";
  ALTER TABLE "content_generation_settings" DROP COLUMN "operations_enabled";
  ALTER TABLE "content_generation_settings" DROP COLUMN "operations_cadence_hours";
  ALTER TABLE "content_generation_settings" DROP COLUMN "operations_quality_threshold";
  ALTER TABLE "content_generation_settings" DROP COLUMN "operations_max_research_seeds";
  ALTER TABLE "content_generation_settings" DROP COLUMN "operations_max_topic_candidates";
  ALTER TABLE "content_generation_settings" DROP COLUMN "operations_system_author_email";
  ALTER TABLE "content_generation_settings" DROP COLUMN "topic_research_provider";
  DROP TYPE "public"."enum_content_generation_runs_status";
  DROP TYPE "public"."enum_content_generation_runs_trigger_source";
  DROP TYPE "public"."enum_content_generation_settings_topic_research_provider";`)
}
