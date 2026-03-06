import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_industry_generation_checkpoints_stage" ADD VALUE 'infographic' BEFORE 'images';
  ALTER TABLE "industry_landing_pages" ADD COLUMN "infographic_id" integer;
  ALTER TABLE "industry_landing_pages" ADD COLUMN "generation_costs_infographic_data_input_tokens" numeric;
  ALTER TABLE "industry_landing_pages" ADD COLUMN "generation_costs_infographic_data_output_tokens" numeric;
  ALTER TABLE "industry_landing_pages" ADD COLUMN "generation_costs_infographic_data_cost" numeric;
  ALTER TABLE "industry_landing_pages" ADD COLUMN "generation_costs_infographic_image_model" varchar;
  ALTER TABLE "industry_landing_pages" ADD COLUMN "generation_costs_infographic_image_predict_time" numeric;
  ALTER TABLE "industry_landing_pages" ADD COLUMN "generation_costs_infographic_image_cost" numeric;
  ALTER TABLE "industry_generation_checkpoints" ADD COLUMN "infographic_data" jsonb;
  ALTER TABLE "industry_landing_pages" ADD CONSTRAINT "industry_landing_pages_infographic_id_media_id_fk" FOREIGN KEY ("infographic_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "industry_landing_pages_infographic_idx" ON "industry_landing_pages" USING btree ("infographic_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "industry_landing_pages" DROP CONSTRAINT "industry_landing_pages_infographic_id_media_id_fk";
  
  ALTER TABLE "industry_generation_checkpoints" ALTER COLUMN "stage" SET DATA TYPE text;
  ALTER TABLE "industry_generation_checkpoints" ALTER COLUMN "stage" SET DEFAULT 'context'::text;
  DROP TYPE "public"."enum_industry_generation_checkpoints_stage";
  CREATE TYPE "public"."enum_industry_generation_checkpoints_stage" AS ENUM('context', 'content', 'images', 'upload', 'create');
  ALTER TABLE "industry_generation_checkpoints" ALTER COLUMN "stage" SET DEFAULT 'context'::"public"."enum_industry_generation_checkpoints_stage";
  ALTER TABLE "industry_generation_checkpoints" ALTER COLUMN "stage" SET DATA TYPE "public"."enum_industry_generation_checkpoints_stage" USING "stage"::"public"."enum_industry_generation_checkpoints_stage";
  DROP INDEX "industry_landing_pages_infographic_idx";
  ALTER TABLE "industry_landing_pages" DROP COLUMN "infographic_id";
  ALTER TABLE "industry_landing_pages" DROP COLUMN "generation_costs_infographic_data_input_tokens";
  ALTER TABLE "industry_landing_pages" DROP COLUMN "generation_costs_infographic_data_output_tokens";
  ALTER TABLE "industry_landing_pages" DROP COLUMN "generation_costs_infographic_data_cost";
  ALTER TABLE "industry_landing_pages" DROP COLUMN "generation_costs_infographic_image_model";
  ALTER TABLE "industry_landing_pages" DROP COLUMN "generation_costs_infographic_image_predict_time";
  ALTER TABLE "industry_landing_pages" DROP COLUMN "generation_costs_infographic_image_cost";
  ALTER TABLE "industry_generation_checkpoints" DROP COLUMN "infographic_data";`)
}
