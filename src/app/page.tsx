"use client";

import { useEffect, useState } from "react";

import StockTable from "@/components/DataGrid/StockTable";

import type {
  ApiResponse,
  Stock,
} from "@/types/stock";

export default function Home() {
  const [stocks, setStocks] =
    useState<Stock[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadStocks() {
      try {
        setLoading(true);

        const response =
          await fetch("/api/stocks");

        if (!response.ok) {
          throw new Error(
            "Failed to fetch stocks"
          );
        }

        const result: ApiResponse<Stock[]> =
          await response.json();

        if (!result.success) {
          throw new Error(
            result.error?.message ||
              "Stock API failed"
          );
        }

        setStocks(result.data);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load stock data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadStocks();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold">
            Loading Stock Screener
          </div>

          <div className="text-slate-400 mt-2">
            Generating 5,000+ stocks...
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-red-400">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">

      <div className="max-w-[1700px] mx-auto">

        {/* Header */}
        <div className="mb-6">

          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-3xl font-bold">
                Real-Time Stock Screener
              </h1>

              <p className="text-slate-400 mt-2">
                Indian Equity Market
              </p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-3">
              <div className="text-xs text-slate-400">
                STOCKS
              </div>

              <div className="text-xl font-bold">
                {stocks.length.toLocaleString()}
              </div>
            </div>

          </div>

        </div>

        {/* Table */}
        <StockTable stocks={stocks} />

      </div>

    </main>
  );
}