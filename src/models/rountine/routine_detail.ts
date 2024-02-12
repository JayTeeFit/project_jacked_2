import {
  NewRoutineDetailSchema,
  RoutineDetailSchema,
  routineDetails,
} from "src/db/schema/routines";
import User from "src/models/user/user";
import {
  dbModelResponse,
  errorResponse,
} from "src/models/utils/model_responses";

export type UserTrainingDayUpsertResult = {
  error: string | null;
  routineDetailSchema: RoutineDetailSchema | null;
};

export type RoutineDetailRelations = {
  creator: User | number;
};

export type RoutineDetailWithRelations = Omit<
  RoutineDetailSchema,
  "creatorId"
> &
  RoutineDetailRelations;

export type NewRoutineDetailWithRelations = Omit<
  NewRoutineDetailSchema,
  "creatorId" | "createdAt" | "updatedAt" | "trashedAt" | "trashedBy"
> &
  RoutineDetailRelations;

export default class RoutineDetail implements RoutineDetailSchema {
  protected _id: number;
  protected _name: string | null;
  protected _description: string | null;
  protected _creatorId: number;
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _trashedAt: Date | null;
  protected _trashedBy: number | null;
  protected _creator: User | null;

  constructor(attributes: RoutineDetailWithRelations) {
    this._id = attributes.id;
    this._name = attributes.name;
    this._description = attributes.description;
    this._createdAt = attributes.createdAt;
    this._updatedAt = attributes.updatedAt;
    this._trashedAt = attributes.trashedAt;
    this._trashedBy = attributes.trashedBy;

    if (attributes.creator instanceof User) {
      this._creatorId = attributes.creator.id;
      this._creator = attributes.creator;
    } else {
      this._creatorId = attributes.creator;
      this._creator = null;
    }
  }

  static async create(attributes: NewRoutineDetailWithRelations) {
    const { creator, ...rest } = attributes;

    const now = new Date(Date.now());

    const newAttributes: NewRoutineDetailSchema = {
      ...rest,
      creatorId: creator instanceof User ? creator.id : creator,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.transaction(async (tx) => {
      let routineDetailSchema: RoutineDetailSchema;
      try {
        [routineDetailSchema] = await db
          .insert(routineDetails)
          .values(newAttributes)
          .returning();
      } catch (err) {
        return RoutineDetail._routineDetailCreateResult({
          error: errorResponse(err, "RoutineDetail.create"),
        });
      }

      return RoutineDetail._routineDetailCreateResult({
        routineDetailSchema,
      });
    });

    if (result.error) {
      return dbModelResponse({ errorMessage: result.error });
    }

    const routineDetail = new RoutineDetail({
      ...result.routineDetailSchema!,
      creator,
    });

    return dbModelResponse({ value: routineDetail });
  }

  static _routineDetailCreateResult(
    result: Partial<UserTrainingDayUpsertResult>
  ): UserTrainingDayUpsertResult {
    return {
      error: result.error || null,
      routineDetailSchema: result.routineDetailSchema || null,
    };
  }

  async getCreator() {
    if (this._creator) {
      return this._creator;
    }

    this.creator = await User.findUserById(this._creatorId);
    return this.creator;
  }

  // Getters
  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get creatorId() {
    return this._creatorId;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get trashedAt() {
    return this._trashedAt;
  }

  get trashedBy() {
    return this._trashedBy;
  }

  get creator() {
    return this._creator;
  }

  // Setters
  set id(id: number) {
    this._id = id;
  }

  set name(name: string | null) {
    this._name = name;
  }

  set description(description: string | null) {
    this._description = description;
  }

  set creatorId(creatorId: number) {
    this._creatorId = creatorId;
  }

  set createdAt(createdAt: Date) {
    this._createdAt = createdAt;
  }

  set updatedAt(updatedAt: Date) {
    this._updatedAt = updatedAt;
  }

  set trashedAt(trashedAt: Date | null) {
    this._trashedAt = trashedAt;
  }

  set trashedBy(trashedBy: number | null) {
    this._trashedBy = trashedBy;
  }

  set creator(creator: User | null) {
    this._creator = creator;
  }
}
