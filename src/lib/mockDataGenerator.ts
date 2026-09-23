// src/lib/mockDataGenerator.ts

import {
  Stock,
  Sector,
  MarketCapCategory,
  MACDSignal,
  BollingerPosition,
} from "@/types/stock";

const SECTORS: Record<
  Sector,
  {
    companies: string[];
    industries: string[];
    avgPE: number;
    avgBeta: number;
  }
> = {
  IT: {
    companies: ["TCS", "Infosys", "Wipro", "HCL Tech", "Tech Mahindra"],
    industries: ["Software", "IT Services", "Cloud Computing"],
    avgPE: 25,
    avgBeta: 0.8,
  },

  Banking: {
    companies: ["HDFC Bank", "ICICI Bank", "SBI", "Kotak Bank", "Axis Bank"],
    industries: ["Private Banking", "Public Banking", "Financial Services"],
    avgPE: 18,
    avgBeta: 1.1,
  },

  Pharma: {
    companies: ["Sun Pharma", "Dr Reddy", "Cipla", "Divi Labs", "Aurobindo"],
    industries: ["Pharmaceuticals", "Healthcare", "Biotechnology"],
    avgPE: 30,
    avgBeta: 0.7,
  },

  Auto: {
    companies: ["Maruti", "Tata Motors", "M&M", "Bajaj Auto", "Hero MotoCorp"],
    industries: ["Automobiles", "Auto Components", "EV"],
    avgPE: 22,
    avgBeta: 1.0,
  },

  FMCG: {
    companies: ["HUL", "ITC", "Nestle India", "Britannia", "Dabur"],
    industries: ["Consumer Goods", "Food Products", "Personal Care"],
    avgPE: 35,
    avgBeta: 0.6,
  },

  Metal: {
    companies: ["Tata Steel", "JSW Steel", "Hindalco", "SAIL", "Vedanta"],
    industries: ["Steel", "Aluminium", "Mining"],
    avgPE: 14,
    avgBeta: 1.3,
  },

  Energy: {
    companies: ["Reliance", "ONGC", "NTPC", "Power Grid", "Adani Power"],
    industries: ["Oil & Gas", "Power", "Renewable Energy"],
    avgPE: 16,
    avgBeta: 1.0,
  },

  Realty: {
    companies: ["DLF", "Godrej Properties", "Prestige", "Oberoi Realty"],
    industries: ["Real Estate", "Construction"],
    avgPE: 28,
    avgBeta: 1.2,
  },

  Telecom: {
    companies: ["Bharti Airtel", "Vodafone Idea", "Tata Communications"],
    industries: ["Telecommunications", "Network Services"],
    avgPE: 30,
    avgBeta: 0.9,
  },

  Infrastructure: {
    companies: ["L&T", "IRB Infra", "GMR Infra", "Adani Ports"],
    industries: ["Infrastructure", "Construction", "Ports"],
    avgPE: 20,
    avgBeta: 1.1,
  },

  Media: {
    companies: ["Sun TV", "Zee Entertainment", "PVR INOX"],
    industries: ["Media", "Entertainment", "Broadcasting"],
    avgPE: 24,
    avgBeta: 1.2,
  },

  Others: {
    companies: ["ABC Industries", "XYZ Limited", "National Corp"],
    industries: ["Diversified", "Industrial", "Services"],
    avgPE: 20,
    avgBeta: 1.0,
  },
};

const SECTOR_NAMES = Object.keys(SECTORS) as Sector[];

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1));
}

function randomNormal(mean = 0, stdDev = 1): number {
  let u = 0;
  let v = 0;

  while (u === 0) {
    u = Math.random();
  }

  while (v === 0) {
    v = Math.random();
  }

  const z =
    Math.sqrt(-2 * Math.log(u)) *
    Math.cos(2 * Math.PI * v);

  return mean + z * stdDev;
}

function randomSector(): Sector {
  return SECTOR_NAMES[randomInt(0, SECTOR_NAMES.length - 1)];
}

function generateMarketCap(): number {
  const random = Math.random();

  if (random < 0.15) {
    return randomBetween(200, 2000);
  }

  if (random < 0.55) {
    return randomBetween(2000, 20000);
  }

  if (random < 0.85) {
    return randomBetween(20000, 100000);
  }

  return randomBetween(100000, 250000);
}

function categorizeMarketCap(
  marketCap: number
): MarketCapCategory {
  if (marketCap >= 50000) {
    return "Large Cap";
  }

  if (marketCap >= 10000) {
    return "Mid Cap";
  }

  if (marketCap >= 1000) {
    return "Small Cap";
  }

  return "Micro Cap";
}

function generatePrice(
  marketCap: number
): number {
  const basePrice = Math.sqrt(marketCap) * 8;

  const price = basePrice * (
    0.7 + Math.random() * 0.6
  );

  return Number(price.toFixed(2));
}

function generateSymbol(
  sector: Sector,
  index: number
): string {
  const prefix = sector
    .substring(0, 3)
    .toUpperCase();

  return `${prefix}${String(index + 1).padStart(4, "0")}`;
}

function generateCompanyName(
  sector: Sector,
  index: number
): string {
  const companies = SECTORS[sector].companies;

  const base =
    companies[index % companies.length];

  return `${base} ${index + 1}`;
}

