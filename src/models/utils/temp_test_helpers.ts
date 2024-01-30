// TODO - delete this file after all models implemented.
// This file is to use for making objects manually in the database while I am developing.

import {
  ExerciseSetSchema,
  NewExerciseSetSchema,
  exerciseSets,
} from "src/db/schema/exercise_sets";
import {
  NewUserExerciseSchema,
  NewExerciseDetailSchema,
  NewExerciseNameSchema,
  ExerciseNameSchema,
  exerciseNames,
  ExerciseDetailSchema,
  exerciseDetails,
  UserExerciseSchema,
  userExercises,
} from "src/db/schema/exercises";
import {
  NewRoutineDetailSchema,
  NewUserRoutineSchema,
  RoutineDetailSchema,
  UserRoutineSchema,
  routineDetails,
  userRoutines,
} from "src/db/schema/routines";
import {
  NewUserTrainingBlockSchema,
  UserTrainingBlockSchema,
  userTrainingBlocks,
} from "src/db/schema/training_blocks";
import User from "src/models/user/user";
import { errorResponse } from "src/models/utils/model_responses";

export async function insertExerciseSet(attr: NewExerciseSetSchema) {
  const result = await db.transaction(async (tx) => {
    let exerciseSet: ExerciseSetSchema;
    try {
      [exerciseSet] = await tx.insert(exerciseSets).values(attr).returning();
    } catch (err) {
      return errorResponse(err, "tempTestHelpers.insertExerciseSet");
    }
    return exerciseSet;
  });

  if (typeof result === "string") {
    console.log(result);
    return null;
  }

  return result as ExerciseSetSchema;
}

export async function insertExercise(
  exerciseNameSchema: NewExerciseNameSchema,
  exerciseDetailSchema: Omit<NewExerciseDetailSchema, "nameId">,
  userExerciseSchema: Omit<NewUserExerciseSchema, "detailId">
) {
  const exerciseName = await insertExerciseName(exerciseNameSchema);
  expect(exerciseName).not.toBeNull();

  const exerciseDetail = await insertExerciseDetail({
    ...exerciseDetailSchema,
    nameId: exerciseName!.id,
  });
  expect(exerciseDetail).not.toBeNull();

  const exercise = await insertUserExercise({
    ...userExerciseSchema,
    detailId: exerciseDetail!.id,
  });
  expect(exercise).not.toBeNull();

  return exercise!;
}

export async function insertUserExercise(attr: NewUserExerciseSchema) {
  const result = await db.transaction(async (tx) => {
    let userExercise: UserExerciseSchema;
    try {
      [userExercise] = await tx.insert(userExercises).values(attr).returning();
    } catch (err) {
      return errorResponse(err, "tempTestHelpers.insertUserExercise");
    }
    return userExercise;
  });

  if (typeof result === "string") {
    return null;
  }

  return result as UserExerciseSchema;
}

export async function insertExerciseDetail(attr: NewExerciseDetailSchema) {
  const result = await db.transaction(async (tx) => {
    let exerciseDetail: ExerciseDetailSchema;
    try {
      [exerciseDetail] = await tx
        .insert(exerciseDetails)
        .values(attr)
        .returning();
    } catch (err) {
      return errorResponse(err, "tempTestHelpers.insertExerciseDetail");
    }
    return exerciseDetail;
  });

  if (typeof result === "string") {
    return null;
  }

  return result as ExerciseDetailSchema;
}

export async function insertExerciseName(attr: NewExerciseNameSchema) {
  const result = await db.transaction(async (tx) => {
    let exerciseName: ExerciseNameSchema;
    try {
      [exerciseName] = await tx.insert(exerciseNames).values(attr).returning();
    } catch (err) {
      return errorResponse(err, "tempTestHelpers.insertExerciseName");
    }
    return exerciseName;
  });

  if (typeof result === "string") {
    return null;
  }

  return result as ExerciseNameSchema;
}

export async function insertRoutine(
  routineDetailSchema: NewRoutineDetailSchema,
  userRoutineSchema: Omit<NewUserRoutineSchema, "detailId">
) {
  const routineDetail = await insertRoutineDetail(routineDetailSchema);
  expect(routineDetail).not.toBeNull();
  const routine = await insertUserRoutine({
    ...userRoutineSchema,
    detailId: routineDetail!.id,
  });
  expect(routine).not.toBeNull();

  return routine!;
}

