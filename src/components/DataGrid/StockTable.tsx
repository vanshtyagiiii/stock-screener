"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
  type ColumnPinningState,
} from "@tanstack/react-table";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRouter } from "next/navigation";

import type { Stock } from "@/types/stock";

import {
  PriceCell,
  ChangeCell,
  VolumeCell,
  MarketCapCell,
  RSICell,
} from "./cellFormatters";

interface StockTableProps {
  stocks: Stock[];
}

interface ContextMenuState {
  x: number;
  y: number;
  columnId: string;
}

const columnHelper = createColumnHelper<Stock>();

const columns = [
  columnHelper.accessor("symbol", {
    header: "Symbol",
    size: 110,
  }),

  columnHelper.accessor("companyName", {
    header: "Company",
    size: 190,
  }),

  columnHelper.accessor("sector", {
    header: "Sector",
    size: 120,
  }),

  columnHelper.accessor("marketCapCategory", {
    header: "Market Cap Category",
    size: 140,
  }),

  columnHelper.accessor("lastPrice", {
    header: "LTP",
    size: 120,
    cell: ({ getValue }) => (
      <PriceCell value={getValue<number>()} />
    ),
  }),

  columnHelper.accessor("changePercent", {
    header: "% Change",
    size: 120,
    cell: ({ getValue }) => (
      <ChangeCell value={getValue<number>()} />
    ),
  }),

  columnHelper.accessor("volume", {
    header: "Volume",
    size: 140,
    cell: ({ getValue }) => (
      <VolumeCell value={getValue<number>()} />
    ),
  }),

  columnHelper.accessor("marketCap", {
    header: "Market Cap ₹Cr",
    size: 170,
    cell: ({ getValue }) => (
      <MarketCapCell value={getValue<number>()} />
    ),
  }),

  columnHelper.accessor("pe", {
    header: "P/E",
    size: 90,
  }),

  columnHelper.accessor("rsi14", {
    header: "RSI",
    size: 90,
    cell: ({ getValue }) => (
      <RSICell value={getValue<number>()} />
    ),
  }),

  columnHelper.accessor("macdSignal", {
    header: "MACD",
    size: 110,
  }),

  columnHelper.accessor("beta", {
    header: "Beta",
    size: 90,
  }),
];

const gridTemplateColumns =
  "110px 190px 120px 140px 120px 120px 140px 170px 90px 90px 110px 90px";

