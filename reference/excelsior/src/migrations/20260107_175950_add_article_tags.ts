import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_article_tags_color" AS ENUM('orange', 'blue', 'green', 'purple', 'pink', 'gray');
  CREATE TABLE "article_tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"color" "enum_article_tags_color" DEFAULT 'orange',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"article_tags_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "article_tags_id" integer;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_article_tags_fk" FOREIGN KEY ("article_tags_id") REFERENCES "public"."article_tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "article_tags_name_idx" ON "article_tags" USING btree ("name");
  CREATE UNIQUE INDEX "article_tags_slug_idx" ON "article_tags" USING btree ("slug");
  CREATE INDEX "article_tags_updated_at_idx" ON "article_tags" USING btree ("updated_at");
  CREATE INDEX "article_tags_created_at_idx" ON "article_tags" USING btree ("created_at");
  CREATE INDEX "articles_rels_order_idx" ON "articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_article_tags_id_idx" ON "articles_rels" USING btree ("article_tags_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_article_tags_fk" FOREIGN KEY ("article_tags_id") REFERENCES "public"."article_tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_article_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("article_tags_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "article_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "articles_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "article_tags" CASCADE;
  DROP TABLE "articles_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_article_tags_fk";
  
  DROP INDEX "payload_locked_documents_rels_article_tags_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "article_tags_id";
  DROP TYPE "public"."enum_article_tags_color";`)
}
