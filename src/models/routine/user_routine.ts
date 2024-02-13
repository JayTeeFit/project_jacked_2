import {
  NewUserRoutineSchema,
  UserRoutineSchema,
  userRoutines,
} from "src/db/schema/routines";
import RoutineDetail from "src/models/routine/routine_detail";
import UserTrainingDay from "src/models/training_day/user_training_day";
import User from "src/models/user/user";
import {
  dbModelResponse,
  errorResponse,
} from "src/models/utils/model_responses";

export type UserRoutineUpsertResult = {
  error: string | null;
  userRoutineSchema: UserRoutineSchema | null;
};

export type UserRoutineRelations = {
  user: User | number;
  details: RoutineDetail | number;
  trainingDay: UserTrainingDay | number;
};

export type UserRoutineWithRelations = Omit<
  UserRoutineSchema,
  "userId" | "routineId" | "trainingDayId"
> &
  UserRoutineRelations;

export type NewUserRoutineWithRelations = Omit<
  NewUserRoutineSchema,
  | "userId"
  | "routineId"
  | "trainingDayId"
  | "createdAt"
  | "updatedAt"
  | "trashedAt"
  | "trashedBy"
> &
  UserRoutineRelations;

export default class UserRoutine implements UserRoutineSchema {
  protected _id: number;
  protected _userId: number;
  protected _detailId: number;
  protected _trainingDayId: number;
  protected _listOrder: number;
  protected _isExercise: boolean;
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _trashedAt: Date | null;
  protected _trashedBy: number | null;
  protected _user: User | null;
  protected _details: RoutineDetail | null;
  protected _trainingDay: UserTrainingDay | null;

  constructor(attributes: UserRoutineWithRelations) {
    this._id = attributes.id;
    this._listOrder = attributes.listOrder;
    this._isExercise = attributes.isExercise;
    this._createdAt = attributes.createdAt;
    this._updatedAt = attributes.updatedAt;
    this._trashedAt = attributes.trashedAt;
    this._trashedBy = attributes.trashedBy;

    // user
    if (attributes.user instanceof User) {
      this._user = attributes.user;
      this._userId = attributes.user.id;
    } else {
      this._userId = attributes.user;
      this._user = null;
    }

    // detail
    if (attributes.details instanceof RoutineDetail) {
      this._details = attributes.details;
      this._detailId = attributes.details.id;
    } else {
      this._detailId = attributes.details;
      this._details = null;
    }

    // trainingDay
    if (attributes.trainingDay instanceof UserTrainingDay) {
      this._trainingDay = attributes.trainingDay;
      this._trainingDayId = attributes.trainingDay.id;
    } else {
      this._trainingDayId = attributes.trainingDay;
      this._trainingDay = null;
    }
  }

  static async create(attributes: NewUserRoutineWithRelations) {
    const { user, details, trainingDay, ...rest } = attributes;

    const now = new Date(Date.now());

    const newAttributes: NewUserRoutineSchema = {
      ...rest,
      userId: user instanceof User ? user.id : user,
      detailId: details instanceof RoutineDetail ? details.id : details,
      trainingDayId:
        trainingDay instanceof UserTrainingDay ? trainingDay.id : trainingDay,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.transaction(async (tx) => {
      let userRoutineSchema: UserRoutineSchema;
      try {
        [userRoutineSchema] = await tx
          .insert(userRoutines)
          .values(newAttributes)
          .returning();
      } catch (err) {
        return UserRoutine._userRoutineCreateResult({
          error: errorResponse(err, "UserRoutine.create"),
        });
      }
      return UserRoutine._userRoutineCreateResult({
        userRoutineSchema,
      });
    });

    if (result.error) {
      return dbModelResponse({ errorMessage: result.error });
    }

    const userRoutine = new UserRoutine({
      ...result.userRoutineSchema!,
      user,
      details,
      trainingDay,
    });

    return dbModelResponse({ value: userRoutine });
  }

  static _userRoutineCreateResult(
    result: Partial<UserRoutineUpsertResult>
  ): UserRoutineUpsertResult {
    return {
      error: result.error || null,
      userRoutineSchema: result.userRoutineSchema || null,
    };
  }

  async getUser() {
    if (this._user) {
      return this._user;
    }

    this.user = await User.findUserById(this._userId);
    return this.user;
  }

  async getDetail() {
    if (this._details) {
      return this._details;
    }

    this.details = await RoutineDetail.findRoutineDetailById(this._detailId);
    return this.details;
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

  get trainingDayId(): number {
    return this._trainingDayId;
  }

  get listOrder(): number {
    return this._listOrder;
  }

  get isExercise(): boolean {
    return this._isExercise;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get trashedAt(): Date | null {
    return this._trashedAt;
  }

  get trashedBy(): number | null {
    return this._trashedBy;
  }

  get user(): User | null {
    return this._user;
  }

  get details(): RoutineDetail | null {
    return this._details;
  }

  get trainingDay(): UserTrainingDay | null {
    return this._trainingDay;
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

  set trainingDayId(trainingDayId: number) {
    this._trainingDayId = trainingDayId;
  }

  set listOrder(listOrder: number) {
    this._listOrder = listOrder;
  }

  set isExercise(isExercise: boolean) {
    this._isExercise = isExercise;
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

  set user(user: User | null) {
    this._user = user;
  }

  set details(detail: RoutineDetail | null) {
    this._details = detail;
  }

  set trainingDay(trainingDay: UserTrainingDay | null) {
    this._trainingDay = trainingDay;
  }
}
