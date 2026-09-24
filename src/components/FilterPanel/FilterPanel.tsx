"use client";

import { useMemo, useState } from "react";
import {
  FILTER_CATEGORIES,
  FILTER_DEFINITIONS,
} from "@/lib/filters/filterConfig";
import type { FilterCondition } from "@/lib/filters/filterEngine";

type FilterPanelProps = {
  filters: FilterCondition[];
  onChange: (filters: FilterCondition[]) => void;
  resultCount: number;
  totalCount: number;
};

export default function FilterPanel({
  filters,
  onChange,
  resultCount,
  totalCount,
}: FilterPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  const [openCategories, setOpenCategories] = useState<
    Record<string, boolean>
  >(
    Object.fromEntries(
      FILTER_CATEGORIES.map((category) => [category, true])
    )
  );

  const activeMap = useMemo(() => {
    const map = new Map<string, FilterCondition>();

    filters.forEach((filter) => {
      map.set(String(filter.field), filter);
    });

    return map;
  }, [filters]);

  function updateFilter(condition: FilterCondition) {
    const next = filters.filter(
      (filter) => filter.field !== condition.field
    );

    next.push(condition);
    onChange(next);
  }

  function removeFilter(field: string) {
    onChange(
      filters.filter(
        (filter) => String(filter.field) !== field
      )
    );
  }

  function clearAll() {
    onChange([]);
  }

  function toggleCategory(category: string) {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }

  if (collapsed) {
    return (
      <aside className="w-12 border-r bg-white">
        <button
          onClick={() => setCollapsed(false)}
          className="w-full p-3 text-lg"
          aria-label="Open filters"
        >
          →
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-[320px] shrink-0 border-r bg-white">
      <div className="sticky top-0 z-10 border-b bg-white">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="font-semibold">Filters</h2>

            <p className="text-xs text-gray-500">
              Showing {resultCount.toLocaleString("en-IN")} of{" "}
              {totalCount.toLocaleString("en-IN")} stocks
            </p>
          </div>

          <button
            onClick={() => setCollapsed(true)}
            className="rounded border px-2 py-1 text-sm"
            aria-label="Collapse filters"
          >
            ←
          </button>
        </div>

        {filters.length > 0 && (
          <div className="border-t p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium">
                Applied ({filters.length})
              </span>

              <button
                onClick={clearAll}
                className="text-xs text-red-600"
              >
                Clear all
              </button>
            </div>

            <div className="flex flex-wrap gap-1">
              {filters.map((filter) => (
                <button
                  key={String(filter.field)}
                  onClick={() =>
                    removeFilter(String(filter.field))
                  }
                  className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700"
                >
                  {String(filter.field)} ×
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
        {FILTER_CATEGORIES.map((category) => {
          const definitions = FILTER_DEFINITIONS.filter(
            (definition) =>
              definition.category === category
          );

          return (
            <section
              key={category}
              className="border-b"
            >
              <button
                onClick={() => toggleCategory(category)}
                className="flex w-full items-center justify-between px-4 py-3 text-left font-medium"
              >
                <span>{category}</span>

                <span>
                  {openCategories[category] ? "−" : "+"}
                </span>
              </button>

              {openCategories[category] && (
                <div className="space-y-4 px-4 pb-4">
                  {definitions.map((definition) => (
                    <FilterControl
                      key={definition.id}
                      definition={definition}
                      value={activeMap.get(
                        String(definition.field)
                      )}
                      onChange={updateFilter}
                      onRemove={() =>
                        removeFilter(
                          String(definition.field)
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </aside>
  );
}

function FilterControl({
  definition,
  value,
  onChange,
  onRemove,
}: {
  definition: (typeof FILTER_DEFINITIONS)[number];
  value?: FilterCondition;
  onChange: (condition: FilterCondition) => void;
  onRemove: () => void;
}) {
  if (definition.control === "range") {
    const current = Array.isArray(value?.value)
      ? value?.value
      : ["", ""];

    return (
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-xs font-medium">
            {definition.label}
          </label>

          {value && (
            <button
              onClick={onRemove}
              className="text-xs text-red-500"
            >
              ×
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder={`Min ${definition.min ?? ""}`}
            min={definition.min}
            max={definition.max}
            step={definition.step}
            value={current[0]}
            onChange={(event) => {
              const min = event.target.value;

              if (!min && !current[1]) {
                onRemove();
                return;
              }

              onChange({
                field: definition.field,
                operator: "between",
                value: [
                  min === ""
                    ? definition.min ?? 0
                    : Number(min),
                  current[1] === ""
                    ? definition.max ?? Number.MAX_SAFE_INTEGER
                    : Number(current[1]),
                ],
              });
            }}
            className="w-full rounded border px-2 py-1 text-xs"
          />

          <input
            type="number"
            placeholder={`Max ${definition.max ?? ""}`}
            min={definition.min}
            max={definition.max}
            step={definition.step}
            value={current[1]}
            onChange={(event) => {
              const max = event.target.value;

              if (!max && !current[0]) {
                onRemove();
                return;
              }

              onChange({
                field: definition.field,
                operator: "between",
                value: [
                  current[0] === ""
                    ? definition.min ?? 0
                    : Number(current[0]),
                  max === ""
                    ? definition.max ?? Number.MAX_SAFE_INTEGER
                    : Number(max),
                ],
              });
            }}
            className="w-full rounded border px-2 py-1 text-xs"
          />
        </div>
      </div>
    );
  }

  if (definition.control === "multi") {
    const selected = Array.isArray(value?.value)
      ? value.value.map(String)
      : [];

    return (
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-xs font-medium">
            {definition.label}
          </label>

          {value && (
            <button
              onClick={onRemove}
              className="text-xs text-red-500"
            >
              ×
            </button>
          )}
        </div>

        <select
          multiple
          value={selected}
          onChange={(event) => {
            const values = Array.from(
              event.target.selectedOptions
            ).map((option) => option.value);

            if (!values.length) {
              onRemove();
              return;
            }

            onChange({
              field: definition.field,
              operator: "in",
              value: values,
            });
          }}
          className="h-24 w-full rounded border px-2 py-1 text-xs"
        >
          {(definition.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (definition.control === "boolean") {
    const checked = value?.value === true;

    return (
      <label className="flex items-center justify-between text-xs">
        <span>{definition.label}</span>

        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => {
            if (!event.target.checked) {
              onRemove();
              return;
            }

            onChange({
              field: definition.field,
              operator: "eq",
              value: true,
            });
          }}
        />
      </label>
    );
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs font-medium">
          {definition.label}
        </label>

        {value && (
          <button
            onClick={onRemove}
            className="text-xs text-red-500"
          >
            ×
          </button>
        )}
      </div>

      <select
        value={String(value?.value ?? "")}
        onChange={(event) => {
          if (!event.target.value) {
            onRemove();
            return;
          }

          onChange({
            field: definition.field,
            operator: "eq",
            value: event.target.value,
          });
        }}
        className="w-full rounded border px-2 py-1 text-xs"
      >
        <option value="">Any</option>

        {(definition.options ?? []).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}