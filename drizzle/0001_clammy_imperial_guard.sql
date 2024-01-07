ALTER TABLE "exercise_info" DROP CONSTRAINT "exercise_info_variant_id_exercise_name_variants_id_fk";
--> statement-breakpoint
ALTER TABLE "user_exercises" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "user_exercises" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "user_exercises" ADD COLUMN "trashed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user_exercises" ADD COLUMN "trashed_by" integer;--> statement-breakpoint
ALTER TABLE "exercise_info" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "exercise_info" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise_info" ADD CONSTRAINT "exercise_info_variant_id_exercise_name_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "exercise_name_variants"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
