import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_approach" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_case_studies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stats_block_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stats_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_team_block_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_team_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_values_block_values" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_values_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_process_steps_block_steps_details" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_process_steps_block_steps_deliverables" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_process_steps_block_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_process_steps_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_differentiator_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_differentiator_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_expectations_block_expectations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_expectations_block_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_expectations_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_block_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_legal_content_block_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_legal_content_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_story_block_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_story_block_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_story_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_checklist_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_checklist_block_sidebar_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_checklist_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_feature_grid_block_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_feature_grid_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_passion_cards_block_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_passion_cards_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_partner_checklist_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_partner_checklist_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "articles_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_landing_pages_secondary_keywords" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_landing_pages_problem_section_problems" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_landing_pages_solution_section_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_landing_pages_services_offered" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_landing_pages_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_landing_pages_trust_signals_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_landing_pages_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_landing_pages_local_seo_nearby_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_landing_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_navigation_main_menu" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_footer_status_lights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_footer_connect_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "process_steps_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "process_steps" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "services_features" CASCADE;
  DROP TABLE "services_approach" CASCADE;
  DROP TABLE "services_case_studies" CASCADE;
  DROP TABLE "services_faqs" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "pages_blocks_text_block" CASCADE;
  DROP TABLE "pages_blocks_cta_block" CASCADE;
  DROP TABLE "pages_blocks_stats_block_stats" CASCADE;
  DROP TABLE "pages_blocks_stats_block" CASCADE;
  DROP TABLE "pages_blocks_team_block_members" CASCADE;
  DROP TABLE "pages_blocks_team_block" CASCADE;
  DROP TABLE "pages_blocks_values_block_values" CASCADE;
  DROP TABLE "pages_blocks_values_block" CASCADE;
  DROP TABLE "pages_blocks_process_steps_block_steps_details" CASCADE;
  DROP TABLE "pages_blocks_process_steps_block_steps_deliverables" CASCADE;
  DROP TABLE "pages_blocks_process_steps_block_steps" CASCADE;
  DROP TABLE "pages_blocks_process_steps_block" CASCADE;
  DROP TABLE "pages_blocks_differentiator_block_items" CASCADE;
  DROP TABLE "pages_blocks_differentiator_block" CASCADE;
  DROP TABLE "pages_blocks_expectations_block_expectations" CASCADE;
  DROP TABLE "pages_blocks_expectations_block_timeline" CASCADE;
  DROP TABLE "pages_blocks_expectations_block" CASCADE;
  DROP TABLE "pages_blocks_faq_block_faqs" CASCADE;
  DROP TABLE "pages_blocks_faq_block" CASCADE;
  DROP TABLE "pages_blocks_legal_content_block_sections" CASCADE;
  DROP TABLE "pages_blocks_legal_content_block" CASCADE;
  DROP TABLE "pages_blocks_story_block_paragraphs" CASCADE;
  DROP TABLE "pages_blocks_story_block_stats" CASCADE;
  DROP TABLE "pages_blocks_story_block" CASCADE;
  DROP TABLE "pages_blocks_checklist_block_items" CASCADE;
  DROP TABLE "pages_blocks_checklist_block_sidebar_stats" CASCADE;
  DROP TABLE "pages_blocks_checklist_block" CASCADE;
  DROP TABLE "pages_blocks_feature_grid_block_features" CASCADE;
  DROP TABLE "pages_blocks_feature_grid_block" CASCADE;
  DROP TABLE "pages_blocks_passion_cards_block_cards" CASCADE;
  DROP TABLE "pages_blocks_passion_cards_block" CASCADE;
  DROP TABLE "pages_blocks_partner_checklist_block_items" CASCADE;
  DROP TABLE "pages_blocks_partner_checklist_block" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "articles_rels" CASCADE;
  DROP TABLE "service_landing_pages_secondary_keywords" CASCADE;
  DROP TABLE "service_landing_pages_problem_section_problems" CASCADE;
  DROP TABLE "service_landing_pages_solution_section_benefits" CASCADE;
  DROP TABLE "service_landing_pages_services_offered" CASCADE;
  DROP TABLE "service_landing_pages_process" CASCADE;
  DROP TABLE "service_landing_pages_trust_signals_stats" CASCADE;
  DROP TABLE "service_landing_pages_faqs" CASCADE;
  DROP TABLE "service_landing_pages_local_seo_nearby_areas" CASCADE;
  DROP TABLE "service_landing_pages" CASCADE;
  DROP TABLE "site_settings_navigation_main_menu" CASCADE;
  DROP TABLE "site_settings_footer_status_lights" CASCADE;
  DROP TABLE "site_settings_footer_connect_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "process_steps_steps" CASCADE;
  DROP TABLE "process_steps" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_services_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_service_landing_pages_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_services_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_pages_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_service_landing_pages_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "services_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "service_landing_pages_id";
  DROP TYPE "public"."enum_services_features_icon";
  DROP TYPE "public"."enum_services_icon";
  DROP TYPE "public"."enum_pages_blocks_cta_block_theme";
  DROP TYPE "public"."enum_pages_blocks_stats_block_theme";
  DROP TYPE "public"."enum_pages_blocks_stats_block_layout";
  DROP TYPE "public"."enum_pages_blocks_values_block_values_icon";
  DROP TYPE "public"."enum_pages_blocks_values_block_theme";
  DROP TYPE "public"."enum_pages_blocks_process_steps_block_steps_icon";
  DROP TYPE "public"."enum_pages_blocks_process_steps_block_theme";
  DROP TYPE "public"."enum_pages_blocks_differentiator_block_items_icon";
  DROP TYPE "public"."enum_pages_blocks_differentiator_block_theme";
  DROP TYPE "public"."enum_pages_blocks_expectations_block_expectations_icon";
  DROP TYPE "public"."enum_pages_blocks_faq_block_theme";
  DROP TYPE "public"."enum_pages_blocks_story_block_stats_hover_color";
  DROP TYPE "public"."enum_pages_blocks_checklist_block_theme";
  DROP TYPE "public"."enum_pages_blocks_feature_grid_block_features_icon";
  DROP TYPE "public"."enum_pages_blocks_feature_grid_block_theme";
  DROP TYPE "public"."enum_pages_blocks_passion_cards_block_cards_icon";
  DROP TYPE "public"."enum_pages_blocks_passion_cards_block_theme";
  DROP TYPE "public"."enum_pages_blocks_partner_checklist_block_theme";
  DROP TYPE "public"."enum_pages_template";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum_pages_hero_icon";
  DROP TYPE "public"."enum_service_landing_pages_problem_section_problems_icon";
  DROP TYPE "public"."enum_service_landing_pages_solution_section_benefits_icon";
  DROP TYPE "public"."enum_service_landing_pages_services_offered_icon";
  DROP TYPE "public"."enum_service_landing_pages_status";
  DROP TYPE "public"."enum_service_landing_pages_target_location";
  DROP TYPE "public"."enum_site_settings_footer_status_lights_color";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_services_features_icon" AS ENUM('code', 'gauge', 'search', 'smartphone', 'accessibility', 'layers', 'zap', 'shield', 'database', 'cloud', 'lock', 'bot', 'globe', 'server', 'cpu', 'palette', 'rocket');
  CREATE TYPE "public"."enum_services_icon" AS ENUM('code', 'bot', 'server', 'palette', 'cpu', 'globe', 'zap', 'shield', 'rocket');
  CREATE TYPE "public"."enum_pages_blocks_cta_block_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_pages_blocks_stats_block_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_pages_blocks_stats_block_layout" AS ENUM('2x2', '4col', 'horizontal');
  CREATE TYPE "public"."enum_pages_blocks_values_block_values_icon" AS ENUM('target', 'lightbulb', 'shield', 'heart', 'zap', 'award', 'users', 'star', 'check', 'code', 'globe', 'lock');
  CREATE TYPE "public"."enum_pages_blocks_values_block_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_pages_blocks_process_steps_block_steps_icon" AS ENUM('search', 'palette', 'code', 'test-tube', 'rocket', 'check', 'zap', 'settings');
  CREATE TYPE "public"."enum_pages_blocks_process_steps_block_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_pages_blocks_differentiator_block_items_icon" AS ENUM('shield', 'message-square', 'users', 'zap', 'check', 'clock', 'target', 'award');
  CREATE TYPE "public"."enum_pages_blocks_differentiator_block_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_pages_blocks_expectations_block_expectations_icon" AS ENUM('clock', 'message-square', 'file-check', 'users', 'check', 'calendar');
  CREATE TYPE "public"."enum_pages_blocks_faq_block_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_pages_blocks_story_block_stats_hover_color" AS ENUM('black', 'orange', 'pink');
  CREATE TYPE "public"."enum_pages_blocks_checklist_block_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_pages_blocks_feature_grid_block_features_icon" AS ENUM('hard-drive', 'globe', 'layers', 'image', 'shield', 'lock', 'eye', 'refresh', 'clock', 'database', 'activity', 'server', 'file-text', 'bar-chart', 'settings', 'search', 'check');
  CREATE TYPE "public"."enum_pages_blocks_feature_grid_block_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_pages_blocks_passion_cards_block_cards_icon" AS ENUM('brain', 'dna', 'cpu', 'sparkles', 'heart-handshake', 'rocket', 'lightbulb', 'target');
  CREATE TYPE "public"."enum_pages_blocks_passion_cards_block_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_pages_blocks_partner_checklist_block_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_pages_template" AS ENUM('default', 'about', 'process', 'legal', 'launchpad');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pages_hero_icon" AS ENUM('none', 'users', 'target', 'shield', 'file-text', 'rocket');
  CREATE TYPE "public"."enum_service_landing_pages_problem_section_problems_icon" AS ENUM('alert', 'bug', 'clock', 'lock', 'server', 'shield', 'zap');
  CREATE TYPE "public"."enum_service_landing_pages_solution_section_benefits_icon" AS ENUM('check', 'zap', 'shield', 'clock', 'star');
  CREATE TYPE "public"."enum_service_landing_pages_services_offered_icon" AS ENUM('code', 'shield', 'zap', 'database', 'globe', 'lock', 'server', 'wrench', 'check');
  CREATE TYPE "public"."enum_service_landing_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_service_landing_pages_target_location" AS ENUM('orange-county', 'irvine', 'anaheim', 'santa-ana', 'huntington-beach', 'oc');
  CREATE TYPE "public"."enum_site_settings_footer_status_lights_color" AS ENUM('green', 'orange', 'red');
  CREATE TABLE "services_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"icon" "enum_services_features_icon"
  );
  
  CREATE TABLE "services_approach" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "services_case_studies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"project_id" integer,
  	"result" varchar NOT NULL
  );
  
  CREATE TABLE "services_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"tagline" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"short_description" varchar,
  	"icon" "enum_services_icon" NOT NULL,
  	"hero_image_id" integer,
  	"hero_image_path" varchar,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"cta_title" varchar DEFAULT 'Ready to Get Started?',
  	"cta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "pages_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"theme" "enum_pages_blocks_cta_block_theme" DEFAULT 'dark',
  	"headline" varchar NOT NULL,
  	"description" varchar,
  	"button_text" varchar NOT NULL,
  	"button_link" varchar NOT NULL,
  	"secondary_text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_block_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"theme" "enum_pages_blocks_stats_block_theme" DEFAULT 'light',
  	"layout" "enum_pages_blocks_stats_block_layout" DEFAULT '2x2',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_team_block_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"bio" varchar,
  	"photo_id" integer,
  	"image_path" varchar
  );
  
  CREATE TABLE "pages_blocks_team_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_badge" varchar DEFAULT 'The_Pride',
  	"headline" varchar DEFAULT 'Meet Our',
  	"headline_accent" varchar DEFAULT 'Team',
  	"description" varchar,
  	"footer_text" varchar,
  	"footer_link_text" varchar,
  	"footer_link_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_values_block_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_values_block_values_icon" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_values_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"theme" "enum_pages_blocks_values_block_theme" DEFAULT 'dark',
  	"section_badge" varchar DEFAULT 'What_Drives_Us',
  	"headline" varchar DEFAULT 'Our Core',
  	"headline_accent" varchar DEFAULT 'Values',
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_process_steps_block_steps_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_process_steps_block_steps_deliverables" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_process_steps_block_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"icon" "enum_pages_blocks_process_steps_block_steps_icon" NOT NULL,
  	"title" varchar NOT NULL,
  	"tagline" varchar,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_process_steps_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"theme" "enum_pages_blocks_process_steps_block_theme" DEFAULT 'light',
  	"section_badge" varchar DEFAULT 'The_Five_Phases',
  	"headline" varchar DEFAULT 'How We',
  	"headline_accent" varchar DEFAULT 'Deliver',
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_differentiator_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_differentiator_block_items_icon" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_differentiator_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"theme" "enum_pages_blocks_differentiator_block_theme" DEFAULT 'dark',
  	"section_badge" varchar,
  	"headline" varchar,
  	"headline_accent" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_expectations_block_expectations" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_expectations_block_expectations_icon" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_expectations_block_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"phase" varchar NOT NULL,
  	"duration" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_expectations_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_badge" varchar,
  	"headline" varchar,
  	"headline_accent" varchar,
  	"description" varchar,
  	"timeline_note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_block_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"theme" "enum_pages_blocks_faq_block_theme" DEFAULT 'light',
  	"section_badge" varchar,
  	"headline" varchar,
  	"headline_accent" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_legal_content_block_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"content" jsonb NOT NULL
  );
  
  CREATE TABLE "pages_blocks_legal_content_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"contact_info_show" boolean DEFAULT true,
  	"contact_info_company_name" varchar DEFAULT 'Excelsior Creative',
  	"contact_info_location" varchar DEFAULT 'Orange County, California',
  	"contact_info_email" varchar DEFAULT 'hello@excelsiorcreative.com',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_story_block_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_story_block_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"hover_color" "enum_pages_blocks_story_block_stats_hover_color" DEFAULT 'black'
  );
  
  CREATE TABLE "pages_blocks_story_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_badge" varchar DEFAULT 'Our_Story',
  	"headline" varchar DEFAULT 'Built on',
  	"headline_accent" varchar DEFAULT 'Purpose',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_checklist_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_checklist_block_sidebar_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_checklist_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"theme" "enum_pages_blocks_checklist_block_theme" DEFAULT 'dark',
  	"section_badge" varchar,
  	"headline" varchar,
  	"headline_accent" varchar,
  	"sidebar_title" varchar,
  	"sidebar_description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_grid_block_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_feature_grid_block_features_icon" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_feature_grid_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"theme" "enum_pages_blocks_feature_grid_block_theme" DEFAULT 'light',
  	"category_title" varchar NOT NULL,
  	"category_description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_passion_cards_block_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_passion_cards_block_cards_icon" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_passion_cards_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"theme" "enum_pages_blocks_passion_cards_block_theme" DEFAULT 'dark',
  	"section_badge" varchar,
  	"headline" varchar,
  	"headline_accent" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_partner_checklist_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_partner_checklist_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"theme" "enum_pages_blocks_partner_checklist_block_theme" DEFAULT 'dark',
  	"section_badge" varchar,
  	"headline" varchar,
  	"headline_accent" varchar,
  	"description" varchar,
  	"bottom_note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"template" "enum_pages_template" DEFAULT 'default',
  	"status" "enum_pages_status" DEFAULT 'draft' NOT NULL,
  	"last_updated" timestamp(3) with time zone,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"hero_icon" "enum_pages_hero_icon" DEFAULT 'none',
  	"hero_badge" varchar,
  	"hero_headline" varchar,
  	"hero_headline_accent" varchar,
  	"hero_subheadline" varchar,
  	"hero_description" varchar,
  	"hero_cta_text" varchar,
  	"hero_cta_link" varchar,
  	"hero_image_id" integer,
  	"hero_image_path" varchar,
  	"content" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "service_landing_pages_secondary_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "service_landing_pages_problem_section_problems" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"problem" varchar NOT NULL,
  	"icon" "enum_service_landing_pages_problem_section_problems_icon"
  );
  
  CREATE TABLE "service_landing_pages_solution_section_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"benefit" varchar NOT NULL,
  	"icon" "enum_service_landing_pages_solution_section_benefits_icon"
  );
  
  CREATE TABLE "service_landing_pages_services_offered" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"icon" "enum_service_landing_pages_services_offered_icon"
  );
  
  CREATE TABLE "service_landing_pages_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step" varchar NOT NULL,
  	"description" varchar,
  	"timeframe" varchar
  );
  
  CREATE TABLE "service_landing_pages_trust_signals_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "service_landing_pages_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "service_landing_pages_local_seo_nearby_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"area" varchar
  );
  
  CREATE TABLE "service_landing_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"parent_service_id" integer NOT NULL,
  	"status" "enum_service_landing_pages_status" DEFAULT 'draft' NOT NULL,
  	"target_location" "enum_service_landing_pages_target_location" NOT NULL,
  	"primary_keyword" varchar NOT NULL,
  	"hero_headline" varchar NOT NULL,
  	"hero_subheadline" varchar,
  	"hero_cta_text" varchar DEFAULT 'Get Help Now',
  	"hero_urgency_badge" varchar,
  	"hero_hero_image_id" integer,
  	"problem_section_headline" varchar DEFAULT 'Is Your Website Down?',
  	"solution_section_headline" varchar DEFAULT 'We Fix It Fast',
  	"solution_section_description" varchar,
  	"trust_signals_testimonial_quote" varchar,
  	"trust_signals_testimonial_author" varchar,
  	"trust_signals_testimonial_company" varchar,
  	"trust_signals_testimonial_location" varchar,
  	"local_seo_service_area" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"cta_headline" varchar DEFAULT 'Need Help Right Now?',
  	"cta_description" varchar,
  	"cta_button_text" varchar DEFAULT 'Get Emergency Help',
  	"cta_phone_number" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_navigation_main_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"is_contact_button" boolean DEFAULT false
  );
  
  CREATE TABLE "site_settings_footer_status_lights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"color" "enum_site_settings_footer_status_lights_color" DEFAULT 'green'
  );
  
  CREATE TABLE "site_settings_footer_connect_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar,
  	"is_contact_button" boolean DEFAULT false,
  	"is_external" boolean DEFAULT false
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Excelsior Creative' NOT NULL,
  	"tagline" varchar DEFAULT 'Nonprofit AI & Software Engineering Agency',
  	"description" varchar DEFAULT 'Excelsior Creative is a trusted technology partner for national nonprofits, specializing in AI-powered solutions, custom software engineering, and digital strategy to amplify world-changing missions.',
  	"logo_id" integer,
  	"hero_headline_top" varchar DEFAULT 'Amplify' NOT NULL,
  	"hero_headline_bottom" varchar DEFAULT 'Your Impact' NOT NULL,
  	"hero_subheadline" varchar DEFAULT 'We build the technology behind nonprofits changing the world. AI strategy. Custom software. Zero friction.',
  	"hero_video_url" varchar DEFAULT 'https://player.vimeo.com/video/406208979?muted=1&autoplay=1&loop=1&background=1&playsinline=1',
  	"hero_primary_cta_text" varchar DEFAULT 'Start Your Project',
  	"hero_secondary_cta_text" varchar DEFAULT 'Explore Work',
  	"manifesto_headline" varchar DEFAULT 'We Don''t Just Build Websites.',
  	"manifesto_headline_accent" varchar DEFAULT 'solutions.',
  	"manifesto_location" varchar DEFAULT 'BASED IN ORANGE COUNTY, CA',
  	"manifesto_description" varchar DEFAULT 'In a crowded digital landscape, standing out isn''t optional—it''s survival. Like the lion, we lead from the front. Our philosophy is simple: Beautiful design. Bulletproof code. Real results. We combine strategic vision with technical excellence to build digital experiences that don''t just look good—they dominate.',
  	"manifesto_promise_title" varchar DEFAULT 'The Pride''s Promise',
  	"manifesto_promise_description" varchar DEFAULT 'Every pixel intentional. Every line of code optimized. Every project delivered with the pride and precision you deserve.',
  	"contact_email" varchar DEFAULT 'hello@excelsiorcreative.com',
  	"contact_phone" varchar,
  	"contact_address" varchar DEFAULT 'Orange County, California',
  	"social_twitter" varchar,
  	"social_linkedin" varchar DEFAULT 'https://www.linkedin.com/company/excelsiorcreative/',
  	"social_facebook" varchar DEFAULT 'https://www.facebook.com/exctio/',
  	"social_github" varchar,
  	"social_instagram" varchar,
  	"social_support_url" varchar DEFAULT 'https://support.excelsiorcreative.com/support/home',
  	"stats_years_experience" varchar DEFAULT '10+',
  	"stats_projects_delivered" varchar DEFAULT '100+',
  	"stats_nonprofit_partners" varchar DEFAULT '50+',
  	"stats_support_availability" varchar DEFAULT '24/7',
  	"stats_client_satisfaction" varchar DEFAULT '100%',
  	"stats_missed_deadlines" varchar DEFAULT '0',
  	"footer_description" varchar DEFAULT 'Excelsior Creative is a trusted technology partner for national nonprofits, specializing in AI-powered solutions, custom software engineering, and digital strategy to amplify world-changing missions.',
  	"footer_copyright" varchar DEFAULT '© 2025 Excelsior Creative. All Rights Reserved.',
  	"footer_show_newsletter" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "process_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "process_steps" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_badge" varchar DEFAULT 'FROM_VISION_TO_VICTORY',
  	"headline" varchar DEFAULT 'The Process',
  	"cta_text" varchar DEFAULT 'Learn More About Our Process',
  	"cta_link" varchar DEFAULT '/process',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "service_landing_pages_id" integer;
  ALTER TABLE "services_features" ADD CONSTRAINT "services_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_approach" ADD CONSTRAINT "services_approach_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_case_studies" ADD CONSTRAINT "services_case_studies_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_case_studies" ADD CONSTRAINT "services_case_studies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_faqs" ADD CONSTRAINT "services_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_text_block" ADD CONSTRAINT "pages_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_block" ADD CONSTRAINT "pages_blocks_cta_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_block_stats" ADD CONSTRAINT "pages_blocks_stats_block_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_block" ADD CONSTRAINT "pages_blocks_stats_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_block_members" ADD CONSTRAINT "pages_blocks_team_block_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_block_members" ADD CONSTRAINT "pages_blocks_team_block_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_block" ADD CONSTRAINT "pages_blocks_team_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_values_block_values" ADD CONSTRAINT "pages_blocks_values_block_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_values_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_values_block" ADD CONSTRAINT "pages_blocks_values_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_steps_block_steps_details" ADD CONSTRAINT "pages_blocks_process_steps_block_steps_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process_steps_block_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_steps_block_steps_deliverables" ADD CONSTRAINT "pages_blocks_process_steps_block_steps_deliverables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process_steps_block_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_steps_block_steps" ADD CONSTRAINT "pages_blocks_process_steps_block_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process_steps_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_steps_block" ADD CONSTRAINT "pages_blocks_process_steps_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_differentiator_block_items" ADD CONSTRAINT "pages_blocks_differentiator_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_differentiator_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_differentiator_block" ADD CONSTRAINT "pages_blocks_differentiator_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_expectations_block_expectations" ADD CONSTRAINT "pages_blocks_expectations_block_expectations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_expectations_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_expectations_block_timeline" ADD CONSTRAINT "pages_blocks_expectations_block_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_expectations_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_expectations_block" ADD CONSTRAINT "pages_blocks_expectations_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_block_faqs" ADD CONSTRAINT "pages_blocks_faq_block_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_block" ADD CONSTRAINT "pages_blocks_faq_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_legal_content_block_sections" ADD CONSTRAINT "pages_blocks_legal_content_block_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_legal_content_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_legal_content_block" ADD CONSTRAINT "pages_blocks_legal_content_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_story_block_paragraphs" ADD CONSTRAINT "pages_blocks_story_block_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_story_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_story_block_stats" ADD CONSTRAINT "pages_blocks_story_block_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_story_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_story_block" ADD CONSTRAINT "pages_blocks_story_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_checklist_block_items" ADD CONSTRAINT "pages_blocks_checklist_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_checklist_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_checklist_block_sidebar_stats" ADD CONSTRAINT "pages_blocks_checklist_block_sidebar_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_checklist_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_checklist_block" ADD CONSTRAINT "pages_blocks_checklist_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid_block_features" ADD CONSTRAINT "pages_blocks_feature_grid_block_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_grid_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid_block" ADD CONSTRAINT "pages_blocks_feature_grid_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_passion_cards_block_cards" ADD CONSTRAINT "pages_blocks_passion_cards_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_passion_cards_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_passion_cards_block" ADD CONSTRAINT "pages_blocks_passion_cards_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partner_checklist_block_items" ADD CONSTRAINT "pages_blocks_partner_checklist_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_partner_checklist_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partner_checklist_block" ADD CONSTRAINT "pages_blocks_partner_checklist_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_landing_pages_secondary_keywords" ADD CONSTRAINT "service_landing_pages_secondary_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_landing_pages_problem_section_problems" ADD CONSTRAINT "service_landing_pages_problem_section_problems_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_landing_pages_solution_section_benefits" ADD CONSTRAINT "service_landing_pages_solution_section_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_landing_pages_services_offered" ADD CONSTRAINT "service_landing_pages_services_offered_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_landing_pages_process" ADD CONSTRAINT "service_landing_pages_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_landing_pages_trust_signals_stats" ADD CONSTRAINT "service_landing_pages_trust_signals_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_landing_pages_faqs" ADD CONSTRAINT "service_landing_pages_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_landing_pages_local_seo_nearby_areas" ADD CONSTRAINT "service_landing_pages_local_seo_nearby_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_landing_pages" ADD CONSTRAINT "service_landing_pages_parent_service_id_services_id_fk" FOREIGN KEY ("parent_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_landing_pages" ADD CONSTRAINT "service_landing_pages_hero_hero_image_id_media_id_fk" FOREIGN KEY ("hero_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_landing_pages" ADD CONSTRAINT "service_landing_pages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_navigation_main_menu" ADD CONSTRAINT "site_settings_navigation_main_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_status_lights" ADD CONSTRAINT "site_settings_footer_status_lights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_connect_links" ADD CONSTRAINT "site_settings_footer_connect_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "process_steps_steps" ADD CONSTRAINT "process_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."process_steps"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_features_order_idx" ON "services_features" USING btree ("_order");
  CREATE INDEX "services_features_parent_id_idx" ON "services_features" USING btree ("_parent_id");
  CREATE INDEX "services_approach_order_idx" ON "services_approach" USING btree ("_order");
  CREATE INDEX "services_approach_parent_id_idx" ON "services_approach" USING btree ("_parent_id");
  CREATE INDEX "services_case_studies_order_idx" ON "services_case_studies" USING btree ("_order");
  CREATE INDEX "services_case_studies_parent_id_idx" ON "services_case_studies" USING btree ("_parent_id");
  CREATE INDEX "services_case_studies_project_idx" ON "services_case_studies" USING btree ("project_id");
  CREATE INDEX "services_faqs_order_idx" ON "services_faqs" USING btree ("_order");
  CREATE INDEX "services_faqs_parent_id_idx" ON "services_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_hero_image_idx" ON "services" USING btree ("hero_image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_services_id_idx" ON "projects_rels" USING btree ("services_id");
  CREATE INDEX "pages_blocks_text_block_order_idx" ON "pages_blocks_text_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_text_block_parent_id_idx" ON "pages_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_text_block_path_idx" ON "pages_blocks_text_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_block_order_idx" ON "pages_blocks_cta_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_block_parent_id_idx" ON "pages_blocks_cta_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_block_path_idx" ON "pages_blocks_cta_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_block_stats_order_idx" ON "pages_blocks_stats_block_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_block_stats_parent_id_idx" ON "pages_blocks_stats_block_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_block_order_idx" ON "pages_blocks_stats_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_block_parent_id_idx" ON "pages_blocks_stats_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_block_path_idx" ON "pages_blocks_stats_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_team_block_members_order_idx" ON "pages_blocks_team_block_members" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_block_members_parent_id_idx" ON "pages_blocks_team_block_members" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_block_members_photo_idx" ON "pages_blocks_team_block_members" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_team_block_order_idx" ON "pages_blocks_team_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_block_parent_id_idx" ON "pages_blocks_team_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_block_path_idx" ON "pages_blocks_team_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_values_block_values_order_idx" ON "pages_blocks_values_block_values" USING btree ("_order");
  CREATE INDEX "pages_blocks_values_block_values_parent_id_idx" ON "pages_blocks_values_block_values" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_values_block_order_idx" ON "pages_blocks_values_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_values_block_parent_id_idx" ON "pages_blocks_values_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_values_block_path_idx" ON "pages_blocks_values_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_process_steps_block_steps_details_order_idx" ON "pages_blocks_process_steps_block_steps_details" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_steps_block_steps_details_parent_id_idx" ON "pages_blocks_process_steps_block_steps_details" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_steps_block_steps_deliverables_order_idx" ON "pages_blocks_process_steps_block_steps_deliverables" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_steps_block_steps_deliverables_parent_id_idx" ON "pages_blocks_process_steps_block_steps_deliverables" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_steps_block_steps_order_idx" ON "pages_blocks_process_steps_block_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_steps_block_steps_parent_id_idx" ON "pages_blocks_process_steps_block_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_steps_block_order_idx" ON "pages_blocks_process_steps_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_steps_block_parent_id_idx" ON "pages_blocks_process_steps_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_steps_block_path_idx" ON "pages_blocks_process_steps_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_differentiator_block_items_order_idx" ON "pages_blocks_differentiator_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_differentiator_block_items_parent_id_idx" ON "pages_blocks_differentiator_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_differentiator_block_order_idx" ON "pages_blocks_differentiator_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_differentiator_block_parent_id_idx" ON "pages_blocks_differentiator_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_differentiator_block_path_idx" ON "pages_blocks_differentiator_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_expectations_block_expectations_order_idx" ON "pages_blocks_expectations_block_expectations" USING btree ("_order");
  CREATE INDEX "pages_blocks_expectations_block_expectations_parent_id_idx" ON "pages_blocks_expectations_block_expectations" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_expectations_block_timeline_order_idx" ON "pages_blocks_expectations_block_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_expectations_block_timeline_parent_id_idx" ON "pages_blocks_expectations_block_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_expectations_block_order_idx" ON "pages_blocks_expectations_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_expectations_block_parent_id_idx" ON "pages_blocks_expectations_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_expectations_block_path_idx" ON "pages_blocks_expectations_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_block_faqs_order_idx" ON "pages_blocks_faq_block_faqs" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_block_faqs_parent_id_idx" ON "pages_blocks_faq_block_faqs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_block_order_idx" ON "pages_blocks_faq_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_block_parent_id_idx" ON "pages_blocks_faq_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_block_path_idx" ON "pages_blocks_faq_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_legal_content_block_sections_order_idx" ON "pages_blocks_legal_content_block_sections" USING btree ("_order");
  CREATE INDEX "pages_blocks_legal_content_block_sections_parent_id_idx" ON "pages_blocks_legal_content_block_sections" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_legal_content_block_order_idx" ON "pages_blocks_legal_content_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_legal_content_block_parent_id_idx" ON "pages_blocks_legal_content_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_legal_content_block_path_idx" ON "pages_blocks_legal_content_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_story_block_paragraphs_order_idx" ON "pages_blocks_story_block_paragraphs" USING btree ("_order");
  CREATE INDEX "pages_blocks_story_block_paragraphs_parent_id_idx" ON "pages_blocks_story_block_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_story_block_stats_order_idx" ON "pages_blocks_story_block_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_story_block_stats_parent_id_idx" ON "pages_blocks_story_block_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_story_block_order_idx" ON "pages_blocks_story_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_story_block_parent_id_idx" ON "pages_blocks_story_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_story_block_path_idx" ON "pages_blocks_story_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_checklist_block_items_order_idx" ON "pages_blocks_checklist_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_checklist_block_items_parent_id_idx" ON "pages_blocks_checklist_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_checklist_block_sidebar_stats_order_idx" ON "pages_blocks_checklist_block_sidebar_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_checklist_block_sidebar_stats_parent_id_idx" ON "pages_blocks_checklist_block_sidebar_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_checklist_block_order_idx" ON "pages_blocks_checklist_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_checklist_block_parent_id_idx" ON "pages_blocks_checklist_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_checklist_block_path_idx" ON "pages_blocks_checklist_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_grid_block_features_order_idx" ON "pages_blocks_feature_grid_block_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_grid_block_features_parent_id_idx" ON "pages_blocks_feature_grid_block_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_block_order_idx" ON "pages_blocks_feature_grid_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_grid_block_parent_id_idx" ON "pages_blocks_feature_grid_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_block_path_idx" ON "pages_blocks_feature_grid_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_passion_cards_block_cards_order_idx" ON "pages_blocks_passion_cards_block_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_passion_cards_block_cards_parent_id_idx" ON "pages_blocks_passion_cards_block_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_passion_cards_block_order_idx" ON "pages_blocks_passion_cards_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_passion_cards_block_parent_id_idx" ON "pages_blocks_passion_cards_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_passion_cards_block_path_idx" ON "pages_blocks_passion_cards_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_partner_checklist_block_items_order_idx" ON "pages_blocks_partner_checklist_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_partner_checklist_block_items_parent_id_idx" ON "pages_blocks_partner_checklist_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_partner_checklist_block_order_idx" ON "pages_blocks_partner_checklist_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_partner_checklist_block_parent_id_idx" ON "pages_blocks_partner_checklist_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_partner_checklist_block_path_idx" ON "pages_blocks_partner_checklist_block" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "pages_hero_hero_image_idx" ON "pages" USING btree ("hero_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "articles_rels_order_idx" ON "articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_services_id_idx" ON "articles_rels" USING btree ("services_id");
  CREATE INDEX "service_landing_pages_secondary_keywords_order_idx" ON "service_landing_pages_secondary_keywords" USING btree ("_order");
  CREATE INDEX "service_landing_pages_secondary_keywords_parent_id_idx" ON "service_landing_pages_secondary_keywords" USING btree ("_parent_id");
  CREATE INDEX "service_landing_pages_problem_section_problems_order_idx" ON "service_landing_pages_problem_section_problems" USING btree ("_order");
  CREATE INDEX "service_landing_pages_problem_section_problems_parent_id_idx" ON "service_landing_pages_problem_section_problems" USING btree ("_parent_id");
  CREATE INDEX "service_landing_pages_solution_section_benefits_order_idx" ON "service_landing_pages_solution_section_benefits" USING btree ("_order");
  CREATE INDEX "service_landing_pages_solution_section_benefits_parent_id_idx" ON "service_landing_pages_solution_section_benefits" USING btree ("_parent_id");
  CREATE INDEX "service_landing_pages_services_offered_order_idx" ON "service_landing_pages_services_offered" USING btree ("_order");
  CREATE INDEX "service_landing_pages_services_offered_parent_id_idx" ON "service_landing_pages_services_offered" USING btree ("_parent_id");
  CREATE INDEX "service_landing_pages_process_order_idx" ON "service_landing_pages_process" USING btree ("_order");
  CREATE INDEX "service_landing_pages_process_parent_id_idx" ON "service_landing_pages_process" USING btree ("_parent_id");
  CREATE INDEX "service_landing_pages_trust_signals_stats_order_idx" ON "service_landing_pages_trust_signals_stats" USING btree ("_order");
  CREATE INDEX "service_landing_pages_trust_signals_stats_parent_id_idx" ON "service_landing_pages_trust_signals_stats" USING btree ("_parent_id");
  CREATE INDEX "service_landing_pages_faqs_order_idx" ON "service_landing_pages_faqs" USING btree ("_order");
  CREATE INDEX "service_landing_pages_faqs_parent_id_idx" ON "service_landing_pages_faqs" USING btree ("_parent_id");
  CREATE INDEX "service_landing_pages_local_seo_nearby_areas_order_idx" ON "service_landing_pages_local_seo_nearby_areas" USING btree ("_order");
  CREATE INDEX "service_landing_pages_local_seo_nearby_areas_parent_id_idx" ON "service_landing_pages_local_seo_nearby_areas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "service_landing_pages_slug_idx" ON "service_landing_pages" USING btree ("slug");
  CREATE INDEX "service_landing_pages_parent_service_idx" ON "service_landing_pages" USING btree ("parent_service_id");
  CREATE INDEX "service_landing_pages_hero_hero_hero_image_idx" ON "service_landing_pages" USING btree ("hero_hero_image_id");
  CREATE INDEX "service_landing_pages_seo_seo_og_image_idx" ON "service_landing_pages" USING btree ("seo_og_image_id");
  CREATE INDEX "service_landing_pages_updated_at_idx" ON "service_landing_pages" USING btree ("updated_at");
  CREATE INDEX "service_landing_pages_created_at_idx" ON "service_landing_pages" USING btree ("created_at");
  CREATE INDEX "site_settings_navigation_main_menu_order_idx" ON "site_settings_navigation_main_menu" USING btree ("_order");
  CREATE INDEX "site_settings_navigation_main_menu_parent_id_idx" ON "site_settings_navigation_main_menu" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_status_lights_order_idx" ON "site_settings_footer_status_lights" USING btree ("_order");
  CREATE INDEX "site_settings_footer_status_lights_parent_id_idx" ON "site_settings_footer_status_lights" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_connect_links_order_idx" ON "site_settings_footer_connect_links" USING btree ("_order");
  CREATE INDEX "site_settings_footer_connect_links_parent_id_idx" ON "site_settings_footer_connect_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "process_steps_steps_order_idx" ON "process_steps_steps" USING btree ("_order");
  CREATE INDEX "process_steps_steps_parent_id_idx" ON "process_steps_steps" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_landing_pages_fk" FOREIGN KEY ("service_landing_pages_id") REFERENCES "public"."service_landing_pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_service_landing_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("service_landing_pages_id");`)
}
