import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

const stockTablePath = path.resolve(
  process.cwd(),
  "src/components/DataGrid/StockTable.tsx"
);

const source = fs.readFileSync(stockTablePath, "utf-8");

describe("Day 4 DataGrid requirements", () => {
  it("uses fixed 36px row height", () => {
    expect(source).toContain('height: "36px"');
  });

  it("uses virtualizer overscan between 10 and 15", () => {
    expect(source).toMatch(/overscan:\s*(10|11|12|13|14|15)/);
  });

  it("uses 36px estimate size", () => {
    expect(source).toContain("estimateSize: () => 36");
  });

  it("pins Symbol column by default", () => {
    expect(source).toContain('left: ["symbol"]');
  });

  it("supports arrow key navigation", () => {
    expect(source).toContain('event.key === "ArrowUp"');
    expect(source).toContain('event.key === "ArrowDown"');
    expect(source).toContain('event.key === "ArrowLeft"');
    expect(source).toContain('event.key === "ArrowRight"');
  });

  it("supports Home and End navigation", () => {
    expect(source).toContain('event.key === "Home"');
    expect(source).toContain('event.key === "End"');
  });

  it("supports PageUp and PageDown", () => {
    expect(source).toContain('event.key === "PageUp"');
    expect(source).toContain('event.key === "PageDown"');
  });

  it("supports Enter shortcut", () => {
    expect(source).toContain('event.key === "Enter"');
  });

  it("supports Space watchlist shortcut", () => {
    expect(source).toContain('event.code === "Space"');
  });

  it("supports ? cheat sheet shortcut", () => {
    expect(source).toContain('event.key === "?"');
  });

  it("supports Escape shortcut", () => {
    expect(source).toContain('event.key === "Escape"');
  });

  it("has required ARIA grid roles", () => {
    expect(source).toContain('role="grid"');
    expect(source).toContain('role="row"');
    expect(source).toContain('role="gridcell"');
    expect(source).toContain('role="columnheader"');
  });

  it("supports scroll-to-row", () => {
    expect(source).toContain('aria-label="Scroll to row"');
    expect(source).toContain("rowVirtualizer.scrollToIndex");
  });
});