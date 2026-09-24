import type { FilterOperator } from "./predicates";
import type { Stock } from "@/types/stock";

export type FilterControl =
  | "range"
  | "select"
  | "multi"
  | "boolean";

export type FilterDefinition = {
  id: string;
  label: string;
  category: string;
  field: keyof Stock;
  control: FilterControl;
  operator?: FilterOperator;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
};

export const FILTER_DEFINITIONS: FilterDefinition[] = [
  // Fundamentals
  {
    id: "pe",
    label: "P/E Ratio",
    category: "Fundamentals",
    field: "pe",
    control: "range",
    min: -100,
    max: 500,
    step: 0.1,
  },
  {
    id: "pb",
    label: "P/B Ratio",
    category: "Fundamentals",
    field: "pb",
    control: "range",
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    id: "dividendYield",
    label: "Dividend Yield (%)",
    category: "Fundamentals",
    field: "dividendYield",
    control: "range",
    min: 0,
    max: 25,
    step: 0.1,
  },
  {
    id: "eps",
    label: "EPS",
    category: "Fundamentals",
    field: "eps",
    control: "range",
    min: -500,
    max: 5000,
    step: 0.1,
  },
  {
    id: "roe",
    label: "ROE (%)",
    category: "Fundamentals",
    field: "roe",
    control: "range",
    min: -100,
    max: 200,
    step: 0.1,
  },
  {
    id: "roce",
    label: "ROCE (%)",
    category: "Fundamentals",
    field: "roce",
    control: "range",
    min: -100,
    max: 200,
    step: 0.1,
  },
  {
    id: "debtToEquity",
    label: "Debt / Equity",
    category: "Fundamentals",
    field: "debtToEquity",
    control: "range",
    min: 0,
    max: 10,
    step: 0.1,
  },
  {
    id: "currentRatio",
    label: "Current Ratio",
    category: "Fundamentals",
    field: "currentRatio",
    control: "range",
    min: 0,
    max: 20,
    step: 0.1,
  },
  {
    id: "promoterHolding",
    label: "Promoter Holding (%)",
    category: "Fundamentals",
    field: "promoterHolding",
    control: "range",
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    id: "revenueGrowthYoY",
    label: "Revenue Growth YoY (%)",
    category: "Fundamentals",
    field: "revenueGrowthYoY",
    control: "range",
    min: -100,
    max: 500,
    step: 0.1,
  },
  {
    id: "profitGrowthYoY",
    label: "Profit Growth YoY (%)",
    category: "Fundamentals",
    field: "profitGrowthYoY",
    control: "range",
    min: -100,
    max: 1000,
    step: 0.1,
  },

  // Market Data
  {
    id: "lastPrice",
    label: "Last Traded Price",
    category: "Market Data",
    field: "lastPrice",
    control: "range",
    min: 0,
    max: 500000,
    step: 0.1,
  },
  {
    id: "week52High",
    label: "52-Week High",
    category: "Market Data",
    field: "week52High",
    control: "range",
    min: 0,
    max: 500000,
    step: 0.1,
  },
  {
    id: "week52Low",
    label: "52-Week Low",
    category: "Market Data",
    field: "week52Low",
    control: "range",
    min: 0,
    max: 500000,
    step: 0.1,
  },
  {
    id: "avgVolume20D",
    label: "Average Volume (20D)",
    category: "Market Data",
    field: "avgVolume20D",
    control: "range",
    min: 0,
    max: 100000000,
    step: 1000,
  },
  {
    id: "beta",
    label: "Beta",
    category: "Market Data",
    field: "beta",
    control: "range",
    min: -2,
    max: 5,
    step: 0.1,
  },
  {
    id: "changePercent",
    label: "Day Change (%)",
    category: "Market Data",
    field: "changePercent",
    control: "range",
    min: -20,
    max: 20,
    step: 0.1,
  },

  // Classification
  {
    id: "sector",
    label: "Sector",
    category: "Classification",
    field: "sector",
    control: "multi",
    options: [
      "IT",
      "Banking",
      "Pharma",
      "Auto",
      "FMCG",
      "Metal",
      "Energy",
      "Realty",
      "Telecom",
      "Infrastructure",
      "Media",
      "Others",
    ],
  },
  {
    id: "industry",
    label: "Industry",
    category: "Classification",
    field: "industry",
    control: "multi",
  },
  {
    id: "marketCapCategory",
    label: "Market Cap Category",
    category: "Classification",
    field: "marketCapCategory",
    control: "multi",
    options: ["Large Cap", "Mid Cap", "Small Cap", "Micro Cap"],
  },
  {
    id: "indexMembership",
    label: "Index Membership",
    category: "Classification",
    field: "indexMembership",
    control: "multi",
    options: [
      "NIFTY 50",
      "NIFTY Next 50",
      "NIFTY Midcap 100",
      "NIFTY Smallcap 250",
      "BSE Sensex",
    ],
  },

  // Technical
  {
    id: "rsi14",
    label: "RSI (14)",
    category: "Technical",
    field: "rsi14",
    control: "range",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    id: "macdSignal",
    label: "MACD Signal",
    category: "Technical",
    field: "macdSignal",
    control: "select",
    options: [
      "Bullish Crossover",
      "Bearish Crossover",
      "Neutral",
    ],
  },
  {
    id: "sma50",
    label: "Price vs SMA 50",
    category: "Technical",
    field: "sma50",
    control: "select",
    options: ["Above", "Below"],
  },
  {
    id: "sma200",
    label: "Price vs SMA 200",
    category: "Technical",
    field: "sma200",
    control: "select",
    options: ["Above", "Below"],
  },
  {
    id: "bollingerPosition",
    label: "Bollinger Band Position",
    category: "Technical",
    field: "bollingerPosition",
    control: "select",
    options: [
      "Above Upper",
      "Within Bands",
      "Below Lower",
    ],
  },
  {
    id: "atr",
    label: "Average True Range",
    category: "Technical",
    field: "atr",
    control: "range",
    min: 0,
    max: 500,
    step: 0.1,
  },
  {
    id: "volume",
    label: "Volume vs 20D Average",
    category: "Technical",
    field: "volume",
    control: "select",
    options: [
      "Above Average",
      "Below Average",
      "2x Above",
      "3x Above",
    ],
  },

  // Custom
  {
    id: "watchlist",
    label: "Watchlist Only",
    category: "Custom",
    field: "symbol",
    control: "boolean",
  },
  {
    id: "recentlyUpdated",
    label: "Recently Updated",
    category: "Custom",
    field: "symbol",
    control: "boolean",
  },
];

export const FILTER_CATEGORIES = [
  "Fundamentals",
  "Market Data",
  "Classification",
  "Technical",
  "Custom",
];