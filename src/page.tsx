"use client";

import { useEffect, useMemo, useState } from "react";
import StockTable from "@/components/DataGrid/StockTable";
import FilterPanel from "@/components/FilterPanel";
import {
  runFilterPipeline,
  type FilterCondition,
} from "@/lib/filters/filterEngine";
import { FILTER_PRESETS } from "@/lib/filters/presets";
import type { Stock } from "@/types/stock";

export default function HomePage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStocks() {
      try {
        const response = await fetch("/api/stocks");
        const result = await response.json();

        setStocks(result.data ?? []);
      } catch (error) {
        console.error("Failed to load stocks:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStocks();
  }, []);

  const filteredResult = useMemo(() => {
    return runFilterPipeline({
      stocks,
      filters,
      page: 1,
      pageSize: stocks.length || 1,
    });
  }, [stocks, filters]);

  function applyPreset(
    preset: (typeof FILTER_PRESETS)[number]
  ) {
    setFilters(preset.filters);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        Loading stocks...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">
              Real-Time Stock Screener
            </h1>

            <p className="text-sm text-gray-500">
              {filteredResult.total.toLocaleString("en-IN")} of{" "}
              {stocks.length.toLocaleString("en-IN")} stocks
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                title={preset.description}
                className="rounded border bg-white px-3 py-2 text-xs hover:bg-gray-50"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-82px)]">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          resultCount={filteredResult.total}
          totalCount={stocks.length}
        />

        <section className="min-w-0 flex-1 p-4">
          <StockTable stocks={filteredResult.data} />
        </section>
      </div>
    </main>
  );
}