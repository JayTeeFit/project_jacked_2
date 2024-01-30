ALTER TABLE "exercise_sets" ALTER COLUMN "weight_units" SET DEFAULT 'lbs';--> statement-breakpoint
ALTER TABLE "exercise_sets" ALTER COLUMN "exertion_units" SET DEFAULT 'RPE';--> statement-breakpoint
ALTER TABLE "routine_details" ALTER COLUMN "creator_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_training_blocks" ALTER COLUMN "date" SET NOT NULL;