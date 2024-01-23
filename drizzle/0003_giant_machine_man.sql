ALTER TABLE "exercise_names" DROP CONSTRAINT "exercise_names_value_creator_id_unique";--> statement-breakpoint
ALTER TABLE "exercise_variant_names" DROP CONSTRAINT "exercise_variant_names_value_creator_id_unique";--> statement-breakpoint
ALTER TABLE "exercise_names" ADD CONSTRAINT "exercise_names_creator_id_value_unique" UNIQUE NULLS NOT DISTINCT("creator_id","value");--> statement-breakpoint
ALTER TABLE "exercise_variant_names" ADD CONSTRAINT "exercise_variant_names_creator_id_value_unique" UNIQUE NULLS NOT DISTINCT("creator_id","value");