import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "mailings_id";
    DROP TABLE IF EXISTS "mailings_rels" CASCADE;
    DROP TABLE IF EXISTS "mailings" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_mailings_template";
    DROP TYPE IF EXISTS "public"."enum_mailings_recipients_type";
    DROP TYPE IF EXISTS "public"."enum_mailings_status";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_mailings_template" AS ENUM('custom', 'partnership_offer', 'update_request');
    CREATE TYPE "public"."enum_mailings_recipients_type" AS ENUM('individual', 'city', 'category');
    CREATE TYPE "public"."enum_mailings_status" AS ENUM('draft', 'sent');
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
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "mailings_id" integer;
    ALTER TABLE "mailings" ADD CONSTRAINT "mailings_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "mailings" ADD CONSTRAINT "mailings_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "mailings_rels" ADD CONSTRAINT "mailings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."mailings"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "mailings_rels" ADD CONSTRAINT "mailings_rels_places_fk" FOREIGN KEY ("places_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mailings_fk" FOREIGN KEY ("mailings_id") REFERENCES "public"."mailings"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "mailings_city_idx" ON "mailings" USING btree ("city_id");
    CREATE INDEX "mailings_category_idx" ON "mailings" USING btree ("category_id");
    CREATE INDEX "mailings_updated_at_idx" ON "mailings" USING btree ("updated_at");
    CREATE INDEX "mailings_created_at_idx" ON "mailings" USING btree ("created_at");
    CREATE INDEX "mailings_rels_order_idx" ON "mailings_rels" USING btree ("order");
    CREATE INDEX "mailings_rels_parent_idx" ON "mailings_rels" USING btree ("parent_id");
    CREATE INDEX "mailings_rels_path_idx" ON "mailings_rels" USING btree ("path");
    CREATE INDEX "mailings_rels_places_id_idx" ON "mailings_rels" USING btree ("places_id");
    CREATE INDEX "payload_locked_documents_rels_mailings_id_idx" ON "payload_locked_documents_rels" USING btree ("mailings_id");
  `)
}
