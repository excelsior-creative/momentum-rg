import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_properties_status" AS ENUM('for-sale', 'sold', 'in-escrow', 'for-lease', 'leased', 'pending', 'on-hold', 'cancelled', 'coming-soon');
  CREATE TYPE "public"."enum_properties_property_type" AS ENUM('single-family-home', 'condo', 'townhouse', 'duplex', 'fourplex', 'multi-unit', 'apartment', 'land', 'co-op');
  CREATE TABLE "properties_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "properties_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar NOT NULL
  );
  
  CREATE TABLE "properties_wp_image_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "properties" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" jsonb,
  	"excerpt" varchar,
  	"status" "enum_properties_status" DEFAULT 'for-sale' NOT NULL,
  	"property_type" "enum_properties_property_type",
  	"featured" boolean DEFAULT false,
  	"price" numeric,
  	"price_old" numeric,
  	"bedrooms" numeric,
  	"bathrooms" numeric,
  	"sqft" numeric,
  	"garage" numeric,
  	"lot_size" varchar,
  	"year_built" numeric,
  	"property_id" varchar,
  	"address" varchar,
  	"city" varchar,
  	"state" varchar DEFAULT 'CA',
  	"zip_code" varchar,
  	"county" varchar,
  	"latitude" numeric,
  	"longitude" numeric,
  	"featured_image_id" integer,
  	"date_added" timestamp(3) with time zone,
  	"wp_id" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "properties_id" integer;
  ALTER TABLE "properties_gallery" ADD CONSTRAINT "properties_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties_gallery" ADD CONSTRAINT "properties_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_features" ADD CONSTRAINT "properties_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_wp_image_urls" ADD CONSTRAINT "properties_wp_image_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties" ADD CONSTRAINT "properties_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "properties_gallery_order_idx" ON "properties_gallery" USING btree ("_order");
  CREATE INDEX "properties_gallery_parent_id_idx" ON "properties_gallery" USING btree ("_parent_id");
  CREATE INDEX "properties_gallery_image_idx" ON "properties_gallery" USING btree ("image_id");
  CREATE INDEX "properties_features_order_idx" ON "properties_features" USING btree ("_order");
  CREATE INDEX "properties_features_parent_id_idx" ON "properties_features" USING btree ("_parent_id");
  CREATE INDEX "properties_wp_image_urls_order_idx" ON "properties_wp_image_urls" USING btree ("_order");
  CREATE INDEX "properties_wp_image_urls_parent_id_idx" ON "properties_wp_image_urls" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "properties_slug_idx" ON "properties" USING btree ("slug");
  CREATE INDEX "properties_city_idx" ON "properties" USING btree ("city");
  CREATE INDEX "properties_zip_code_idx" ON "properties" USING btree ("zip_code");
  CREATE INDEX "properties_featured_image_idx" ON "properties" USING btree ("featured_image_id");
  CREATE INDEX "properties_wp_id_idx" ON "properties" USING btree ("wp_id");
  CREATE INDEX "properties_updated_at_idx" ON "properties" USING btree ("updated_at");
  CREATE INDEX "properties_created_at_idx" ON "properties" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_properties_fk" FOREIGN KEY ("properties_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_properties_id_idx" ON "payload_locked_documents_rels" USING btree ("properties_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "properties_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "properties_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "properties_wp_image_urls" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "properties" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "properties_gallery" CASCADE;
  DROP TABLE "properties_features" CASCADE;
  DROP TABLE "properties_wp_image_urls" CASCADE;
  DROP TABLE "properties" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_properties_fk";
  
  DROP INDEX "payload_locked_documents_rels_properties_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "properties_id";
  DROP TYPE "public"."enum_properties_status";
  DROP TYPE "public"."enum_properties_property_type";`)
}
