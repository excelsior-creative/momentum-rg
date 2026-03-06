import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" ADD COLUMN "generation_costs_topic_research_input_tokens" numeric;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_topic_research_output_tokens" numeric;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_topic_research_cost" numeric;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_article_generation_input_tokens" numeric;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_article_generation_output_tokens" numeric;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_article_generation_cost" numeric;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_infographic_data_input_tokens" numeric;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_infographic_data_output_tokens" numeric;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_infographic_data_cost" numeric;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_featured_image_model" varchar;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_featured_image_predict_time" numeric;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_featured_image_cost" numeric;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_infographic_image_model" varchar;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_infographic_image_predict_time" numeric;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_infographic_image_cost" numeric;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_total_cost" numeric;
  ALTER TABLE "articles" ADD COLUMN "generation_costs_generated_at" timestamp(3) with time zone;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" DROP COLUMN "generation_costs_topic_research_input_tokens";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_topic_research_output_tokens";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_topic_research_cost";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_article_generation_input_tokens";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_article_generation_output_tokens";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_article_generation_cost";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_infographic_data_input_tokens";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_infographic_data_output_tokens";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_infographic_data_cost";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_featured_image_model";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_featured_image_predict_time";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_featured_image_cost";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_infographic_image_model";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_infographic_image_predict_time";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_infographic_image_cost";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_total_cost";
  ALTER TABLE "articles" DROP COLUMN "generation_costs_generated_at";`)
}
