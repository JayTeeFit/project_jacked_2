import { eq } from "drizzle-orm";
import {
  ExerciseSetSchema,
  exerciseSets,
} from "src/db/schema/exercise_sets/exercise_sets";
import {
  PropertyForSetSchema,
  propertiesForSets,
} from "src/db/schema/exercise_sets/properties_for_sets";
import {
  NewSetPropertySchema,
  SetPropertySchema,
  setProperties,
} from "src/db/schema/exercise_sets/set_properties";
import { DataType } from "src/db/schema/types/dynamic_properties";
import { PropertyForSetName } from "src/db/schema/types/sets";
import ExerciseSet from "src/models/exercise_set/exercise_set";
import PropertyForSet from "src/models/exercise_set/property_for_set";
import {
  DbUpsertModelResponse,
  dbModelResponse,
  errorResponse,
} from "src/models/utils/model_responses";

type SetId = number;

export type CreateSetProperty = {
  set: SetId | ExerciseSet;
  propertyOrName: PropertyForSetName | PropertyForSet;
  value?: string | null;
};

type PropertyUpsertResult = {
  error: string | null;
  setPropertySchema: SetPropertySchema | null;
};

export type SetPropertyRelations = {
  property: PropertyForSetSchema | PropertyForSet;
  set?: ExerciseSetSchema | ExerciseSet | null;
};

export type SetPropertyWithRelations = SetPropertySchema & SetPropertyRelations;

export type SetPropertyInterface = SetPropertySchema &
  Omit<PropertyForSetSchema, "id">;

export default class SetProperty implements SetPropertyInterface {
  private _value: string | null;
  private _setId: number;
  private _propertyId: number;
  private _name: PropertyForSetName;
  private _dataType: DataType;
  private _set: ExerciseSet | null;
  private _property: PropertyForSet;

  constructor(attributes: SetPropertyWithRelations) {
    this._value = attributes.value;
    this._propertyId = attributes.propertyId;
    this._setId = attributes.setId;
    // set
    if (!attributes.set || attributes.set instanceof ExerciseSet) {
      this._set = attributes.set || null;
    } else {
      this._set = new ExerciseSet(attributes.set);
    }
    // property
    if (attributes.property instanceof PropertyForSet) {
      this._property = attributes.property;
    } else {
      this._property = new PropertyForSet(attributes.property);
    }

    this._name = this._property.name;
    this._dataType = this._property.dataType;
  }

  static async create(
    attributes: CreateSetProperty
  ): Promise<DbUpsertModelResponse<SetProperty>> {
    let property: PropertyForSet | null;

    if (typeof attributes.propertyOrName === "string") {
      property = await PropertyForSet.findPropertyByName(
        attributes.propertyOrName
      );

      if (!property) {
        return dbModelResponse({
          errorMessage: `No property ${attributes.propertyOrName} exists`,
        });
      }
    } else {
      property = attributes.propertyOrName;
    }

    let newPropertySchema: NewSetPropertySchema = {
      setId:
        attributes.set instanceof ExerciseSet
          ? attributes.set.id
          : attributes.set,
      propertyId: property.id,
      value: attributes.value,
    };

    const result = await db.transaction(async (tx) => {
      let setPropertySchema: SetPropertySchema;

      try {
        [setPropertySchema] = await tx
          .insert(setProperties)
          .values(newPropertySchema)
          .returning();
      } catch (err) {
        return SetProperty._propertyCreateResult({
          error: errorResponse(err),
        });
      }
      return SetProperty._propertyCreateResult({
        setPropertySchema,
      });
    });

    if (result.error) {
      return dbModelResponse({ errorMessage: result.error });
    }

    const setProperty = new SetProperty({
      ...(result.setPropertySchema as SetPropertySchema),
      property,
    });

    return dbModelResponse({ value: setProperty });
  }

  static _propertyCreateResult(
    result: Partial<PropertyUpsertResult>
  ): PropertyUpsertResult {
    return {
      error: result.error || null,
      setPropertySchema: result.setPropertySchema || null,
    };
  }

  // Getters
  public get value() {
    return this._value;
  }

  public get setId() {
    return this._setId;
  }

  public get propertyId() {
    return this._propertyId;
  }

  public get set() {
    return this._set;
  }

  public get name() {
    return this._name;
  }

  public get dataType() {
    return this._dataType;
  }

  // Setters
  public set value(value: string | null) {
    this._value = value;
  }

  public set propertyId(propertyId: number) {
    this._propertyId = propertyId;
  }

  public set setId(setId: number) {
    this._setId = setId;
  }

  public set set(set: ExerciseSet | null) {
    this._set = set;
  }

  public set name(name: PropertyForSetName) {
    this._name = name;
  }

  public set dataType(dataType: DataType) {
    this._dataType = dataType;
  }
}
