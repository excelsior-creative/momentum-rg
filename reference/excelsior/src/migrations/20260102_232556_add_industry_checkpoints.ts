import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_industry_generation_checkpoints_stage" AS ENUM('context', 'content', 'images', 'upload', 'create');
  CREATE TYPE "public"."enum_industry_generation_checkpoints_status" AS ENUM('in_progress', 'failed', 'completed');
  CREATE TABLE "industry_generation_checkpoints" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generation_id" varchar NOT NULL,
  	"industry_name" varchar NOT NULL,
  	"stage" "enum_industry_generation_checkpoints_stage" DEFAULT 'context',
  	"status" "enum_industry_generation_checkpoints_status" DEFAULT 'in_progress',
  	"context" jsonb,
  	"page_data" jsonb,
  	"image_result" jsonb,
  	"uploaded_media" jsonb,
  	"costs" jsonb,
  	"options" jsonb,
  	"error_message" varchar,
  	"started_at" timestamp(3) with time zone NOT NULL,
  	"last_updated_at" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "industry_generation_checkpoints_id" integer;
  CREATE UNIQUE INDEX "industry_generation_checkpoints_generation_id_idx" ON "industry_generation_checkpoints" USING btree ("generation_id");
  CREATE INDEX "industry_generation_checkpoints_updated_at_idx" ON "industry_generation_checkpoints" USING btree ("updated_at");
  CREATE INDEX "industry_generation_checkpoints_created_at_idx" ON "industry_generation_checkpoints" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_industry_generation_checkpo_fk" FOREIGN KEY ("industry_generation_checkpoints_id") REFERENCES "public"."industry_generation_checkpoints"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_industry_generation_checkp_idx" ON "payload_locked_documents_rels" USING btree ("industry_generation_checkpoints_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "industry_generation_checkpoints" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "industry_generation_checkpoints" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_industry_generation_checkpo_fk";
  
  DROP INDEX "payload_locked_documents_rels_industry_generation_checkp_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "industry_generation_checkpoints_id";
  DROP TYPE "public"."enum_industry_generation_checkpoints_stage";
  DROP TYPE "public"."enum_industry_generation_checkpoints_status";`)
}