export async function insertUserRoutine(attr: NewUserRoutineSchema) {
  const result = await db.transaction(async (tx) => {
    let userRoutine: UserRoutineSchema;
    try {
      [userRoutine] = await tx.insert(userRoutines).values(attr).returning();
    } catch (err) {
      return errorResponse(err, "tempTestHelpers.insertUserRoutine");
    }
    return userRoutine;
  });

  if (typeof result === "string") {
    return null;
  }

  return result as UserRoutineSchema;
}

export async function insertRoutineDetail(attr: NewRoutineDetailSchema) {
  const result = await db.transaction(async (tx) => {
    let routineDetail: RoutineDetailSchema;
    try {
      [routineDetail] = await tx
        .insert(routineDetails)
        .values(attr)
        .returning();
    } catch (err) {
      return errorResponse(err, "tempTestHelpers.insertRoutineDetail");
    }
    return routineDetail;
  });

  if (typeof result === "string") {
    return null;
  }

  return result as RoutineDetailSchema;
}

export async function insertTrainingBlock(attr: NewUserTrainingBlockSchema) {
  const result = await db.transaction(async (tx) => {
    let trainingBlock: UserTrainingBlockSchema;
    try {
      [trainingBlock] = await tx
        .insert(userTrainingBlocks)
        .values(attr)
        .returning();
    } catch (err) {
      return errorResponse(err, "tempTestHelpers.insertTrainingBlock");
    }

    return trainingBlock;
  });

  if (typeof result === "string") {
    return null;
  }

  return result as UserTrainingBlockSchema;
}

export async function seedRoutines(usr?: User) {
  let user: User;
  if (!usr) {
    const { value, errorMessage } = await User.create({
      email: "russellengebretson@gmail.com",
      username: "rengebre",
      isActive: true,
      isClaimed: true,
      isAdmin: true,
      premiumness: "coach",
    });

    expect(errorMessage).toBeNull();
    expect(value).not.toBeNull();

    user = value as User;
  } else {
    user = usr;
  }

  const routineBlockSchema = {
    userId: user.id,
    date: new Date(Date.now()).toISOString().split("T")[0],
  };

  const maybeTrainingBlock = await insertTrainingBlock(routineBlockSchema);
  expect(maybeTrainingBlock).not.toBeNull();
  const trainingBlock = maybeTrainingBlock as UserTrainingBlockSchema;

  const routineDetailSchema: NewRoutineDetailSchema = {
    name: "Upper 1",
    description: "Upper body workout",
    creatorId: user.id,
  };

  const routineSchema: Omit<NewUserRoutineSchema, "detailId"> = {
    userId: user.id,
    trainingBlockId: trainingBlock.id,
    listOrder: 0,
  };

  const routine = await insertRoutine(routineDetailSchema, routineSchema);

  const exerciseNameSchema: NewExerciseNameSchema = {
    value: "Bench Press",
  };

  const exerciseDetailSchema: Omit<NewExerciseDetailSchema, "nameId"> = {
    creatorId: user.id,
  };

  const userExerciseSchema: Omit<NewUserExerciseSchema, "detailId"> = {
    userId: user.id,
    routineId: routine.id,
    listOrder: 0,
  };

  const exercise = await insertExercise(
    exerciseNameSchema,
    exerciseDetailSchema,
    userExerciseSchema
  );

  const exerciseSetSchemas: NewExerciseSetSchema[] = [
    {
      exerciseId: exercise.id,
      listOrder: 0,
      actualWeight: "185",
      actualReps: 10,
      actualExertion: 7,
    },
    {
      exerciseId: exercise.id,
      listOrder: 100,
      actualWeight: "185",
      actualReps: 10,
      actualExertion: 8,
    },
    {
      exerciseId: exercise.id,
      listOrder: 200,
      actualWeight: "185",
      actualReps: 10,
      actualExertion: 9,
    },
  ];

  // const exerciseSets: ExerciseSetSchema[] = [];

  const exerciseSets = await Promise.all(
    exerciseSetSchemas.map(async (schema) => {
      const exerciseSet = await insertExerciseSet(schema);
      expect(exerciseSet).not.toBeNull();
      return exerciseSet!;
    })
  );

  return { exerciseSets, exercise, routine, user, trainingBlock };
}
