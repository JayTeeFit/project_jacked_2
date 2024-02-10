import { UserSchema } from "src/db/schema";
import {
  NewUserTrainingBlockSchema,
  TrainingBlockDetailSchema,
  UserTrainingBlockSchema,
  userTrainingBlocks,
} from "src/db/schema/training_blocks";
import TrainingBlockDetail from "src/models/training_block/training_block_detail";
import User from "src/models/user/user";
import {
  DbModelResponse,
  dbModelResponse,
  errorResponse,
} from "src/models/utils/model_responses";
import { DateErrors, isDateString } from "src/utils/date_helpers";

export type UserTrainingBlockUpsertResult = {
  error: string | null;
  userTrainingBlockSchema: UserTrainingBlockSchema | null;
};

export type UserTrainingBlockRelations = {
  detail?: TrainingBlockDetail | TrainingBlockDetailSchema | null;
  user?: User | UserSchema | null;
};

export type UserTrainingBlockWithRelations = UserTrainingBlockSchema &
  UserTrainingBlockRelations;

export default class UserTrainingBlock implements UserTrainingBlockSchema {
  protected _id: number;
  protected _userId: number;
  protected _detailId: number;
  protected _date: string;
  protected _trashedAt: Date | null;
  protected _trashedBy: number | null;
  protected _updatedAt: Date;
  protected _createdAt: Date;
  protected _detail: TrainingBlockDetail | null;
  protected _user: User | null;

  constructor(attributes: UserTrainingBlockWithRelations) {
    this._id = attributes.id;
    this._userId = attributes.userId;
    this._detailId = attributes.detailId;
    this._date = attributes.date;
    this._trashedAt = attributes.trashedAt;
    this._trashedBy = attributes.trashedBy;
    this._updatedAt = attributes.updatedAt;
    this._createdAt = attributes.createdAt;
    if (
      !attributes.detail ||
      attributes.detail instanceof TrainingBlockDetail
    ) {
      this._detail = attributes.detail || null;
    } else {
      this._detail = new TrainingBlockDetail(attributes.detail);
    }
    if (!attributes.user || attributes.user instanceof User) {
      this._user = attributes.user || null;
    } else {
      this._user = new User(attributes.user);
    }
  }

  static async create(
    attributes: NewUserTrainingBlockSchema
  ): Promise<DbModelResponse<UserTrainingBlock>> {
    if (attributes.date && !isDateString(attributes.date)) {
      return dbModelResponse({
        errorMessage: DateErrors.INVALID_DATE_STRING,
      });
    }

    const now = new Date(Date.now());

    const updatedAttr = {
      ...attributes,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.transaction(async (tx) => {
      let userTrainingBlockSchema: UserTrainingBlockSchema;
      try {
        [userTrainingBlockSchema] = await tx
          .insert(userTrainingBlocks)
          .values(updatedAttr)
          .returning();
      } catch (err) {
        return UserTrainingBlock._userTrainingBlockCreateResult({
          error: errorResponse(err, "UserTrainingBlock.create"),
        });
      }
      return UserTrainingBlock._userTrainingBlockCreateResult({
        userTrainingBlockSchema,
      });
    });

    if (result.error) {
      return dbModelResponse({ errorMessage: result.error });
    }

    const userTrainingBlock = new UserTrainingBlock(
      result.userTrainingBlockSchema!
    );

    return dbModelResponse({ value: userTrainingBlock });
  }

  static _userTrainingBlockCreateResult(
    result: Partial<UserTrainingBlockUpsertResult>
  ): UserTrainingBlockUpsertResult {
    return {
      error: result.error || null,
      userTrainingBlockSchema: result.userTrainingBlockSchema || null,
    };
  }

  // Getters
  get id(): number {
    return this._id;
  }

  get userId(): number {
    return this._userId;
  }

  get detailId(): number {
    return this._detailId;
  }

  get date(): string {
    return this._date;
  }

  get trashedAt(): Date | null {
    return this._trashedAt;
  }

  get trashedBy(): number | null {
    return this._trashedBy;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get detail(): TrainingBlockDetail | null {
    return this._detail;
  }

  get user(): User | null {
    return this._user;
  }

  // Setters
  set id(id: number) {
    this._id = id;
  }

  set userId(userId: number) {
    this._userId = userId;
  }

  set detailId(detailId: number) {
    this._detailId = detailId;
  }

  set date(date: string) {
    this._date = date;
  }

  set trashedAt(trashedAt: Date | null) {
    this._trashedAt = trashedAt;
  }

  set trashedBy(trashedBy: number | null) {
    this._trashedBy = trashedBy;
  }

  set updatedAt(updatedAt: Date) {
    this._updatedAt = updatedAt;
  }

  set createdAt(createdAt: Date) {
    this._createdAt = createdAt;
  }

  set detail(detail: TrainingBlockDetail | null) {
    this._detail = detail;
  }

  set user(user: User | null) {
    this._user = user;
  }
}
