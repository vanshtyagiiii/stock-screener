import { describe, expect, it } from "vitest";
import {
  createPredicate,
  andPredicates,
  orPredicates,
  notPredicate,
} from "@/lib/filters/predicates";
import {
  
  optimizeFilters,
  paginateStocks,
  parseFilterAST,
  runFilterPipeline,
  sortStocks,
  type FilterCondition,
} from "@/lib/filters/filterEngine";
import type { Stock } from "@/types/stock";

const makeStock = (overrides: Partial<Stock> = {}): Stock => ({
  symbol: "TEST",
  companyName: "Test Company",
  sector: "IT",
  industry: "Software",
  marketCapCategory: "Large Cap",
  indexMembership: "NIFTY 50",
  lastPrice: 100,
  previousClose: 98,
  dayOpen: 99,
  dayHigh: 102,
  dayLow: 97,
  changePercent: 2.04,
  changeAbsolute: 2,
  volume: 1000000,
  avgVolume20D: 800000,
  week52High: 120,
  week52Low: 70,
  marketCap: 100000000000,
  pe: 12,
  pb: 2,
  dividendYield: 2.5,
  eps: 8,
  roe: 18,
  roce: 20,
  debtToEquity: 0.3,
  currentRatio: 2,
  promoterHolding: 55,
  revenueGrowthYoY: 25,
  profitGrowthYoY: 30,
  rsi14: 55,
  sma50: 95,
  sma200: 90,
  beta: 1.1,
  atr: 3,
  macdSignal: "Bullish",
  bollingerPosition: "Within Bands",
  ...overrides,
});

const stocks: Stock[] = [
  makeStock({
    symbol: "AAA",
    lastPrice: 100,
    pe: 10,
    roe: 20,
    sector: "IT",
  }),
  makeStock({
    symbol: "BBB",
    lastPrice: 200,
    pe: 20,
    roe: 12,
    sector: "Banking",
  }),
  makeStock({
    symbol: "CCC",
    lastPrice: 150,
    pe: 15,
    roe: 16,
    sector: "Pharma",
  }),
  makeStock({
    symbol: "DDD",
    lastPrice: 50,
    pe: 8,
    roe: 25,
    sector: "Auto",
  }),
];

describe("Filter Predicates", () => {
  it("filters equality", () => {
    const predicate = createPredicate<Stock, "sector">(
      "sector",
      "eq",
      "IT"
    );

    expect(stocks.filter(predicate)).toHaveLength(1);
    expect(stocks.filter(predicate)[0].symbol).toBe("AAA");
  });

  it("filters greater than", () => {
    const predicate = createPredicate<Stock, "pe">(
      "pe",
      "gt",
      12
    );

    expect(stocks.filter(predicate).map((s) => s.symbol)).toEqual([
      "BBB",
      "CCC",
    ]);
  });

  it("filters greater than or equal", () => {
    const predicate = createPredicate<Stock, "pe">(
      "pe",
      "gte",
      15
    );

    expect(stocks.filter(predicate).map((s) => s.symbol)).toEqual([
      "BBB",
      "CCC",
    ]);
  });

  it("filters less than", () => {
    const predicate = createPredicate<Stock, "pe">(
      "pe",
      "lt",
      12
    );

    expect(stocks.filter(predicate).map((s) => s.symbol)).toEqual([
      "AAA",
      "DDD",
    ]);
  });

  it("filters less than or equal", () => {
    const predicate = createPredicate<Stock, "pe">(
      "pe",
      "lte",
      10
    );

    expect(stocks.filter(predicate).map((s) => s.symbol)).toEqual([
      "AAA",
      "DDD",
    ]);
  });

  it("filters between inclusive range", () => {
    const predicate = createPredicate<Stock, "pe">(
      "pe",
      "between",
      [10, 15]
    );

    expect(stocks.filter(predicate).map((s) => s.symbol)).toEqual([
      "AAA",
      "CCC",
    ]);
  });

  it("filters values using in", () => {
    const predicate = createPredicate<Stock, "sector">(
      "sector",
      "in",
      ["IT", "Auto"]
    );

    expect(stocks.filter(predicate).map((s) => s.symbol)).toEqual([
      "AAA",
      "DDD",
    ]);
  });

  it("filters values using notIn", () => {
    const predicate = createPredicate<Stock, "sector">(
      "sector",
      "notIn",
      ["IT", "Auto"]
    );

    expect(stocks.filter(predicate).map((s) => s.symbol)).toEqual([
      "BBB",
      "CCC",
    ]);
  });

  it("handles null or undefined values safely", () => {
    const stock = makeStock({
      pe: null as unknown as number,
    });

    const predicate = createPredicate<Stock, "pe">(
      "pe",
      "gt",
      10
    );

    expect(predicate(stock)).toBe(false);
  });
});

