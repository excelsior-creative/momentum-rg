import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_services_features_icon" ADD VALUE 'rocket';
  ALTER TYPE "public"."enum_services_icon" ADD VALUE 'rocket';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services_features" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_services_features_icon";
  CREATE TYPE "public"."enum_services_features_icon" AS ENUM('code', 'gauge', 'search', 'smartphone', 'accessibility', 'layers', 'zap', 'shield', 'database', 'cloud', 'lock', 'bot', 'globe', 'server', 'cpu', 'palette');
  ALTER TABLE "services_features" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_services_features_icon" USING "icon"::"public"."enum_services_features_icon";
  ALTER TABLE "services" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_services_icon";
  CREATE TYPE "public"."enum_services_icon" AS ENUM('code', 'bot', 'server', 'palette', 'cpu', 'globe', 'zap', 'shield');
  ALTER TABLE "services" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_services_icon" USING "icon"::"public"."enum_services_icon";`)
}