function generateIndexMembership(
  marketCapCategory: MarketCapCategory
): string[] {
  const indices: string[] = [];

  if (marketCapCategory === "Large Cap") {
    indices.push("NIFTY 50");

    if (Math.random() > 0.5) {
      indices.push("NIFTY 100");
    }
  }

  if (
    marketCapCategory === "Mid Cap" &&
    Math.random() > 0.4
  ) {
    indices.push("NIFTY MIDCAP 100");
  }

  if (Math.random() > 0.6) {
    indices.push("SENSEX");
  }

  return indices;
}

function generateMacdSignal(): MACDSignal {
  const value = Math.random();

  if (value < 0.35) {
    return "Bullish";
  }

  if (value < 0.7) {
    return "Bearish";
  }

  return "Neutral";
}

function generateBollingerPosition(): BollingerPosition {
  const value = Math.random();

  if (value < 0.15) {
    return "Above";
  }

  if (value < 0.85) {
    return "Within";
  }

  return "Below";
}

export function generateMockStocks(
  count: number = 5000
): Stock[] {
  const stocks: Stock[] = [];

  for (let i = 0; i < count; i++) {
    const sector = randomSector();

    const sectorConfig = SECTORS[sector];

    const marketCap = generateMarketCap();

    const marketCapCategory =
      categorizeMarketCap(marketCap);

    const price = generatePrice(marketCap);

    const previousClose =
      price * (
        1 + randomNormal(0, 0.015)
      );

    const dayOpen =
      previousClose * (
        1 + randomNormal(0, 0.008)
      );

    const dayHigh =
      Math.max(price, dayOpen) *
      (1 + Math.random() * 0.03);

    const dayLow =
      Math.min(price, dayOpen) *
      (1 - Math.random() * 0.03);

    const changeAbsolute =
      price - previousClose;

    const changePercent =
      (changeAbsolute / previousClose) * 100;

    const volume =
      randomInt(100_000, 10_000_000);

    const avgVolume20D =
      volume * randomBetween(0.7, 1.3);

    const pe =
      Math.random() < 0.08
        ? null
        : Math.max(
            2,
            sectorConfig.avgPE +
              randomNormal(0, 8)
          );

    const beta = Math.max(
      0.3,
      sectorConfig.avgBeta +
        randomNormal(0, 0.25)
    );

    const roe = Math.max(
      2,
      randomBetween(5, 30)
    );

    const roce = Math.max(
      2,
      roe + randomNormal(0, 4)
    );

    const promoterHolding =
      marketCapCategory === "Large Cap"
        ? randomBetween(35, 65)
        : randomBetween(40, 75);

    const rsi14 =
      Math.max(
        15,
        Math.min(
          85,
          randomBetween(25, 75)
        )
      );

    const sma50 =
      price * randomBetween(0.9, 1.1);

    const sma200 =
      price * randomBetween(0.8, 1.2);

    const stock: Stock = {
      symbol: generateSymbol(
        sector,
        i
      ),

      companyName:
        generateCompanyName(
          sector,
          i
        ),

      sector,

      industry:
        sectorConfig.industries[
          randomInt(
            0,
            sectorConfig.industries.length - 1
          )
        ],

      marketCapCategory,

      indexMembership:
        generateIndexMembership(
          marketCapCategory
        ),

      // Price
      lastPrice: Number(
        price.toFixed(2)
      ),

      previousClose: Number(
        previousClose.toFixed(2)
      ),

      dayOpen: Number(
        dayOpen.toFixed(2)
      ),

      dayHigh: Number(
        dayHigh.toFixed(2)
      ),

      dayLow: Number(
        dayLow.toFixed(2)
      ),

      changePercent: Number(
        changePercent.toFixed(2)
      ),

      changeAbsolute: Number(
        changeAbsolute.toFixed(2)
      ),

      volume,

      avgVolume20D: Math.round(
        avgVolume20D
      ),

      week52High: Number(
        (price * randomBetween(1.05, 1.5)).toFixed(2)
      ),

      week52Low: Number(
        (price * randomBetween(0.5, 0.95)).toFixed(2)
      ),

      // Fundamentals
      marketCap: Number(
        marketCap.toFixed(2)
      ),

      pe:
        pe === null
          ? null
          : Number(pe.toFixed(2)),

      pb: Number(
        randomBetween(0.8, 8).toFixed(2)
      ),

      dividendYield: Number(
        randomBetween(0, 6).toFixed(2)
      ),

      eps: Number(
        randomBetween(2, 150).toFixed(2)
      ),

      roe: Number(
        roe.toFixed(2)
      ),

      roce: Number(
        roce.toFixed(2)
      ),

      debtToEquity: Number(
        randomBetween(0.05, 2.5).toFixed(2)
      ),

      currentRatio: Number(
        randomBetween(0.7, 3).toFixed(2)
      ),

      promoterHolding: Number(
        promoterHolding.toFixed(2)
      ),

      revenueGrowthYoY: Number(
        randomBetween(-10, 35).toFixed(2)
      ),

      profitGrowthYoY: Number(
        randomBetween(-20, 45).toFixed(2)
      ),

      // Technical
      rsi14: Number(
        rsi14.toFixed(2)
      ),

      sma50: Number(
        sma50.toFixed(2)
      ),

      sma200: Number(
        sma200.toFixed(2)
      ),

      beta: Number(
        beta.toFixed(2)
      ),

      atr: Number(
        (price * randomBetween(0.01, 0.08)).toFixed(2)
      ),

      macdSignal:
        generateMacdSignal(),

      bollingerPosition:
        generateBollingerPosition(),
    };

    stocks.push(stock);
  }

  return stocks;
}