import { Stock } from "@/types/stock";
import {
  createPredicate,
  Predicate,
  FilterOperator,
  getNumericSelectivity,
} from "./predicates";

export type FilterCondition = {
  field: keyof Stock;
  operator: FilterOperator;
  value: unknown;
};

export type FilterGroup = {
  type: "AND" | "OR";
  conditions: Array<FilterCondition | FilterGroup>;
};

export type FilterAST = FilterCondition | FilterGroup;

export type FilterResult = {
  data: Stock[];
  total: number;
  executionTimeMs: number;
};

function isGroup(
  node: FilterAST | FilterCondition
): node is FilterGroup {
  return "type" in node && ("conditions" in node);
}

function conditionToPredicate(
  condition: FilterCondition
): Predicate<Stock> {
  return createPredicate(
    condition.field,
    condition.operator,
    condition.value
  );
}

/**
 * Parse:
 * Converts filter configuration into executable predicates.
 */
export function parseFilterAST(
  ast: FilterAST | null
): Predicate<Stock> {
  if (!ast) {
    return () => true;
  }

  if (!isGroup(ast)) {
    return conditionToPredicate(ast);
  }

  const predicates = ast.conditions.map((condition) =>
    parseFilterAST(condition)
  );

  if (ast.type === "OR") {
    return (stock) =>
      predicates.some((predicate) => predicate(stock));
  }

  return (stock) =>
    predicates.every((predicate) => predicate(stock));
}

/**
 * Optimize:
 * More selective numeric predicates execute first.
 */
export function optimizeFilters(
  conditions: FilterCondition[]
): FilterCondition[] {
  return [...conditions].sort((a, b) => {
    const aScore = getNumericSelectivity(a.operator);
    const bScore = getNumericSelectivity(b.operator);

    return bScore - aScore;
  });
}

/**
 * Execute:
 * Filters the complete stock universe with short-circuit evaluation.
 */
export function executeFilters(
  stocks: Stock[],
  ast: FilterAST | null
): Stock[] {
  if (!ast) {
    return stocks;
  }

  const predicate = parseFilterAST(ast);

  return stocks.filter(predicate);
}

/**
 * Stable sorting.
 */
export function sortStocks(
  stocks: Stock[],
  field: keyof Stock,
  direction: "asc" | "desc"
): Stock[] {
  return stocks
    .map((stock, index) => ({
      stock,
      index,
    }))
    .sort((a, b) => {
      const aValue = a.stock[field];
      const bValue = b.stock[field];

      if (aValue === bValue) {
        return a.index - b.index;
      }

      if (aValue === null || aValue === undefined) {
        return 1;
      }

      if (bValue === null || bValue === undefined) {
        return -1;
      }

      const comparison =
        typeof aValue === "number" && typeof bValue === "number"
          ? aValue - bValue
          : String(aValue).localeCompare(String(bValue));

      return direction === "asc" ? comparison : -comparison;
    })
    .map(({ stock }) => stock);
}

/**
 * Paginate:
 * Returns only the requested viewport/page.
 */
export function paginateStocks(
  stocks: Stock[],
  page: number,
  pageSize: number
): Stock[] {
  if (pageSize <= 0) return [];

  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;

  return stocks.slice(start, start + pageSize);
}

/**
 * Complete filter pipeline:
 *
 * Parse → Optimize → Execute → Sort → Paginate
 */
export function runFilterPipeline(options: {
  stocks: Stock[];
  filters?: FilterCondition[];
  ast?: FilterAST | null;
  sort?: {
    field: keyof Stock;
    direction: "asc" | "desc";
  };
  page?: number;
  pageSize?: number;
}): FilterResult {
  const start = performance.now();

  const {
    stocks,
    filters = [],
    ast = null,
    sort,
    page = 1,
    pageSize = stocks.length,
  } = options;

  let filteredStocks: Stock[];

  if (ast) {
    filteredStocks = executeFilters(stocks, ast);
  } else if (filters.length > 0) {
    const optimized = optimizeFilters(filters);

    const optimizedAST: FilterGroup = {
      type: "AND",
      conditions: optimized,
    };

    filteredStocks = executeFilters(
      stocks,
      optimizedAST
    );
  } else {
    filteredStocks = [...stocks];
  }

  if (sort) {
    filteredStocks = sortStocks(
      filteredStocks,
      sort.field,
      sort.direction
    );
  }

  const total = filteredStocks.length;

  const paginated = paginateStocks(
    filteredStocks,
    page,
    pageSize
  );

  return {
    data: paginated,
    total,
    executionTimeMs: performance.now() - start,
  };
}