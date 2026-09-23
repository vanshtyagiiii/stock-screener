"use client";

import { useEffect, useState } from "react";

import { Stock } from "@/types/stock";

export default function ScreenerPage() {
  const [stocks, setStocks] =
    useState<Stock[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadStocks() {
      try {
        setLoading(true);

        const response =
          await fetch(
            "/api/stocks?page=1&pageSize=5000",
          );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch stocks",
          );
        }

        const result =
          await response.json();

        setStocks(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    }

    loadStocks();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-6 py-4">
        <h1 className="text-2xl font-bold">
          Stock Screener
        </h1>

        <p className="text-sm text-slate-400">
          {loading
            ? "Loading..."
            : `${stocks.length.toLocaleString()} stocks`}
        </p>
      </header>

      <section className="p-6">
        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950 p-4 text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-hidden rounded-xl border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="px-4 py-3">
                      Symbol
                    </th>

                    <th className="px-4 py-3">
                      Company
                    </th>

                    <th className="px-4 py-3">
                      Sector
                    </th>

                    <th className="px-4 py-3">
                      Price
                    </th>

                    <th className="px-4 py-3">
                      Change
                    </th>

                    <th className="px-4 py-3">
                      Market Cap
                    </th>

                    <th className="px-4 py-3">
                      P/E
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {stocks
                    .slice(0, 100)
                    .map((stock) => (
                      <tr
                        key={stock.symbol}
                        className="border-t border-slate-800 hover:bg-slate-900"
                      >
                        <td className="px-4 py-3 font-mono font-semibold">
                          {stock.symbol}
                        </td>

                        <td className="px-4 py-3">
                          {stock.companyName}
                        </td>

                        <td className="px-4 py-3">
                          {stock.sector}
                        </td>

                        <td className="px-4 py-3 font-mono">
                          ₹
                          {stock.lastPrice.toFixed(
                            2,
                          )}
                        </td>

                        <td
                          className={`px-4 py-3 font-mono ${
                            stock.changePercent >=
                            0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {stock.changePercent >=
                          0
                            ? "+"
                            : ""}
                          {stock.changePercent.toFixed(
                            2,
                          )}
                          %
                        </td>

                        <td className="px-4 py-3">
                          ₹
                          {stock.marketCap.toLocaleString()}
                          Cr
                        </td>

                        <td className="px-4 py-3">
                          {stock.pe === null
                            ? "—"
                            : stock.pe.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}