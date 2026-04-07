import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'parent', 'organizer');
  CREATE TYPE "public"."enum_categories_scopes" AS ENUM('place', 'event');
  CREATE TYPE "public"."enum_places_social_links_platform" AS ENUM('Facebook', 'Instagram', 'Website', 'TikTok');
  CREATE TYPE "public"."enum_places_opening_hours_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum_places_plan" AS ENUM('free', 'premium');
  CREATE TYPE "public"."enum_places_crm_status" AS ENUM('new', 'contacted', 'interested', 'rejected', 'active');
  CREATE TYPE "public"."enum_places_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__places_v_version_social_links_platform" AS ENUM('Facebook', 'Instagram', 'Website', 'TikTok');
  CREATE TYPE "public"."enum__places_v_version_opening_hours_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum__places_v_version_plan" AS ENUM('free', 'premium');
  CREATE TYPE "public"."enum__places_v_version_crm_status" AS ENUM('new', 'contacted', 'interested', 'rejected', 'active');
  CREATE TYPE "public"."enum__places_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_events_recurrence_days_of_week" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum_events_plan" AS ENUM('free', 'premium');
  CREATE TYPE "public"."enum_events_recurrence_frequency" AS ENUM('daily', 'weekly', 'monthly');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_recurrence_days_of_week" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum__events_v_version_plan" AS ENUM('free', 'premium');
  CREATE TYPE "public"."enum__events_v_version_recurrence_frequency" AS ENUM('daily', 'weekly', 'monthly');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_organizers_stripe_subscription_status" AS ENUM('active', 'trialing', 'incomplete', 'incomplete_expired', 'past_due', 'canceled', 'unpaid', 'paused');
  CREATE TYPE "public"."enum_organizers_collection_method" AS ENUM('charge_automatically', 'send_invoice');
  CREATE TYPE "public"."enum_inquiries_source_type" AS ENUM('places', 'events');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'contacted', 'enrolled', 'rejected');
  CREATE TYPE "public"."enum_claim_requests_status" AS ENUM('pending', 'verified', 'expired');
  CREATE TYPE "public"."enum_reviews_status" AS ENUM('published', 'pending', 'rejected');
  CREATE TYPE "public"."enum_attributes_type" AS ENUM('text', 'select', 'multi-select', 'boolean', 'range');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_blocks_banner_style" AS ENUM('rose', 'blue', 'dark');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_blocks_banner_style" AS ENUM('rose', 'blue', 'dark');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_newsletter_subscriptions_status" AS ENUM('active', 'unsubscribed');
  CREATE TYPE "public"."enum_mailings_template" AS ENUM('custom', 'partnership_offer', 'update_request');
  CREATE TYPE "public"."enum_mailings_recipients_type" AS ENUM('individual', 'city', 'category');
  CREATE TYPE "public"."enum_mailings_status" AS ENUM('draft', 'sent');
  CREATE TYPE "public"."enum_tickets_type" AS ENUM('one-time', 'pass', 'membership');
  CREATE TYPE "public"."enum_tickets_validity_unit" AS ENUM('days', 'months', 'years');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"surname" varchar NOT NULL,
  	"organizer_name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'media',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "categories_scopes" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_categories_scopes",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"icon" varchar NOT NULL,
  	"color" varchar NOT NULL,
  	"is_featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"is_popular" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "places_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "places_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_places_social_links_platform",
  	"url" varchar
  );
  
  CREATE TABLE "places_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"attribute_id" integer,
  	"value" varchar
  );
  
  CREATE TABLE "places_opening_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "enum_places_opening_hours_day",
  	"hours" varchar
  );
  
  CREATE TABLE "places" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"plan" "enum_places_plan" DEFAULT 'free',
  	"category_id" integer,
  	"organizer_id" integer,
  	"short_description" varchar,
  	"long_description" jsonb,
  	"logo_id" integer,
  	"street" varchar,
  	"postal_code" varchar,
  	"city_id" integer,
  	"country_code" varchar,
  	"latitude" numeric,
  	"longitude" numeric,
  	"phone_number" varchar,
  	"email" varchar,
  	"rating" numeric DEFAULT 0,
  	"review_count" numeric DEFAULT 0,
  	"owner_id" integer,
  	"is_free" boolean DEFAULT false,
  	"affiliate_booking_link" varchar,
  	"crm_status" "enum_places_crm_status" DEFAULT 'new',
  	"crm_notes" varchar,
  	"last_contacted" timestamp(3) with time zone,
  	"email_opt_out" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_places_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "places_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tickets_id" integer
  );
  
  CREATE TABLE "_places_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_places_v_version_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__places_v_version_social_links_platform",
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_places_v_version_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"attribute_id" integer,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_places_v_version_opening_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" "enum__places_v_version_opening_hours_day",
  	"hours" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_places_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_plan" "enum__places_v_version_plan" DEFAULT 'free',
  	"version_category_id" integer,
  	"version_organizer_id" integer,
  	"version_short_description" varchar,
  	"version_long_description" jsonb,
  	"version_logo_id" integer,
  	"version_street" varchar,
  	"version_postal_code" varchar,
  	"version_city_id" integer,
  	"version_country_code" varchar,
  	"version_latitude" numeric,
  	"version_longitude" numeric,
  	"version_phone_number" varchar,
  	"version_email" varchar,
  	"version_rating" numeric DEFAULT 0,
  	"version_review_count" numeric DEFAULT 0,
  	"version_owner_id" integer,
  	"version_is_free" boolean DEFAULT false,
  	"version_affiliate_booking_link" varchar,
  	"version_crm_status" "enum__places_v_version_crm_status" DEFAULT 'new',
  	"version_crm_notes" varchar,
  	"version_last_contacted" timestamp(3) with time zone,
  	"version_email_opt_out" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__places_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_places_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tickets_id" integer
  );
  
  CREATE TABLE "pricing_plans_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar
  );
  
  CREATE TABLE "pricing_plans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"stripepriceid_recurring" varchar,
  	"stripepriceid_onetime" varchar,
  	"stripepriceid_annual_recurring" varchar,
  	"stripepriceid_annual_onetime" varchar,
  	"planprice_recurring" numeric NOT NULL,
  	"planprice_onetime" numeric NOT NULL,
  	"planprice_annual_recurring" numeric,
  	"planprice_annual_onetime" numeric,
  	"description" varchar NOT NULL,
  	"max_places" numeric DEFAULT 1 NOT NULL,
  	"max_events" numeric DEFAULT 0 NOT NULL,
  	"is_premium" boolean DEFAULT false,
  	"is_featured" boolean DEFAULT false,
  	"button_text" varchar DEFAULT 'Wybierz',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "events_recurrence_days_of_week" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_events_recurrence_days_of_week",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "events_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "events_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"attribute_id" integer,
  	"value" varchar
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"plan" "enum_events_plan" DEFAULT 'free',
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"recurrence_is_recurring" boolean DEFAULT false,
  	"recurrence_frequency" "enum_events_recurrence_frequency" DEFAULT 'weekly',
  	"recurrence_interval" numeric DEFAULT 1,
  	"recurrence_recurrence_end_date" timestamp(3) with time zone,
  	"is_free" boolean DEFAULT true,
  	"age_range" varchar,
  	"place_id" integer,
  	"category_id" integer,
  	"organizer_id" integer,
  	"logo_id" integer,
  	"description" jsonb,
  	"owner_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tickets_id" integer
  );
  
  CREATE TABLE "_events_v_version_recurrence_days_of_week" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__events_v_version_recurrence_days_of_week",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_events_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v_version_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"attribute_id" integer,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_plan" "enum__events_v_version_plan" DEFAULT 'free',
  	"version_start_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_recurrence_is_recurring" boolean DEFAULT false,
  	"version_recurrence_frequency" "enum__events_v_version_recurrence_frequency" DEFAULT 'weekly',
  	"version_recurrence_interval" numeric DEFAULT 1,
  	"version_recurrence_recurrence_end_date" timestamp(3) with time zone,
  	"version_is_free" boolean DEFAULT true,
  	"version_age_range" varchar,
  	"version_place_id" integer,
  	"version_category_id" integer,
  	"version_organizer_id" integer,
  	"version_logo_id" integer,
  	"version_description" jsonb,
  	"version_owner_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_events_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tickets_id" integer
  );
  
  CREATE TABLE "organizers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"owner_id" integer,
  	"slug" varchar NOT NULL,
  	"email" varchar,
  	"phone" varchar,
  	"website" varchar,
  	"plan_id" integer,
  	"billing_company_name" varchar,
  	"billing_nip" varchar,
  	"billing_address" varchar,
  	"billing_city" varchar,
  	"billing_postal_code" varchar,
  	"stripe_customer_id" varchar,
  	"stripe_subscription_id" varchar,
  	"stripe_subscription_status" "enum_organizers_stripe_subscription_status",
  	"premium_expires_at" timestamp(3) with time zone,
  	"collection_method" "enum_organizers_collection_method" DEFAULT 'send_invoice',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"message" varchar NOT NULL,
  	"source_type" "enum_inquiries_source_type" NOT NULL,
  	"source_id" varchar NOT NULL,
  	"status" "enum_inquiries_status" DEFAULT 'new' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "claim_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"place_id" integer NOT NULL,
  	"user_id" integer,
  	"email" varchar NOT NULL,
  	"token" varchar NOT NULL,
  	"status" "enum_claim_requests_status" DEFAULT 'pending' NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"place_id" integer NOT NULL,
  	"user_id" integer NOT NULL,
  	"rating" numeric NOT NULL,
  	"content" varchar NOT NULL,
  	"reply" varchar,
  	"reply_date" timestamp(3) with time zone,
  	"status" "enum_reviews_status" DEFAULT 'published',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "attribute_groups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "attributes_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "attributes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"type" "enum_attributes_type" NOT NULL,
  	"group_id" integer NOT NULL,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "attributes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"content" jsonb NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_pages_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"link" varchar,
  	"button_label" varchar DEFAULT 'Dowiedz się więcej',
  	"style" "enum_posts_blocks_banner_style" DEFAULT 'rose',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_related_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Polecane miejsca i wydarzenia',
  	"block_name" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"hero_image_id" integer,
  	"category_id" integer,
  	"excerpt" varchar,
  	"slug" varchar,
  	"published_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"places_id" integer,
  	"events_id" integer
  );
  
  CREATE TABLE "_posts_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"link" varchar,
  	"button_label" varchar DEFAULT 'Dowiedz się więcej',
  	"style" "enum__posts_v_blocks_banner_style" DEFAULT 'rose',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_related_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Polecane miejsca i wydarzenia',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_hero_image_id" integer,
  	"version_category_id" integer,
  	"version_excerpt" varchar,
  	"version_slug" varchar,
  	"version_published_date" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"places_id" integer,
  	"events_id" integer
  );
  
  CREATE TABLE "post_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "newsletter_subscriptions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"name" varchar,
  	"city" varchar,
  	"consent" boolean DEFAULT false NOT NULL,
  	"status" "enum_newsletter_subscriptions_status" DEFAULT 'active',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "mailings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"template" "enum_mailings_template" DEFAULT 'custom',
  	"subject" varchar,
  	"content" jsonb,
  	"recipients_type" "enum_mailings_recipients_type" DEFAULT 'individual',
  	"city_id" integer,
  	"category_id" integer,
  	"status" "enum_mailings_status" DEFAULT 'draft',
  	"sent_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "mailings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"places_id" integer
  );
  
  CREATE TABLE "tickets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"price" numeric NOT NULL,
  	"description" varchar,
  	"type" "enum_tickets_type" DEFAULT 'one-time',
  	"entries" numeric DEFAULT 1,
  	"validity_value" numeric,
  	"validity_unit" "enum_tickets_validity_unit" DEFAULT 'days',
  	"limit" numeric,
  	"event_id" integer,
  	"place_id" integer,
  	"owner_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"categories_id" integer,
  	"cities_id" integer,
  	"places_id" integer,
  	"pricing_plans_id" integer,
  	"events_id" integer,
  	"organizers_id" integer,
  	"inquiries_id" integer,
  	"claim_requests_id" integer,
  	"reviews_id" integer,
  	"attribute_groups_id" integer,
  	"attributes_id" integer,
  	"pages_id" integer,
  	"posts_id" integer,
  	"post_categories_id" integer,
  	"newsletter_subscriptions_id" integer,
  	"mailings_id" integer,
  	"tickets_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_scopes" ADD CONSTRAINT "categories_scopes_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "places_gallery" ADD CONSTRAINT "places_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "places_gallery" ADD CONSTRAINT "places_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "places_social_links" ADD CONSTRAINT "places_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "places_features" ADD CONSTRAINT "places_features_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "places_features" ADD CONSTRAINT "places_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "places_opening_hours" ADD CONSTRAINT "places_opening_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "places" ADD CONSTRAINT "places_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "places" ADD CONSTRAINT "places_organizer_id_organizers_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."organizers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "places" ADD CONSTRAINT "places_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "places" ADD CONSTRAINT "places_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "places" ADD CONSTRAINT "places_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "places_rels" ADD CONSTRAINT "places_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "places_rels" ADD CONSTRAINT "places_rels_tickets_fk" FOREIGN KEY ("tickets_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_places_v_version_gallery" ADD CONSTRAINT "_places_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_places_v_version_gallery" ADD CONSTRAINT "_places_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_places_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_places_v_version_social_links" ADD CONSTRAINT "_places_v_version_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_places_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_places_v_version_features" ADD CONSTRAINT "_places_v_version_features_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_places_v_version_features" ADD CONSTRAINT "_places_v_version_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_places_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_places_v_version_opening_hours" ADD CONSTRAINT "_places_v_version_opening_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_places_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_places_v" ADD CONSTRAINT "_places_v_parent_id_places_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."places"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_places_v" ADD CONSTRAINT "_places_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_places_v" ADD CONSTRAINT "_places_v_version_organizer_id_organizers_id_fk" FOREIGN KEY ("version_organizer_id") REFERENCES "public"."organizers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_places_v" ADD CONSTRAINT "_places_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_places_v" ADD CONSTRAINT "_places_v_version_city_id_cities_id_fk" FOREIGN KEY ("version_city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_places_v" ADD CONSTRAINT "_places_v_version_owner_id_users_id_fk" FOREIGN KEY ("version_owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_places_v_rels" ADD CONSTRAINT "_places_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_places_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_places_v_rels" ADD CONSTRAINT "_places_v_rels_tickets_fk" FOREIGN KEY ("tickets_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pricing_plans_features" ADD CONSTRAINT "pricing_plans_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_recurrence_days_of_week" ADD CONSTRAINT "events_recurrence_days_of_week_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_gallery" ADD CONSTRAINT "events_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_gallery" ADD CONSTRAINT "events_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_features" ADD CONSTRAINT "events_features_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_features" ADD CONSTRAINT "events_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_organizer_id_organizers_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."organizers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_tickets_fk" FOREIGN KEY ("tickets_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_recurrence_days_of_week" ADD CONSTRAINT "_events_v_version_recurrence_days_of_week_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_gallery" ADD CONSTRAINT "_events_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_version_gallery" ADD CONSTRAINT "_events_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_features" ADD CONSTRAINT "_events_v_version_features_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_version_features" ADD CONSTRAINT "_events_v_version_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_place_id_places_id_fk" FOREIGN KEY ("version_place_id") REFERENCES "public"."places"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_organizer_id_organizers_id_fk" FOREIGN KEY ("version_organizer_id") REFERENCES "public"."organizers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_owner_id_users_id_fk" FOREIGN KEY ("version_owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_tickets_fk" FOREIGN KEY ("tickets_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "organizers" ADD CONSTRAINT "organizers_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "organizers" ADD CONSTRAINT "organizers_plan_id_pricing_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."pricing_plans"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "claim_requests" ADD CONSTRAINT "claim_requests_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "claim_requests" ADD CONSTRAINT "claim_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "attributes_options" ADD CONSTRAINT "attributes_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."attributes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "attributes" ADD CONSTRAINT "attributes_group_id_attribute_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."attribute_groups"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "attributes_rels" ADD CONSTRAINT "attributes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."attributes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "attributes_rels" ADD CONSTRAINT "attributes_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_rich_text" ADD CONSTRAINT "posts_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_banner" ADD CONSTRAINT "posts_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_related_items" ADD CONSTRAINT "posts_blocks_related_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_post_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."post_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_places_fk" FOREIGN KEY ("places_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_rich_text" ADD CONSTRAINT "_posts_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_banner" ADD CONSTRAINT "_posts_v_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_related_items" ADD CONSTRAINT "_posts_v_blocks_related_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_category_id_post_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."post_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_places_fk" FOREIGN KEY ("places_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "mailings" ADD CONSTRAINT "mailings_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mailings" ADD CONSTRAINT "mailings_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "mailings_rels" ADD CONSTRAINT "mailings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."mailings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "mailings_rels" ADD CONSTRAINT "mailings_rels_places_fk" FOREIGN KEY ("places_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tickets" ADD CONSTRAINT "tickets_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tickets" ADD CONSTRAINT "tickets_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tickets" ADD CONSTRAINT "tickets_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cities_fk" FOREIGN KEY ("cities_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_places_fk" FOREIGN KEY ("places_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pricing_plans_fk" FOREIGN KEY ("pricing_plans_id") REFERENCES "public"."pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_organizers_fk" FOREIGN KEY ("organizers_id") REFERENCES "public"."organizers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_claim_requests_fk" FOREIGN KEY ("claim_requests_id") REFERENCES "public"."claim_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_attribute_groups_fk" FOREIGN KEY ("attribute_groups_id") REFERENCES "public"."attribute_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_attributes_fk" FOREIGN KEY ("attributes_id") REFERENCES "public"."attributes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletter_subscriptions_fk" FOREIGN KEY ("newsletter_subscriptions_id") REFERENCES "public"."newsletter_subscriptions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mailings_fk" FOREIGN KEY ("mailings_id") REFERENCES "public"."mailings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tickets_fk" FOREIGN KEY ("tickets_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "categories_scopes_order_idx" ON "categories_scopes" USING btree ("order");
  CREATE INDEX "categories_scopes_parent_idx" ON "categories_scopes" USING btree ("parent_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "cities_name_idx" ON "cities" USING btree ("name");
  CREATE INDEX "cities_updated_at_idx" ON "cities" USING btree ("updated_at");
  CREATE INDEX "cities_created_at_idx" ON "cities" USING btree ("created_at");
  CREATE INDEX "places_gallery_order_idx" ON "places_gallery" USING btree ("_order");
  CREATE INDEX "places_gallery_parent_id_idx" ON "places_gallery" USING btree ("_parent_id");
  CREATE INDEX "places_gallery_image_idx" ON "places_gallery" USING btree ("image_id");
  CREATE INDEX "places_social_links_order_idx" ON "places_social_links" USING btree ("_order");
  CREATE INDEX "places_social_links_parent_id_idx" ON "places_social_links" USING btree ("_parent_id");
  CREATE INDEX "places_features_order_idx" ON "places_features" USING btree ("_order");
  CREATE INDEX "places_features_parent_id_idx" ON "places_features" USING btree ("_parent_id");
  CREATE INDEX "places_features_attribute_idx" ON "places_features" USING btree ("attribute_id");
  CREATE INDEX "places_opening_hours_order_idx" ON "places_opening_hours" USING btree ("_order");
  CREATE INDEX "places_opening_hours_parent_id_idx" ON "places_opening_hours" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "places_slug_idx" ON "places" USING btree ("slug");
  CREATE INDEX "places_category_idx" ON "places" USING btree ("category_id");
  CREATE INDEX "places_organizer_idx" ON "places" USING btree ("organizer_id");
  CREATE INDEX "places_logo_idx" ON "places" USING btree ("logo_id");
  CREATE INDEX "places_city_idx" ON "places" USING btree ("city_id");
  CREATE INDEX "places_owner_idx" ON "places" USING btree ("owner_id");
  CREATE INDEX "places_updated_at_idx" ON "places" USING btree ("updated_at");
  CREATE INDEX "places_created_at_idx" ON "places" USING btree ("created_at");
  CREATE INDEX "places__status_idx" ON "places" USING btree ("_status");
  CREATE INDEX "places_rels_order_idx" ON "places_rels" USING btree ("order");
  CREATE INDEX "places_rels_parent_idx" ON "places_rels" USING btree ("parent_id");
  CREATE INDEX "places_rels_path_idx" ON "places_rels" USING btree ("path");
  CREATE INDEX "places_rels_tickets_id_idx" ON "places_rels" USING btree ("tickets_id");
  CREATE INDEX "_places_v_version_gallery_order_idx" ON "_places_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_places_v_version_gallery_parent_id_idx" ON "_places_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_places_v_version_gallery_image_idx" ON "_places_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_places_v_version_social_links_order_idx" ON "_places_v_version_social_links" USING btree ("_order");
  CREATE INDEX "_places_v_version_social_links_parent_id_idx" ON "_places_v_version_social_links" USING btree ("_parent_id");
  CREATE INDEX "_places_v_version_features_order_idx" ON "_places_v_version_features" USING btree ("_order");
  CREATE INDEX "_places_v_version_features_parent_id_idx" ON "_places_v_version_features" USING btree ("_parent_id");
  CREATE INDEX "_places_v_version_features_attribute_idx" ON "_places_v_version_features" USING btree ("attribute_id");
  CREATE INDEX "_places_v_version_opening_hours_order_idx" ON "_places_v_version_opening_hours" USING btree ("_order");
  CREATE INDEX "_places_v_version_opening_hours_parent_id_idx" ON "_places_v_version_opening_hours" USING btree ("_parent_id");
  CREATE INDEX "_places_v_parent_idx" ON "_places_v" USING btree ("parent_id");
  CREATE INDEX "_places_v_version_version_slug_idx" ON "_places_v" USING btree ("version_slug");
  CREATE INDEX "_places_v_version_version_category_idx" ON "_places_v" USING btree ("version_category_id");
  CREATE INDEX "_places_v_version_version_organizer_idx" ON "_places_v" USING btree ("version_organizer_id");
  CREATE INDEX "_places_v_version_version_logo_idx" ON "_places_v" USING btree ("version_logo_id");
  CREATE INDEX "_places_v_version_version_city_idx" ON "_places_v" USING btree ("version_city_id");
  CREATE INDEX "_places_v_version_version_owner_idx" ON "_places_v" USING btree ("version_owner_id");
  CREATE INDEX "_places_v_version_version_updated_at_idx" ON "_places_v" USING btree ("version_updated_at");
  CREATE INDEX "_places_v_version_version_created_at_idx" ON "_places_v" USING btree ("version_created_at");
  CREATE INDEX "_places_v_version_version__status_idx" ON "_places_v" USING btree ("version__status");
  CREATE INDEX "_places_v_created_at_idx" ON "_places_v" USING btree ("created_at");
  CREATE INDEX "_places_v_updated_at_idx" ON "_places_v" USING btree ("updated_at");
  CREATE INDEX "_places_v_latest_idx" ON "_places_v" USING btree ("latest");
  CREATE INDEX "_places_v_rels_order_idx" ON "_places_v_rels" USING btree ("order");
  CREATE INDEX "_places_v_rels_parent_idx" ON "_places_v_rels" USING btree ("parent_id");
  CREATE INDEX "_places_v_rels_path_idx" ON "_places_v_rels" USING btree ("path");
  CREATE INDEX "_places_v_rels_tickets_id_idx" ON "_places_v_rels" USING btree ("tickets_id");
  CREATE INDEX "pricing_plans_features_order_idx" ON "pricing_plans_features" USING btree ("_order");
  CREATE INDEX "pricing_plans_features_parent_id_idx" ON "pricing_plans_features" USING btree ("_parent_id");
  CREATE INDEX "pricing_plans_updated_at_idx" ON "pricing_plans" USING btree ("updated_at");
  CREATE INDEX "pricing_plans_created_at_idx" ON "pricing_plans" USING btree ("created_at");
  CREATE INDEX "events_recurrence_days_of_week_order_idx" ON "events_recurrence_days_of_week" USING btree ("order");
  CREATE INDEX "events_recurrence_days_of_week_parent_idx" ON "events_recurrence_days_of_week" USING btree ("parent_id");
  CREATE INDEX "events_gallery_order_idx" ON "events_gallery" USING btree ("_order");
  CREATE INDEX "events_gallery_parent_id_idx" ON "events_gallery" USING btree ("_parent_id");
  CREATE INDEX "events_gallery_image_idx" ON "events_gallery" USING btree ("image_id");
  CREATE INDEX "events_features_order_idx" ON "events_features" USING btree ("_order");
  CREATE INDEX "events_features_parent_id_idx" ON "events_features" USING btree ("_parent_id");
  CREATE INDEX "events_features_attribute_idx" ON "events_features" USING btree ("attribute_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_place_idx" ON "events" USING btree ("place_id");
  CREATE INDEX "events_category_idx" ON "events" USING btree ("category_id");
  CREATE INDEX "events_organizer_idx" ON "events" USING btree ("organizer_id");
  CREATE INDEX "events_logo_idx" ON "events" USING btree ("logo_id");
  CREATE INDEX "events_owner_idx" ON "events" USING btree ("owner_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX "events_rels_tickets_id_idx" ON "events_rels" USING btree ("tickets_id");
  CREATE INDEX "_events_v_version_recurrence_days_of_week_order_idx" ON "_events_v_version_recurrence_days_of_week" USING btree ("order");
  CREATE INDEX "_events_v_version_recurrence_days_of_week_parent_idx" ON "_events_v_version_recurrence_days_of_week" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_gallery_order_idx" ON "_events_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_events_v_version_gallery_parent_id_idx" ON "_events_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_gallery_image_idx" ON "_events_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_events_v_version_features_order_idx" ON "_events_v_version_features" USING btree ("_order");
  CREATE INDEX "_events_v_version_features_parent_id_idx" ON "_events_v_version_features" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_features_attribute_idx" ON "_events_v_version_features" USING btree ("attribute_id");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_place_idx" ON "_events_v" USING btree ("version_place_id");
  CREATE INDEX "_events_v_version_version_category_idx" ON "_events_v" USING btree ("version_category_id");
  CREATE INDEX "_events_v_version_version_organizer_idx" ON "_events_v" USING btree ("version_organizer_id");
  CREATE INDEX "_events_v_version_version_logo_idx" ON "_events_v" USING btree ("version_logo_id");
  CREATE INDEX "_events_v_version_version_owner_idx" ON "_events_v" USING btree ("version_owner_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "_events_v_rels_order_idx" ON "_events_v_rels" USING btree ("order");
  CREATE INDEX "_events_v_rels_parent_idx" ON "_events_v_rels" USING btree ("parent_id");
  CREATE INDEX "_events_v_rels_path_idx" ON "_events_v_rels" USING btree ("path");
  CREATE INDEX "_events_v_rels_tickets_id_idx" ON "_events_v_rels" USING btree ("tickets_id");
  CREATE INDEX "organizers_owner_idx" ON "organizers" USING btree ("owner_id");
  CREATE UNIQUE INDEX "organizers_slug_idx" ON "organizers" USING btree ("slug");
  CREATE INDEX "organizers_plan_idx" ON "organizers" USING btree ("plan_id");
  CREATE INDEX "organizers_updated_at_idx" ON "organizers" USING btree ("updated_at");
  CREATE INDEX "organizers_created_at_idx" ON "organizers" USING btree ("created_at");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX "claim_requests_place_idx" ON "claim_requests" USING btree ("place_id");
  CREATE INDEX "claim_requests_user_idx" ON "claim_requests" USING btree ("user_id");
  CREATE INDEX "claim_requests_token_idx" ON "claim_requests" USING btree ("token");
  CREATE INDEX "claim_requests_updated_at_idx" ON "claim_requests" USING btree ("updated_at");
  CREATE INDEX "claim_requests_created_at_idx" ON "claim_requests" USING btree ("created_at");
  CREATE INDEX "reviews_place_idx" ON "reviews" USING btree ("place_id");
  CREATE INDEX "reviews_user_idx" ON "reviews" USING btree ("user_id");
  CREATE INDEX "reviews_updated_at_idx" ON "reviews" USING btree ("updated_at");
  CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
  CREATE UNIQUE INDEX "attribute_groups_slug_idx" ON "attribute_groups" USING btree ("slug");
  CREATE INDEX "attribute_groups_updated_at_idx" ON "attribute_groups" USING btree ("updated_at");
  CREATE INDEX "attribute_groups_created_at_idx" ON "attribute_groups" USING btree ("created_at");
  CREATE INDEX "attributes_options_order_idx" ON "attributes_options" USING btree ("_order");
  CREATE INDEX "attributes_options_parent_id_idx" ON "attributes_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "attributes_slug_idx" ON "attributes" USING btree ("slug");
  CREATE INDEX "attributes_group_idx" ON "attributes" USING btree ("group_id");
  CREATE INDEX "attributes_updated_at_idx" ON "attributes" USING btree ("updated_at");
  CREATE INDEX "attributes_created_at_idx" ON "attributes" USING btree ("created_at");
  CREATE INDEX "attributes_rels_order_idx" ON "attributes_rels" USING btree ("order");
  CREATE INDEX "attributes_rels_parent_idx" ON "attributes_rels" USING btree ("parent_id");
  CREATE INDEX "attributes_rels_path_idx" ON "attributes_rels" USING btree ("path");
  CREATE INDEX "attributes_rels_categories_id_idx" ON "attributes_rels" USING btree ("categories_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "posts_blocks_rich_text_order_idx" ON "posts_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "posts_blocks_rich_text_parent_id_idx" ON "posts_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_rich_text_path_idx" ON "posts_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "posts_blocks_banner_order_idx" ON "posts_blocks_banner" USING btree ("_order");
  CREATE INDEX "posts_blocks_banner_parent_id_idx" ON "posts_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_banner_path_idx" ON "posts_blocks_banner" USING btree ("_path");
  CREATE INDEX "posts_blocks_related_items_order_idx" ON "posts_blocks_related_items" USING btree ("_order");
  CREATE INDEX "posts_blocks_related_items_parent_id_idx" ON "posts_blocks_related_items" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_related_items_path_idx" ON "posts_blocks_related_items" USING btree ("_path");
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_places_id_idx" ON "posts_rels" USING btree ("places_id");
  CREATE INDEX "posts_rels_events_id_idx" ON "posts_rels" USING btree ("events_id");
  CREATE INDEX "_posts_v_blocks_rich_text_order_idx" ON "_posts_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_rich_text_parent_id_idx" ON "_posts_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_rich_text_path_idx" ON "_posts_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_banner_order_idx" ON "_posts_v_blocks_banner" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_banner_parent_id_idx" ON "_posts_v_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_banner_path_idx" ON "_posts_v_blocks_banner" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_related_items_order_idx" ON "_posts_v_blocks_related_items" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_related_items_parent_id_idx" ON "_posts_v_blocks_related_items" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_related_items_path_idx" ON "_posts_v_blocks_related_items" USING btree ("_path");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_posts_v_version_version_category_idx" ON "_posts_v" USING btree ("version_category_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_places_id_idx" ON "_posts_v_rels" USING btree ("places_id");
  CREATE INDEX "_posts_v_rels_events_id_idx" ON "_posts_v_rels" USING btree ("events_id");
  CREATE UNIQUE INDEX "post_categories_slug_idx" ON "post_categories" USING btree ("slug");
  CREATE INDEX "post_categories_updated_at_idx" ON "post_categories" USING btree ("updated_at");
  CREATE INDEX "post_categories_created_at_idx" ON "post_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "newsletter_subscriptions_email_idx" ON "newsletter_subscriptions" USING btree ("email");
  CREATE INDEX "newsletter_subscriptions_updated_at_idx" ON "newsletter_subscriptions" USING btree ("updated_at");
  CREATE INDEX "newsletter_subscriptions_created_at_idx" ON "newsletter_subscriptions" USING btree ("created_at");
  CREATE INDEX "mailings_city_idx" ON "mailings" USING btree ("city_id");
  CREATE INDEX "mailings_category_idx" ON "mailings" USING btree ("category_id");
  CREATE INDEX "mailings_updated_at_idx" ON "mailings" USING btree ("updated_at");
  CREATE INDEX "mailings_created_at_idx" ON "mailings" USING btree ("created_at");
  CREATE INDEX "mailings_rels_order_idx" ON "mailings_rels" USING btree ("order");
  CREATE INDEX "mailings_rels_parent_idx" ON "mailings_rels" USING btree ("parent_id");
  CREATE INDEX "mailings_rels_path_idx" ON "mailings_rels" USING btree ("path");
  CREATE INDEX "mailings_rels_places_id_idx" ON "mailings_rels" USING btree ("places_id");
  CREATE INDEX "tickets_event_idx" ON "tickets" USING btree ("event_id");
  CREATE INDEX "tickets_place_idx" ON "tickets" USING btree ("place_id");
  CREATE INDEX "tickets_owner_idx" ON "tickets" USING btree ("owner_id");
  CREATE INDEX "tickets_updated_at_idx" ON "tickets" USING btree ("updated_at");
  CREATE INDEX "tickets_created_at_idx" ON "tickets" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_cities_id_idx" ON "payload_locked_documents_rels" USING btree ("cities_id");
  CREATE INDEX "payload_locked_documents_rels_places_id_idx" ON "payload_locked_documents_rels" USING btree ("places_id");
  CREATE INDEX "payload_locked_documents_rels_pricing_plans_id_idx" ON "payload_locked_documents_rels" USING btree ("pricing_plans_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_organizers_id_idx" ON "payload_locked_documents_rels" USING btree ("organizers_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_claim_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("claim_requests_id");
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reviews_id");
  CREATE INDEX "payload_locked_documents_rels_attribute_groups_id_idx" ON "payload_locked_documents_rels" USING btree ("attribute_groups_id");
  CREATE INDEX "payload_locked_documents_rels_attributes_id_idx" ON "payload_locked_documents_rels" USING btree ("attributes_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_post_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("post_categories_id");
  CREATE INDEX "payload_locked_documents_rels_newsletter_subscriptions_i_idx" ON "payload_locked_documents_rels" USING btree ("newsletter_subscriptions_id");
  CREATE INDEX "payload_locked_documents_rels_mailings_id_idx" ON "payload_locked_documents_rels" USING btree ("mailings_id");
  CREATE INDEX "payload_locked_documents_rels_tickets_id_idx" ON "payload_locked_documents_rels" USING btree ("tickets_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "categories_scopes" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "cities" CASCADE;
  DROP TABLE "places_gallery" CASCADE;
  DROP TABLE "places_social_links" CASCADE;
  DROP TABLE "places_features" CASCADE;
  DROP TABLE "places_opening_hours" CASCADE;
  DROP TABLE "places" CASCADE;
  DROP TABLE "places_rels" CASCADE;
  DROP TABLE "_places_v_version_gallery" CASCADE;
  DROP TABLE "_places_v_version_social_links" CASCADE;
  DROP TABLE "_places_v_version_features" CASCADE;
  DROP TABLE "_places_v_version_opening_hours" CASCADE;
  DROP TABLE "_places_v" CASCADE;
  DROP TABLE "_places_v_rels" CASCADE;
  DROP TABLE "pricing_plans_features" CASCADE;
  DROP TABLE "pricing_plans" CASCADE;
  DROP TABLE "events_recurrence_days_of_week" CASCADE;
  DROP TABLE "events_gallery" CASCADE;
  DROP TABLE "events_features" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_rels" CASCADE;
  DROP TABLE "_events_v_version_recurrence_days_of_week" CASCADE;
  DROP TABLE "_events_v_version_gallery" CASCADE;
  DROP TABLE "_events_v_version_features" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "_events_v_rels" CASCADE;
  DROP TABLE "organizers" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "claim_requests" CASCADE;
  DROP TABLE "reviews" CASCADE;
  DROP TABLE "attribute_groups" CASCADE;
  DROP TABLE "attributes_options" CASCADE;
  DROP TABLE "attributes" CASCADE;
  DROP TABLE "attributes_rels" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "posts_blocks_rich_text" CASCADE;
  DROP TABLE "posts_blocks_banner" CASCADE;
  DROP TABLE "posts_blocks_related_items" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_blocks_rich_text" CASCADE;
  DROP TABLE "_posts_v_blocks_banner" CASCADE;
  DROP TABLE "_posts_v_blocks_related_items" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "post_categories" CASCADE;
  DROP TABLE "newsletter_subscriptions" CASCADE;
  DROP TABLE "mailings" CASCADE;
  DROP TABLE "mailings_rels" CASCADE;
  DROP TABLE "tickets" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_categories_scopes";
  DROP TYPE "public"."enum_places_social_links_platform";
  DROP TYPE "public"."enum_places_opening_hours_day";
  DROP TYPE "public"."enum_places_plan";
  DROP TYPE "public"."enum_places_crm_status";
  DROP TYPE "public"."enum_places_status";
  DROP TYPE "public"."enum__places_v_version_social_links_platform";
  DROP TYPE "public"."enum__places_v_version_opening_hours_day";
  DROP TYPE "public"."enum__places_v_version_plan";
  DROP TYPE "public"."enum__places_v_version_crm_status";
  DROP TYPE "public"."enum__places_v_version_status";
  DROP TYPE "public"."enum_events_recurrence_days_of_week";
  DROP TYPE "public"."enum_events_plan";
  DROP TYPE "public"."enum_events_recurrence_frequency";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_recurrence_days_of_week";
  DROP TYPE "public"."enum__events_v_version_plan";
  DROP TYPE "public"."enum__events_v_version_recurrence_frequency";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum_organizers_stripe_subscription_status";
  DROP TYPE "public"."enum_organizers_collection_method";
  DROP TYPE "public"."enum_inquiries_source_type";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_claim_requests_status";
  DROP TYPE "public"."enum_reviews_status";
  DROP TYPE "public"."enum_attributes_type";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum_posts_blocks_banner_style";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_blocks_banner_style";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_newsletter_subscriptions_status";
  DROP TYPE "public"."enum_mailings_template";
  DROP TYPE "public"."enum_mailings_recipients_type";
  DROP TYPE "public"."enum_mailings_status";
  DROP TYPE "public"."enum_tickets_type";
  DROP TYPE "public"."enum_tickets_validity_unit";`)
}
