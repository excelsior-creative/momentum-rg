import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "article_generation_checkpoints" ADD COLUMN "article_id_id" integer;
  ALTER TABLE "article_generation_checkpoints" ADD CONSTRAINT "article_generation_checkpoints_article_id_id_articles_id_fk" FOREIGN KEY ("article_id_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "article_generation_checkpoints_article_id_idx" ON "article_generation_checkpoints" USING btree ("article_id_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "article_generation_checkpoints" DROP CONSTRAINT "article_generation_checkpoints_article_id_id_articles_id_fk";
  
  DROP INDEX "article_generation_checkpoints_article_id_idx";
  ALTER TABLE "article_generation_checkpoints" DROP COLUMN "article_id_id";`)
}
