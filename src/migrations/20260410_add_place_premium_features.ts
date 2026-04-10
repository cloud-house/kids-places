import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_places_blocks_story_image_size" AS ENUM('full', 'centered');
    CREATE TYPE "public"."enum__places_v_blocks_story_image_size" AS ENUM('full', 'centered');

    -- places story blocks (published) — id as varchar (Payload manages these)
    CREATE TABLE "places_blocks_story_text" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "content" jsonb,
      "block_name" varchar
    );
    CREATE TABLE "places_blocks_story_image" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "caption" varchar,
      "size" "enum_places_blocks_story_image_size" DEFAULT 'full',
      "block_name" varchar
    );
    CREATE TABLE "places_blocks_story_gallery" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "caption" varchar,
      "block_name" varchar
    );
    CREATE TABLE "places_blocks_story_gallery_images" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer
    );

    -- _places_v story blocks (versions) — id as serial (Payload inserts with DEFAULT)
    CREATE TABLE "_places_v_blocks_story_text" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "content" jsonb,
      "_uuid" varchar,
      "block_name" varchar
    );
    CREATE TABLE "_places_v_blocks_story_image" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "caption" varchar,
      "size" "enum__places_v_blocks_story_image_size" DEFAULT 'full',
      "_uuid" varchar,
      "block_name" varchar
    );
    CREATE TABLE "_places_v_blocks_story_gallery" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "caption" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );
    CREATE TABLE "_places_v_blocks_story_gallery_images" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "_uuid" varchar
    );

    -- foreign keys: places blocks
    ALTER TABLE "places_blocks_story_text"
      ADD CONSTRAINT "places_blocks_story_text_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "places_blocks_story_image"
      ADD CONSTRAINT "places_blocks_story_image_image_id_media_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "places_blocks_story_image"
      ADD CONSTRAINT "places_blocks_story_image_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "places_blocks_story_gallery"
      ADD CONSTRAINT "places_blocks_story_gallery_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "places_blocks_story_gallery_images"
      ADD CONSTRAINT "places_blocks_story_gallery_images_image_id_media_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "places_blocks_story_gallery_images"
      ADD CONSTRAINT "places_blocks_story_gallery_images_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."places_blocks_story_gallery"("id") ON DELETE cascade ON UPDATE no action;

    -- foreign keys: _places_v blocks
    ALTER TABLE "_places_v_blocks_story_text"
      ADD CONSTRAINT "_places_v_blocks_story_text_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_places_v"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_places_v_blocks_story_image"
      ADD CONSTRAINT "_places_v_blocks_story_image_image_id_media_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_places_v_blocks_story_image"
      ADD CONSTRAINT "_places_v_blocks_story_image_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_places_v"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_places_v_blocks_story_gallery"
      ADD CONSTRAINT "_places_v_blocks_story_gallery_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_places_v"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_places_v_blocks_story_gallery_images"
      ADD CONSTRAINT "_places_v_blocks_story_gallery_images_image_id_media_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_places_v_blocks_story_gallery_images"
      ADD CONSTRAINT "_places_v_blocks_story_gallery_images_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_places_v_blocks_story_gallery"("id") ON DELETE cascade ON UPDATE no action;

    -- indexes: places blocks
    CREATE INDEX "places_blocks_story_text_order_idx" ON "places_blocks_story_text" USING btree ("_order");
    CREATE INDEX "places_blocks_story_text_parent_id_idx" ON "places_blocks_story_text" USING btree ("_parent_id");
    CREATE INDEX "places_blocks_story_text_path_idx" ON "places_blocks_story_text" USING btree ("_path");
    CREATE INDEX "places_blocks_story_image_order_idx" ON "places_blocks_story_image" USING btree ("_order");
    CREATE INDEX "places_blocks_story_image_parent_id_idx" ON "places_blocks_story_image" USING btree ("_parent_id");
    CREATE INDEX "places_blocks_story_image_path_idx" ON "places_blocks_story_image" USING btree ("_path");
    CREATE INDEX "places_blocks_story_gallery_order_idx" ON "places_blocks_story_gallery" USING btree ("_order");
    CREATE INDEX "places_blocks_story_gallery_parent_id_idx" ON "places_blocks_story_gallery" USING btree ("_parent_id");
    CREATE INDEX "places_blocks_story_gallery_path_idx" ON "places_blocks_story_gallery" USING btree ("_path");
    CREATE INDEX "places_blocks_story_gallery_images_order_idx" ON "places_blocks_story_gallery_images" USING btree ("_order");
    CREATE INDEX "places_blocks_story_gallery_images_parent_id_idx" ON "places_blocks_story_gallery_images" USING btree ("_parent_id");

    -- indexes: _places_v blocks
    CREATE INDEX "_places_v_blocks_story_text_order_idx" ON "_places_v_blocks_story_text" USING btree ("_order");
    CREATE INDEX "_places_v_blocks_story_text_parent_id_idx" ON "_places_v_blocks_story_text" USING btree ("_parent_id");
    CREATE INDEX "_places_v_blocks_story_text_path_idx" ON "_places_v_blocks_story_text" USING btree ("_path");
    CREATE INDEX "_places_v_blocks_story_image_order_idx" ON "_places_v_blocks_story_image" USING btree ("_order");
    CREATE INDEX "_places_v_blocks_story_image_parent_id_idx" ON "_places_v_blocks_story_image" USING btree ("_parent_id");
    CREATE INDEX "_places_v_blocks_story_image_path_idx" ON "_places_v_blocks_story_image" USING btree ("_path");
    CREATE INDEX "_places_v_blocks_story_gallery_order_idx" ON "_places_v_blocks_story_gallery" USING btree ("_order");
    CREATE INDEX "_places_v_blocks_story_gallery_parent_id_idx" ON "_places_v_blocks_story_gallery" USING btree ("_parent_id");
    CREATE INDEX "_places_v_blocks_story_gallery_path_idx" ON "_places_v_blocks_story_gallery" USING btree ("_path");
    CREATE INDEX "_places_v_blocks_story_gallery_images_order_idx" ON "_places_v_blocks_story_gallery_images" USING btree ("_order");
    CREATE INDEX "_places_v_blocks_story_gallery_images_parent_id_idx" ON "_places_v_blocks_story_gallery_images" USING btree ("_parent_id");

    -- premiumExpiresAt columns
    ALTER TABLE "places" ADD COLUMN IF NOT EXISTS "premium_expires_at" timestamp(3) with time zone;
    ALTER TABLE "_places_v" ADD COLUMN IF NOT EXISTS "version_premium_expires_at" timestamp(3) with time zone;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "places" DROP COLUMN IF EXISTS "premium_expires_at";
    ALTER TABLE "_places_v" DROP COLUMN IF EXISTS "version_premium_expires_at";

    DROP TABLE IF EXISTS "places_blocks_story_gallery_images" CASCADE;
    DROP TABLE IF EXISTS "places_blocks_story_gallery" CASCADE;
    DROP TABLE IF EXISTS "places_blocks_story_image" CASCADE;
    DROP TABLE IF EXISTS "places_blocks_story_text" CASCADE;
    DROP TABLE IF EXISTS "_places_v_blocks_story_gallery_images" CASCADE;
    DROP TABLE IF EXISTS "_places_v_blocks_story_gallery" CASCADE;
    DROP TABLE IF EXISTS "_places_v_blocks_story_image" CASCADE;
    DROP TABLE IF EXISTS "_places_v_blocks_story_text" CASCADE;

    DROP TYPE IF EXISTS "public"."enum_places_blocks_story_image_size";
    DROP TYPE IF EXISTS "public"."enum__places_v_blocks_story_image_size";
  `)
}
