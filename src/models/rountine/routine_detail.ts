import { RoutineDetailSchema } from "src/db/schema";

export default class RoutineDetail implements RoutineDetailSchema {
  protected _id: number;
  protected _name: string | null;
  protected _description: string | null;
  protected _creatorId: number;
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _trashedAt: Date | null;
  protected _trashedBy: number | null;

  constructor(attributes: RoutineDetailSchema) {
    this._id = attributes.id;
    this._name = attributes.name;
    this._description = attributes.description;
    this._creatorId = attributes.creatorId;
    this._createdAt = attributes.createdAt;
    this._updatedAt = attributes.updatedAt;
    this._trashedAt = attributes.trashedAt;
    this._trashedBy = attributes.trashedBy;
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
}
