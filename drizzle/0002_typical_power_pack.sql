CREATE TABLE IF NOT EXISTS "user_training_blocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"detail_id" integer,
	"date" date DEFAULT '1970-01-01',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"trashed_at" timestamp with time zone,
	"trashed_by" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "training_block_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"creator_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "training_block_detail_properties" (
	"detail_id" integer NOT NULL,
	"property_id" integer NOT NULL,
	"value" text,
	CONSTRAINT "training_block_detail_properties_detail_id_property_id_pk" PRIMARY KEY("detail_id","property_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "properties_for_training_block_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"data_type" text NOT NULL,
	CONSTRAINT "properties_for_training_block_details_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "user_routines" ADD COLUMN "training_block_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_routines" ADD CONSTRAINT "user_routines_training_block_id_user_training_blocks_id_fk" FOREIGN KEY ("training_block_id") REFERENCES "user_training_blocks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_training_blocks" ADD CONSTRAINT "user_training_blocks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_training_blocks" ADD CONSTRAINT "user_training_blocks_detail_id_training_block_details_id_fk" FOREIGN KEY ("detail_id") REFERENCES "training_block_details"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "training_block_details" ADD CONSTRAINT "training_block_details_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "training_block_detail_properties" ADD CONSTRAINT "training_block_detail_properties_detail_id_training_block_details_id_fk" FOREIGN KEY ("detail_id") REFERENCES "training_block_details"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "training_block_detail_properties" ADD CONSTRAINT "training_block_detail_properties_property_id_properties_for_training_block_details_id_fk" FOREIGN KEY ("property_id") REFERENCES "properties_for_training_block_details"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
