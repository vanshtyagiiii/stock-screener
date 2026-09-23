import { NextResponse } from "next/server";
import { generateMockStocks } from "@/lib/mockDataGenerator";
import { ApiResponse, Stock } from "@/types/stock";

let stockCache: {
  data: Stock[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000;

export async function GET() {
  const startTime = performance.now();

  try {
    const now = Date.now();

    if (
      stockCache &&
      now - stockCache.timestamp < CACHE_DURATION
    ) {
      const executionTimeMs =
        Number(
          (performance.now() - startTime).toFixed(2)
        );

      const response: ApiResponse<Stock[]> = {
        success: true,
        data: stockCache.data,
        meta: {
          total: stockCache.data.length,
          page: 1,
          pageSize: stockCache.data.length,
          timestamp: new Date().toISOString(),
          executionTimeMs,
        },
      };

      return NextResponse.json(response);
    }

    const stocks = generateMockStocks(5000);

    stockCache = {
      data: stocks,
      timestamp: now,
    };

    const executionTimeMs =
      Number(
        (performance.now() - startTime).toFixed(2)
      );

    const response: ApiResponse<Stock[]> = {
      success: true,
      data: stocks,
      meta: {
        total: stocks.length,
        page: 1,
        pageSize: stocks.length,
        timestamp: new Date().toISOString(),
        executionTimeMs,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(
      "Failed to generate stock data:",
      error
    );

    const response: ApiResponse<Stock[]> = {
      success: false,
      data: [],
      meta: {
        total: 0,
        page: 1,
        pageSize: 0,
        timestamp: new Date().toISOString(),
        executionTimeMs: Number(
          (performance.now() - startTime).toFixed(2)
        ),
      },
      error: {
        code: "STOCK_DATA_ERROR",
        message:
          "Failed to generate stock data.",
      },
    };

    return NextResponse.json(
      response,
      { status: 500 }
    );
  }
}