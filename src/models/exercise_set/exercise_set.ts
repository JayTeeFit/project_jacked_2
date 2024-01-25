import {
  ExerciseSetSchema,
  NewExerciseSetSchema,
  exerciseSets,
} from "src/db/schema/exercise_sets/exercise_sets";
import { ExertionUnit, WeightUnit } from "src/db/schema/types/units";
import {
  DbUpsertModelResponse,
  dbModelResponse,
  errorResponse,
} from "src/models/utils/model_responses";

export type SetUpsertResult = {
  error: string | null;
  setSchema: ExerciseSetSchema | null;
};

export type ExerciseSetRelations = {};

export type ExerciseSetWithRelations = ExerciseSetSchema & ExerciseSetRelations;

export default class ExerciseSet implements ExerciseSetSchema {
  protected _id: number;
  protected _listOrder: number;
  protected _exerciseId: number;
  protected _actualWeight: string | null;
  protected _actualReps: number | null;
  protected _actualExertion: number | null;
  protected _weightUnits: WeightUnit | null;
  protected _exertionUnits: ExertionUnit | null;

  constructor(attributes: ExerciseSetWithRelations) {
    this._id = attributes.id;
    this._listOrder = attributes.listOrder;
    this._exerciseId = attributes.exerciseId;
    this._actualWeight = attributes.actualWeight;
    this._actualReps = attributes.actualReps;
    this._actualExertion = attributes.actualExertion;
    this._weightUnits = attributes.weightUnits;
    this._exertionUnits = attributes.exertionUnits;
  }

  static async create(
    attributes: NewExerciseSetSchema
  ): Promise<DbUpsertModelResponse<ExerciseSet>> {
    const result = await db.transaction(async (tx) => {
      let setSchema: ExerciseSetSchema;
      try {
        [setSchema] = await tx
          .insert(exerciseSets)
          .values(attributes)
          .returning();
      } catch (err) {
        return ExerciseSet._setCreateResult({
          error: errorResponse(err),
        });
      }
      return ExerciseSet._setCreateResult({ setSchema });
    });

    if (result.error) {
      return dbModelResponse({ errorMessage: result.error });
    }

    const exerciseSet = new ExerciseSet({
      ...(result.setSchema as ExerciseSetSchema),
    });

    return dbModelResponse({ value: exerciseSet });
  }

  static _setCreateResult(result: Partial<SetUpsertResult>): SetUpsertResult {
    return {
      error: result.error || null,
      setSchema: result.setSchema || null,
    };
  }

  // Getters
  public get id() {
    return this._id;
  }

  public get listOrder() {
    return this._listOrder;
  }

  public get exerciseId() {
    return this._exerciseId;
  }

  public get actualWeight() {
    return this._actualWeight;
  }

  public get actualReps() {
    return this._actualReps;
  }

  public get actualExertion() {
    return this._actualExertion;
  }

  public get weightUnits() {
    return this._weightUnits;
  }

  public get exertionUnits() {
    return this._exertionUnits;
  }

  // Setters
  public set id(userId: number) {
    this._id = userId;
  }

  public set listOrder(order: number) {
    this._listOrder = order;
  }

  public set exerciseId(exerciseId: number) {
    this._exerciseId = exerciseId;
  }

  public set actualWeight(weight: string | null) {
    this._actualWeight = weight;
  }

  public set actualReps(reps: number | null) {
    this._actualReps = reps;
  }

  public set actualExertion(exertion: number | null) {
    this._actualExertion = exertion;
  }

  public set weightUnits(units: WeightUnit | null) {
    this._weightUnits = units;
  }

  public set exertionUnits(units: ExertionUnit | null) {
    this._exertionUnits = units;
  }
}
