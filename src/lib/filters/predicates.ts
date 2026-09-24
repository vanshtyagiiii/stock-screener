
export type Predicate<T> = (item: T) => boolean;

export type FilterOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "between"
  | "in"
  | "notIn";

export function createPredicate<T, K extends keyof T>(
  field: K,
  operator: FilterOperator,
  value: unknown
): Predicate<T> {
  return (item: T) => {
    const fieldValue = item[field];

    if (fieldValue === null || fieldValue === undefined) {
      return false;
    }

    switch (operator) {
      case "eq":
        return fieldValue === value;

      case "neq":
        return fieldValue !== value;

      case "gt":
        return Number(fieldValue) > Number(value);

      case "gte":
        return Number(fieldValue) >= Number(value);

      case "lt":
        return Number(fieldValue) < Number(value);

      case "lte":
        return Number(fieldValue) <= Number(value);

      case "between": {
        if (!Array.isArray(value) || value.length !== 2) {
          return false;
        }

        const [min, max] = value;

        return (
          Number(fieldValue) >= Number(min) &&
          Number(fieldValue) <= Number(max)
        );
      }

      case "in":
        return Array.isArray(value) && value.includes(fieldValue);

      case "notIn":
        return Array.isArray(value) && !value.includes(fieldValue);

      default:
        return false;
    }
  };
}

export function andPredicates<T>(
  ...predicates: Predicate<T>[]
): Predicate<T> {
  return (item) => predicates.every((predicate) => predicate(item));
}

export function orPredicates<T>(
  ...predicates: Predicate<T>[]
): Predicate<T> {
  return (item) => predicates.some((predicate) => predicate(item));
}

export function notPredicate<T>(
  predicate: Predicate<T>
): Predicate<T> {
  return (item) => !predicate(item);
}

export function getNumericSelectivity(
  operator: FilterOperator
): number {
  switch (operator) {
    case "between":
      return 100;
    case "eq":
      return 90;
    case "gt":
    case "gte":
    case "lt":
    case "lte":
      return 80;
    case "in":
      return 60;
    case "notIn":
      return 40;
    case "neq":
      return 20;
    default:
      return 0;
  }
}