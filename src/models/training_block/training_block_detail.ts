import {
  NewTrainingBlockDetailSchema,
  TrainingBlockDetailSchema,
  trainingBlockDetails,
} from "src/db/schema/training_blocks";
import {
  DbModelResponse,
  dbModelResponse,
  errorResponse,
} from "src/models/utils/model_responses";

export type TrainingBlockDetailUpsertResult = {
  error: string | null;
  detailSchema: TrainingBlockDetailSchema | null;
};

// export type PropertyMap = Partial<Record<string, SetProperty>>;

// export type ExerciseSetRelations = {
//   properties?: PropertyMap;
// };

// export type ExerciseSetWithRelations = ExerciseSetSchema & ExerciseSetRelations;

export default class TrainingBlockDetail implements TrainingBlockDetailSchema {
  protected _id: number;
  protected _creatorId: number | null;

  constructor(attributes: TrainingBlockDetailSchema) {
    this._id = attributes.id;
    this._creatorId = attributes.creatorId;
  }

  static async create(
    attributes: NewTrainingBlockDetailSchema
  ): Promise<DbModelResponse<TrainingBlockDetail>> {
    const result = await db.transaction(async (tx) => {
      let detailSchema: TrainingBlockDetailSchema;
      try {
        [detailSchema] = await tx
          .insert(trainingBlockDetails)
          .values({
            creatorId: attributes.creatorId,
          })
          .returning();
      } catch (err) {
        return TrainingBlockDetail._trainingBlockDetailCreateResult({
          error: errorResponse(err, "TrainingBlockDetail.create"),
        });
      }
      return TrainingBlockDetail._trainingBlockDetailCreateResult({
        detailSchema,
      });
    });

    if (result.error) {
      return dbModelResponse({ errorMessage: result.error });
    }

    const trainingBlockDetail = new TrainingBlockDetail(result.detailSchema!);

    return dbModelResponse({ value: trainingBlockDetail });
  }

  static _trainingBlockDetailCreateResult(
    result: Partial<TrainingBlockDetailUpsertResult>
  ): TrainingBlockDetailUpsertResult {
    return {
      error: result.error || null,
      detailSchema: result.detailSchema || null,
    };
  }

  // Getters
  get id(): number {
    return this._id;
  }

  get creatorId(): number | null {
    return this._creatorId;
  }

  // Setters
  set id(detailId: number) {
    this._id = detailId;
  }

  set creatorId(userId: number | null) {
    this._creatorId = userId;
  }
}