describe("Predicate Combinations", () => {
  it("combines predicates with AND", () => {
    const pePredicate = createPredicate<Stock, "pe">(
      "pe",
      "lt",
      15
    );

    const roePredicate = createPredicate<Stock, "roe">(
      "roe",
      "gt",
      15
    );

    const combined = andPredicates(
      pePredicate,
      roePredicate
    );

    expect(stocks.filter(combined).map((s) => s.symbol)).toEqual([
      "AAA",
      "DDD",
    ]);
  });

  it("combines predicates with OR", () => {
    const itPredicate = createPredicate<Stock, "sector">(
      "sector",
      "eq",
      "IT"
    );

    const bankingPredicate = createPredicate<Stock, "sector">(
      "sector",
      "eq",
      "Banking"
    );

    const combined = orPredicates(
      itPredicate,
      bankingPredicate
    );

    expect(stocks.filter(combined).map((s) => s.symbol)).toEqual([
      "AAA",
      "BBB",
    ]);
  });

  it("negates a predicate", () => {
    const predicate = createPredicate<Stock, "sector">(
      "sector",
      "eq",
      "IT"
    );

    const inverted = notPredicate(predicate);

    expect(stocks.filter(inverted).map((s) => s.symbol)).toEqual([
      "BBB",
      "CCC",
      "DDD",
    ]);
  });
});

describe("Filter AST", () => {
  it("parses an AND filter group", () => {
    const ast = {
      type: "AND" as const,
      conditions: [
        {
          field: "pe" as keyof Stock,
          operator: "lt" as const,
          value: 15,
        },
        {
          field: "roe" as keyof Stock,
          operator: "gt" as const,
          value: 15,
        },
      ],
    };

    const predicate = parseFilterAST(ast);

    expect(stocks.filter(predicate).map((s) => s.symbol)).toEqual([
      "AAA",
      "DDD",
    ]);
  });

  it("parses an OR filter group", () => {
    const ast = {
      type: "OR" as const,
      conditions: [
        {
          field: "sector" as keyof Stock,
          operator: "eq" as const,
          value: "IT",
        },
        {
          field: "sector" as keyof Stock,
          operator: "eq" as const,
          value: "Banking",
        },
      ],
    };

    const predicate = parseFilterAST(ast);

    expect(stocks.filter(predicate).map((s) => s.symbol)).toEqual([
      "AAA",
      "BBB",
    ]);
  });

  it("handles nested filter groups", () => {
    const ast = {
      type: "AND" as const,
      conditions: [
        {
          type: "OR" as const,
          conditions: [
            {
              field: "sector" as keyof Stock,
              operator: "eq" as const,
              value: "IT",
            },
            {
              field: "sector" as keyof Stock,
              operator: "eq" as const,
              value: "Auto",
            },
          ],
        },
        {
          field: "pe" as keyof Stock,
          operator: "lt" as const,
          value: 15,
        },
      ],
    };

    const predicate = parseFilterAST(ast);

    expect(stocks.filter(predicate).map((s) => s.symbol)).toEqual([
      "AAA",
      "DDD",
    ]);
  });
});

