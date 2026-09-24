import { FilterCondition } from "./filterEngine";

export type FilterPreset = {
  id: string;
  name: string;
  description: string;
  filters: FilterCondition[];
};

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: "value-stocks",
    name: "Value Stocks",
    description:
      "P/E < 15, ROE > 15%, Debt/Equity < 0.5, Dividend Yield > 2%",
    filters: [
      { field: "pe", operator: "lt", value: 15 },
      { field: "roe", operator: "gt", value: 15 },
      { field: "debtToEquity", operator: "lt", value: 0.5 },
      { field: "dividendYield", operator: "gt", value: 2 },
    ],
  },

  {
    id: "growth-momentum",
    name: "Growth Momentum",
    description:
      "Revenue Growth > 20%, Profit Growth > 20%, RSI 40-70, Price above SMA 50",
    filters: [
      { field: "revenueGrowthYoY", operator: "gt", value: 20 },
      { field: "profitGrowthYoY", operator: "gt", value: 20 },
      { field: "rsi14", operator: "between", value: [40, 70] },
      {
        field: "lastPrice",
        operator: "gt",
        value: "sma50",
      },
    ],
  },

  {
    id: "large-cap-quality",
    name: "Large Cap Quality",
    description:
      "Market Cap > 20,000 Cr, ROCE > 15%, Promoter Holding > 50%",
    filters: [
      { field: "marketCap", operator: "gt", value: 20_000 * 10_000_000 },
      { field: "roce", operator: "gt", value: 15 },
      { field: "promoterHolding", operator: "gt", value: 50 },
    ],
  },

  {
    id: "technical-breakout",
    name: "Technical Breakout",
    description:
      "Price above SMA 200, RSI 50-70, Volume above 2x average, Bollinger within bands",
    filters: [
      {
        field: "lastPrice",
        operator: "gt",
        value: "sma200",
      },
      { field: "rsi14", operator: "between", value: [50, 70] },
      {
        field: "volume",
        operator: "gt",
        value: "2x-average",
      },
      {
        field: "bollingerPosition",
        operator: "eq",
        value: "Within Bands",
      },
    ],
  },
];