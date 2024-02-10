CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(15) NOT NULL,
	"email" varchar(256) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_claimed" boolean DEFAULT false NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"premiumness" text DEFAULT 'free' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"trashed_at" timestamp with time zone,
	"trashed_by" integer,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"first_name" varchar(50),
	"last_name" varchar(50),
	"about_me" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"unit_number" varchar(16),
	"street_number" varchar(32),
	"street_name" varchar(50),
	"city" varchar(50),
	"country" varchar(50),
	"postal" varchar(12),
	"type" varchar(16) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"trashed_at" timestamp with time zone,
	"trashed_by" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exercise_sets" (
	"id" serial PRIMARY KEY NOT NULL,
	"exercise_id" integer NOT NULL,
	"actual_weight" numeric(7, 2),
	"actual_reps" integer,
	"actual_exertion" integer,
	"weight_units" varchar(5) DEFAULT 'lbs',
	"exertion_units" varchar(10) DEFAULT 'RPE',
	"list_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "set_properties" (
	"set_id" integer NOT NULL,
	"property_id" integer NOT NULL,
	"value" text,
	"is_range" boolean DEFAULT false,
	CONSTRAINT "set_properties_set_id_property_id_pk" PRIMARY KEY("set_id","property_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "properties_for_sets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"data_type" text NOT NULL,
	CONSTRAINT "properties_for_sets_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_exercises" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"detail_id" integer NOT NULL,
	"routine_id" integer NOT NULL,
	"list_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"trashed_at" timestamp with time zone,
	"trashed_by" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exercise_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"name_id" integer NOT NULL,
	"variant_id" integer,
	"creator_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"trashed_at" timestamp with time zone,
	"trashed_by" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exercise_detail_properties" (
	"detail_id" integer NOT NULL,
	"property_id" integer NOT NULL,
	"value" text,
	CONSTRAINT "exercise_detail_properties_detail_id_property_id_pk" PRIMARY KEY("detail_id","property_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "properties_for_exercise_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"data_type" text NOT NULL,
	CONSTRAINT "properties_for_exercise_details_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exercise_names" (
	"id" serial PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"is_verified" boolean DEFAULT false,
	"default_variant_id" integer,
	"creator_id" integer,
	CONSTRAINT "exercise_names_creator_id_value_unique" UNIQUE NULLS NOT DISTINCT("creator_id","value")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exercise_name_variants" (
	"id" serial PRIMARY KEY NOT NULL,
	"variant_id" integer NOT NULL,
	"name_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exercise_variant_names" (
	"id" serial PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"is_verified" boolean DEFAULT false,
	"creator_id" integer,
	CONSTRAINT "exercise_variant_names_creator_id_value_unique" UNIQUE NULLS NOT DISTINCT("creator_id","value")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_routines" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"detail_id" integer NOT NULL,
	"training_day_id" integer NOT NULL,
	"is_exercise" boolean DEFAULT false,
	"list_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"trashed_at" timestamp with time zone,
	"trashed_by" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "routine_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"creator_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
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
CREATE TABLE IF NOT EXISTS "user_training_days" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"date" date DEFAULT '1970-01-01' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"trashed_at" timestamp with time zone,
	"trashed_by" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise_sets" ADD CONSTRAINT "exercise_sets_exercise_id_user_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "user_exercises"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "set_properties" ADD CONSTRAINT "set_properties_set_id_exercise_sets_id_fk" FOREIGN KEY ("set_id") REFERENCES "exercise_sets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "set_properties" ADD CONSTRAINT "set_properties_property_id_properties_for_sets_id_fk" FOREIGN KEY ("property_id") REFERENCES "properties_for_sets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_exercises" ADD CONSTRAINT "user_exercises_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
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
DO $$ BEGIN
 ALTER TABLE "user_exercises" ADD CONSTRAINT "user_exercises_routine_id_user_routines_id_fk" FOREIGN KEY ("routine_id") REFERENCES "user_routines"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise_details" ADD CONSTRAINT "exercise_details_name_id_exercise_names_id_fk" FOREIGN KEY ("name_id") REFERENCES "exercise_names"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise_details" ADD CONSTRAINT "exercise_details_variant_id_exercise_name_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "exercise_name_variants"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise_details" ADD CONSTRAINT "exercise_details_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise_detail_properties" ADD CONSTRAINT "exercise_detail_properties_detail_id_exercise_details_id_fk" FOREIGN KEY ("detail_id") REFERENCES "exercise_details"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise_detail_properties" ADD CONSTRAINT "exercise_detail_properties_property_id_properties_for_exercise_details_id_fk" FOREIGN KEY ("property_id") REFERENCES "properties_for_exercise_details"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise_names" ADD CONSTRAINT "exercise_names_default_variant_id_exercise_name_variants_id_fk" FOREIGN KEY ("default_variant_id") REFERENCES "exercise_name_variants"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise_names" ADD CONSTRAINT "exercise_names_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise_name_variants" ADD CONSTRAINT "exercise_name_variants_variant_id_exercise_variant_names_id_fk" FOREIGN KEY ("variant_id") REFERENCES "exercise_variant_names"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise_name_variants" ADD CONSTRAINT "exercise_name_variants_name_id_exercise_names_id_fk" FOREIGN KEY ("name_id") REFERENCES "exercise_names"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise_variant_names" ADD CONSTRAINT "exercise_variant_names_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
 ALTER TABLE "user_routines" ADD CONSTRAINT "user_routines_training_day_id_user_training_days_id_fk" FOREIGN KEY ("training_day_id") REFERENCES "user_training_days"("id") ON DELETE cascade ON UPDATE no action;
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_training_days" ADD CONSTRAINT "user_training_days_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
