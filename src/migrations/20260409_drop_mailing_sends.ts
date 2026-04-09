import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "mailing_sends" CASCADE;
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "mailing_sends_id";
    DROP TYPE IF EXISTS "public"."enum_mailing_sends_status";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_mailing_sends_status" AS ENUM('sent', 'skipped', 'failed');
    CREATE TABLE "mailing_sends" (
      "id" serial PRIMARY KEY NOT NULL,
      "mailing_id" integer NOT NULL,
      "place_id" integer NOT NULL,
      "status" "enum_mailing_sends_status",
      "sent_at" timestamp(3) with time zone,
      "skip_reason" varchar,
      "error" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "mailing_sends_id" integer;
    ALTER TABLE "mailing_sends" ADD CONSTRAINT "mailing_sends_mailing_id_mailings_id_fk" FOREIGN KEY ("mailing_id") REFERENCES "public"."mailings"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "mailing_sends" ADD CONSTRAINT "mailing_sends_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX "mailing_sends_mailing_idx" ON "mailing_sends" USING btree ("mailing_id");
    CREATE INDEX "mailing_sends_place_idx" ON "mailing_sends" USING btree ("place_id");
    CREATE INDEX "mailing_sends_updated_at_idx" ON "mailing_sends" USING btree ("updated_at");
    CREATE INDEX "mailing_sends_created_at_idx" ON "mailing_sends" USING btree ("created_at");
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mailing_sends_fk" FOREIGN KEY ("mailing_sends_id") REFERENCES "public"."mailing_sends"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "payload_locked_documents_rels_mailing_sends_id_idx" ON "payload_locked_documents_rels" USING btree ("mailing_sends_id");
  `)
}
