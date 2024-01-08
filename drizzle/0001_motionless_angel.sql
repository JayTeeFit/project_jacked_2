CREATE TABLE IF NOT EXISTS "user_routines" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"detail_id" integer NOT NULL,
	"is_exercise" boolean DEFAULT false,
	"list_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"trashed_at" timestamp with time zone,
	"trashed_by" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "routine_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"creator_id" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"trashed_at" timestamp with time zone,
	"trashed_by" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "routine_detail_properties" (
	"detail_id" integer NOT NULL,
	"property_id" integer NOT NULL,
	"value" text,
	CONSTRAINT "routine_detail_properties_detail_id_property_id_pk" PRIMARY KEY("detail_id","property_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "properties_for_routine_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"data_type" text NOT NULL,
	CONSTRAINT "properties_for_routine_details_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "user_exercises" DROP CONSTRAINT "user_exercises_detail_id_exercise_details_id_fk";
--> statement-breakpoint
ALTER TABLE "exercise_sets" ALTER COLUMN "list_order" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_exercises" ADD COLUMN "routine_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "user_exercises" ADD COLUMN "list_order" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_exercises" ADD CONSTRAINT "user_exercises_routine_id_user_routines_id_fk" FOREIGN KEY ("routine_id") REFERENCES "user_routines"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_exercises" ADD CONSTRAINT "user_exercises_detail_id_exercise_details_id_fk" FOREIGN KEY ("detail_id") REFERENCES "exercise_details"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user_exercises" DROP COLUMN IF EXISTS "date";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_routines" ADD CONSTRAINT "user_routines_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_routines" ADD CONSTRAINT "user_routines_detail_id_routine_details_id_fk" FOREIGN KEY ("detail_id") REFERENCES "routine_details"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "routine_details" ADD CONSTRAINT "routine_details_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "routine_detail_properties" ADD CONSTRAINT "routine_detail_properties_detail_id_routine_details_id_fk" FOREIGN KEY ("detail_id") REFERENCES "routine_details"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "routine_detail_properties" ADD CONSTRAINT "routine_detail_properties_property_id_properties_for_routine_details_id_fk" FOREIGN KEY ("property_id") REFERENCES "properties_for_routine_details"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
