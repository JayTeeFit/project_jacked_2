/**
 * Response expected from methods which mutate db data
 */
export type DbUpsertModelResponse<T> = {
  errorMessage: string | null;
  value: T | null;
};

export function dbModelResponse<T>(
  attr: Partial<DbUpsertModelResponse<T>>
): DbUpsertModelResponse<T> {
  return {
    errorMessage: attr.errorMessage || null,
    value: attr.value || null,
  };
}