export default function StockTable({
  stocks,
}: StockTableProps) {
  const router = useRouter();
  const scrollRef =
    useRef<HTMLDivElement>(null);

  const [columnPinning, setColumnPinning] =
    useState<ColumnPinningState>({
      left: ["symbol"],
    });

  const [contextMenu, setContextMenu] =
    useState<ContextMenuState | null>(null);

  const [activeRow, setActiveRow] =
    useState(0);

  const [activeColumn, setActiveColumn] =
    useState(0);

  const [watchlist, setWatchlist] =
    useState<Set<string>>(new Set());

  const [showCheatSheet, setShowCheatSheet] =
    useState(false);

  const [selectedStock, setSelectedStock] =
    useState<string | null>(null);

  const table = useReactTable({
    data: stocks,
    columns,

    state: {
      columnPinning,
    },

    onColumnPinningChange:
      setColumnPinning,

    enableColumnPinning: true,

    getCoreRowModel:
      getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  const rowVirtualizer = useVirtualizer({
    count: rows.length,

    getScrollElement: () =>
      scrollRef.current,

    estimateSize: () => 36,

    overscan: 12,
  });

  const virtualRows =
    rowVirtualizer.getVirtualItems();

  const totalWidth = useMemo(() => {
    return columns.reduce(
      (total, column) =>
        total + (column.size ?? 100),
      0
    );
  }, []);

  useEffect(() => {
    if (rows.length === 0) {
      return;
    }

    rowVirtualizer.scrollToIndex(
      activeRow,
      {
        align: "auto",
      }
    );
  }, [
    activeRow,
    rowVirtualizer,
    rows.length,
  ]);

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      const target =
        event.target as HTMLElement | null;

      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }

      if (
        event.key === "?" &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey
      ) {
        event.preventDefault();
        setShowCheatSheet(true);
        return;
      }

      if (rows.length === 0) {
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();

        setActiveRow((current) =>
          Math.max(0, current - 1)
        );
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();

        setActiveRow((current) =>
          Math.min(
            rows.length - 1,
            current + 1
          )
        );
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();

        setActiveColumn((current) =>
          Math.max(0, current - 1)
        );
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();

        setActiveColumn((current) =>
          Math.min(
            columns.length - 1,
            current + 1
          )
        );
      }

      if (event.key === "Home") {
        event.preventDefault();

        setActiveRow(0);
        rowVirtualizer.scrollToIndex(0);
      }

      if (event.key === "End") {
        event.preventDefault();

        const lastRow =
          rows.length - 1;

        setActiveRow(lastRow);

        rowVirtualizer.scrollToIndex(
          lastRow
        );
      }

      if (event.key === "PageUp") {
        event.preventDefault();

        const viewportRows = Math.max(
          1,
          Math.floor(650 / 36)
        );

        setActiveRow((current) => {
          const next = Math.max(0, current - viewportRows);
          rowVirtualizer.scrollToIndex(next, { align: "auto" });
          return next;
        });
      }

      if (event.key === "PageDown") {
        event.preventDefault();

        const viewportRows = Math.max(
          1,
          Math.floor(650 / 36)
        );

        setActiveRow((current) => {
          const next = Math.min(rows.length - 1, current + viewportRows);
          rowVirtualizer.scrollToIndex(next, { align: "auto" });
          return next;
        });
      }

      if (event.key === "Enter") {
        event.preventDefault();

        const selectedRow =
          rows[activeRow];

        if (selectedRow) {
          const symbol =
            selectedRow.original.symbol;

          setSelectedStock(symbol);
          router.push(`/${encodeURIComponent(symbol)}`);
        }
      }

      if (event.code === "Space") {
        event.preventDefault();

        const selectedRow =
          rows[activeRow];

        if (!selectedRow) {
          return;
        }

        const symbol =
          selectedRow.original.symbol;

        setWatchlist((current) => {
          const next = new Set(current);

          if (next.has(symbol)) {
            next.delete(symbol);
          } else {
            next.add(symbol);
          }

          return next;
        });
      }

      if (event.key === "Escape") {
        setShowCheatSheet(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    activeRow,
    rows.length,
    rowVirtualizer,
    rows,
    router,
  ]);

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleContextMenu = (
    event: React.MouseEvent,
    columnId: string
  ) => {
    event.preventDefault();

    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      columnId,
    });
  };

  const toggleColumnPin = (
    columnId: string
  ) => {
    const column =
      table.getColumn(columnId);

    if (!column) {
      return;
    }

    if (columnId === "symbol") {
      return;
    }

    const isPinned =
      column.getIsPinned();

    if (isPinned) {
      column.pin(false);
    } else {
      column.pin("left");
    }

    closeContextMenu();
  };

  return (
    <>
      <div
        className="rounded-xl border border-slate-700 bg-slate-950 overflow-hidden"
        onClick={closeContextMenu}
      >
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-2 text-xs">
          <div className="text-slate-400">
            Active Row:{" "}
            <span className="font-semibold text-slate-200">
              {activeRow + 1}
            </span>
            {" • "}
            Column:{" "}
            <span className="font-semibold text-slate-200">
              {columns[activeColumn]?.header as string}
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <label className="flex items-center gap-2">
              <span>Row</span>
              <input
                aria-label="Scroll to row"
                type="number"
                min={1}
                max={Math.max(1, rows.length)}
                defaultValue={activeRow + 1}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return;
                  const value = Number((event.currentTarget as HTMLInputElement).value);
                  if (!Number.isFinite(value)) return;
                  const next = Math.min(
                    Math.max(1, Math.floor(value)),
                    Math.max(1, rows.length)
                  ) - 1;
                  setActiveRow(next);
                  rowVirtualizer.scrollToIndex(next, { align: "center" });
                  event.currentTarget.blur();
                }}
                className="w-16 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-200 outline-none"
              />
            </label>
            <span>
              Press{" "}
              <kbd className="rounded border border-slate-700 px-1.5 py-0.5 text-slate-300">
                ?
              </kbd>{" "}
              for shortcuts
            </span>
          </div>
        </div>

        <div
          ref={scrollRef}
          tabIndex={0}
          role="grid"
          aria-label="Stock screener data grid"
          aria-rowcount={rows.length}
          aria-colcount={columns.length}
          className="h-[700px] overflow-auto outline-none"
        >
          <div
            className="sticky top-0 z-30 bg-slate-900 border-b border-slate-700"
            style={{
              width: `${totalWidth}px`,
              minWidth: "1390px",
            }}
          >
            <div
              className="grid text-sm font-semibold text-slate-300"
              style={{
                gridTemplateColumns,
              }}
            >
              {table
                .getHeaderGroups()[0]
                .headers.map((header) => {
                  const column =
                    header.column;

                  const isPinned =
                    column.getIsPinned();

                  const left =
                    isPinned === "left"
                      ? column.getStart(
                          "left"
                        )
                      : undefined;

                  return (
                    <div
                      key={header.id}
                      role="columnheader"
                      aria-colindex={header.index + 1}
                      onContextMenu={(event) =>
                        handleContextMenu(
                          event,
                          column.id
                        )
                      }
                      className={`
                        h-12
                        flex
                        items-center
                        px-3
                        border-r
                        border-slate-800
                        whitespace-nowrap
                        ${
                          isPinned
                            ? "sticky bg-slate-900 z-40 shadow-[4px_0_8px_-4px_rgba(148,163,184,0.45)]"
                            : ""
                        }
                      `}
                      style={{
                        left:
                          left !== undefined
                            ? `${left}px`
                            : undefined,
                      }}
                      title="Right-click to pin/unpin"
                    >
                      {flexRender(
                        column.columnDef
                          .header,
                        header.getContext()
                      )}

                      {isPinned && (
                        <span className="ml-2 text-[10px] text-slate-500">
                          📌
                        </span>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          <div
            className="relative"
            style={{
              width: `${totalWidth}px`,
              minWidth: "1390px",
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {virtualRows.map(
              (virtualRow) => {
                const row =
                  rows[virtualRow.index];

                const isActiveRow =
                  virtualRow.index ===
                  activeRow;

                return (
                  <div
                    key={row.id}
                    role="row"
                    aria-rowindex={virtualRow.index + 2}
                    className={`
                      absolute
                      left-0
                      top-0
                      grid
                      border-b
                      border-slate-800
                      text-sm
                      ${
                        isActiveRow
                          ? "bg-slate-800/80"
                          : "hover:bg-slate-900"
                      }
                    `}
                    style={{
                      width: `${totalWidth}px`,
                      height: "36px",
                      transform: `translateY(${virtualRow.start}px)`,
                      gridTemplateColumns,
                    }}
                  >
                    {row
                      .getVisibleCells()
                      .map(
                        (
                          cell,
                          columnIndex
                        ) => {
                          const value =
                            cell.getValue();

                          const column =
                            cell.column;

                          const isPinned =
                            column.getIsPinned();

                          const left =
                            isPinned === "left"
                              ? column.getStart(
                                  "left"
                                )
                              : undefined;

                          const isActiveCell =
                            isActiveRow &&
                            columnIndex ===
                              activeColumn;

                          const isWatched =
                            watchlist.has(
                              row.original.symbol
                            );

                          return (
                            <div
                              key={cell.id}
                              role="gridcell"
                              aria-colindex={columnIndex + 1}
                              aria-selected={isActiveCell}
                              className={`
                                h-[36px]
                                flex
                                items-center
                                px-3
                                border-r
                                border-slate-800
                                truncate
                                ${
                                  isPinned
                                    ? "sticky bg-slate-950 z-20 shadow-[4px_0_8px_-4px_rgba(148,163,184,0.35)]"
                                    : ""
                                }
                                ${
                                  isActiveCell
                                    ? "ring-2 ring-inset ring-blue-500 z-30"
                                    : ""
                                }
                                ${
                                  column.id ===
                                  "symbol"
                                    ? "font-semibold text-blue-400"
                                    : ""
                                }
                              `}
                              style={{
                                left:
                                  left !==
                                  undefined
                                    ? `${left}px`
                                    : undefined,
                              }}
                            >
                              {column.id ===
                                "symbol" &&
                              isWatched
                                ? "★ "
                                : null}

                              {flexRender(
                                cell.column
                                  .columnDef.cell,
                                cell.getContext()
                              ) ?? (
                                <span>
                                  {value ===
                                  null
                                    ? "—"
                                    : String(
                                        value
                                      )}
                                </span>
                              )}
                            </div>
                          );
                        }
                      )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>

      {contextMenu && (
        <div
          className="fixed z-[100] min-w-[180px] rounded-lg border border-slate-700 bg-slate-900 py-1 shadow-xl"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <button
            type="button"
            className="w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
            onClick={() =>
              toggleColumnPin(
                contextMenu.columnId
              )
            }
          >
            {table
              .getColumn(
                contextMenu.columnId
              )
              ?.getIsPinned()
              ? "📌 Unpin column"
              : "📌 Pin column"}
          </button>

          {contextMenu.columnId ===
            "symbol" && (
            <div className="px-4 py-2 text-xs text-slate-500 border-t border-slate-800">
              Symbol is always pinned
            </div>
          )}
        </div>
      )}

      {showCheatSheet && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4"
          onClick={() =>
            setShowCheatSheet(false)
          }
        >
          <div
            className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-950 p-6 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Keyboard Shortcuts
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowCheatSheet(false)
                }
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {[
                ["↑ ↓", "Move active row"],
                ["← →", "Move active cell"],
                ["Enter", "Open stock detail"],
                ["Space", "Toggle watchlist"],
                ["Home", "First row"],
                ["End", "Last row"],
                ["Page Up", "Scroll one viewport up"],
                ["Page Down", "Scroll one viewport down"],
                ["?", "Open this shortcut guide"],
                ["Esc", "Close modal"],
              ].map(
                ([key, description]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg bg-slate-900 px-4 py-2"
                  >
                    <kbd className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-200">
                      {key}
                    </kbd>

                    <span className="text-sm text-slate-400">
                      {description}
                    </span>
                  </div>
                )
              )}
            </div>

            {selectedStock && (
              <div className="mt-5 rounded-lg border border-blue-900 bg-blue-950/30 px-4 py-3 text-sm text-blue-300">
                Selected stock:{" "}
                <strong>
                  {selectedStock}
                </strong>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}