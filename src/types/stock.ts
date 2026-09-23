// src/types/stock.ts

export type Sector =
  | "IT"
  | "Banking"
  | "Pharma"
  | "Auto"
  | "FMCG"
  | "Metal"
  | "Energy"
  | "Realty"
  | "Telecom"
  | "Infrastructure"
  | "Media"
  | "Others";

export type MarketCapCategory =
  | "Large Cap"
  | "Mid Cap"
  | "Small Cap"
  | "Micro Cap";

export type MACDSignal =
  | "Bullish"
  | "Bearish"
  | "Neutral";

export type BollingerPosition =
  | "Above"
  | "Within"
  | "Below";

export interface Stock {
  symbol: string;
  companyName: string;
  sector: Sector;
  industry: string;

  marketCapCategory: MarketCapCategory;
  indexMembership: string[];

  // -------------------------
  // Price Data
  // -------------------------
  lastPrice: number;
  previousClose: number;
  dayOpen: number;
  dayHigh: number;
  dayLow: number;

  changePercent: number;
  changeAbsolute: number;

  volume: number;
  avgVolume20D: number;

  week52High: number;
  week52Low: number;

  // -------------------------
  // Fundamentals
  // -------------------------
  marketCap: number;
  pe: number | null;
  pb: number;
  dividendYield: number;
  eps: number;

  roe: number;
  roce: number;
  debtToEquity: number;
  currentRatio: number;

  promoterHolding: number;

  revenueGrowthYoY: number;
  profitGrowthYoY: number;

  // -------------------------
  // Technical Indicators
  // -------------------------
  rsi14: number;

  sma50: number;
  sma200: number;

  beta: number;
  atr: number;

  macdSignal: MACDSignal;
  bollingerPosition: BollingerPosition;
}

// -------------------------
// OHLCV data
// -------------------------

export interface OHLCV {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// -------------------------
// Filter system
// -------------------------

export type FilterOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "between"
  | "in"
  | "notIn"
  | "contains"
  | "startsWith";

export type FilterValue =
  | number
  | string
  | boolean
  | number[]
  | string[];

export interface FilterConfig {
  id: string;
  field: keyof Stock;
  operator: FilterOperator;
  value: FilterValue;
  enabled: boolean;
}

// -------------------------
// Sorting
// -------------------------

export interface SortConfig {
  column: keyof Stock;
  direction: "asc" | "desc";
}

// -------------------------
// Saved Filter Preset
// -------------------------

export interface FilterPreset {
  id: string;
  name: string;
  description?: string;
  filters: FilterConfig[];
  createdAt: string;
}

// -------------------------
// API Response
// -------------------------

export interface ApiMeta {
  total: number;
  page: number;
  pageSize: number;
  timestamp: string;
  executionTimeMs: number;
}

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: ApiMeta;
  error?: ApiError;
}