describe("Filter Optimization", () => {
  it("orders filters by selectivity", () => {
    const filters: FilterCondition[] = [
      {
        field: "pe",
        operator: "neq",
        value: 10,
      },
      {
        field: "sector",
        operator: "eq",
        value: "IT",
      },
      {
        field: "roe",
        operator: "gt",
        value: 15,
      },
    ];

    const optimized = optimizeFilters(filters);

    expect(optimized[0].operator).toBe("eq");
    expect(optimized[1].operator).toBe("gt");
    expect(optimized[2].operator).toBe("neq");
  });
});

describe("Sorting", () => {
  it("sorts ascending", () => {
    const result = sortStocks(
      stocks,
      "lastPrice",
      "asc"
    );

    expect(result.map((s) => s.symbol)).toEqual([
      "DDD",
      "AAA",
      "CCC",
      "BBB",
    ]);
  });

  it("sorts descending", () => {
    const result = sortStocks(
      stocks,
      "lastPrice",
      "desc"
    );

    expect(result.map((s) => s.symbol)).toEqual([
      "BBB",
      "CCC",
      "AAA",
      "DDD",
    ]);
  });
});

describe("Pagination", () => {
  it("returns the requested page", () => {
    const result = paginateStocks(stocks, 2, 2);

    expect(result.map((s) => s.symbol)).toEqual([
      "CCC",
      "DDD",
    ]);
  });

  it("handles page numbers below 1", () => {
    const result = paginateStocks(stocks, 0, 2);

    expect(result.map((s) => s.symbol)).toEqual([
      "AAA",
      "BBB",
    ]);
  });

  it("handles page size below 1", () => {
    const result = paginateStocks(stocks, 1, 0);

    expect(result).toEqual([]);
  });
});

describe("Complete Filter Pipeline", () => {
  it("filters, sorts and paginates together", () => {
    const result = runFilterPipeline({
      stocks,
      filters: [
        {
          field: "pe",
          operator: "lt",
          value: 20,
        },
      ],
      sort: {
        field: "lastPrice",
        direction: "desc",
      },
      page: 1,
      pageSize: 2,
    });

    expect(result.total).toBe(3);
    expect(result.data.map((s) => s.symbol)).toEqual([
      "CCC",
      "AAA",
    ]);
    expect(result.executionTimeMs).toBeGreaterThanOrEqual(0);
  });

  it("returns all stocks when no filter exists", () => {
    const result = runFilterPipeline({
      stocks,
    });

    expect(result.total).toBe(4);
    expect(result.data).toHaveLength(4);
  });

  it("supports direct AST pipeline execution", () => {
    const result = runFilterPipeline({
      stocks,
      ast: {
        type: "AND",
        conditions: [
          {
            field: "roe",
            operator: "gt",
            value: 15,
          },
          {
            field: "pe",
            operator: "lt",
            value: 15,
          },
        ],
      },
    });

    expect(result.total).toBe(2);
    expect(result.data.map((s) => s.symbol)).toEqual([
      "AAA",
      "DDD",
    ]);
  });
});

describe("Filter Performance", () => {
  it("filters 5000 stocks with 5 criteria under 200ms", () => {
    const largeDataset = Array.from(
      { length: 5000 },
      (_, index) =>
        makeStock({
          symbol: `STOCK${index}`,
          pe: 5 + (index % 30),
          roe: 5 + (index % 30),
          debtToEquity: (index % 10) / 10,
          dividendYield: index % 6,
          rsi14: 20 + (index % 60),
        })
    );

    const start = performance.now();

    const result = runFilterPipeline({
      stocks: largeDataset,
      filters: [
        {
          field: "pe",
          operator: "lt",
          value: 20,
        },
        {
          field: "roe",
          operator: "gt",
          value: 15,
        },
        {
          field: "debtToEquity",
          operator: "lt",
          value: 0.7,
        },
        {
          field: "dividendYield",
          operator: "gt",
          value: 2,
        },
        {
          field: "rsi14",
          operator: "between",
          value: [30, 70],
        },
      ],
    });

    const duration = performance.now() - start;

    expect(result.total).toBeGreaterThanOrEqual(0);
    expect(duration).toBeLessThan(200);
  });
});