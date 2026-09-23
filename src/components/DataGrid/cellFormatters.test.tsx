import { describe, expect, test } from "vitest";

import {
  formatPrice,
  formatChange,
  formatVolume,
  formatMarketCap,
  getRsiClassName,
} from "./cellFormatters";

describe("Stock Grid Cell Formatters", () => {
  test("formats price with rupee symbol", () => {
    expect(formatPrice(1234.5)).toBe("₹1,234.50");
  });

  test("formats large price with Indian thousands separators", () => {
    expect(formatPrice(1234567.89)).toBe("₹12,34,567.89");
  });

  test("formats positive change with up arrow", () => {
    expect(formatChange(5.25)).toBe("▲ +5.25%");
  });

  test("formats negative change with down arrow", () => {
    expect(formatChange(-3.5)).toBe("▼ -3.50%");
  });

  test("formats zero change", () => {
    expect(formatChange(0)).toBe("− 0.00%");
  });

  test("formats volume in K", () => {
    expect(formatVolume(2500)).toBe("2.50K");
  });

  test("formats volume in M", () => {
    expect(formatVolume(2500000)).toBe("2.50M");
  });

  test("formats volume in B", () => {
    expect(formatVolume(2500000000)).toBe("2.50B");
  });

  test("formats market cap in crore", () => {
    expect(formatMarketCap(10_000_000)).toBe("₹1.00 Cr");
  });

  test("RSI below 30 is green", () => {
    expect(getRsiClassName(25)).toContain("green");
  });

  test("RSI between 30 and 70 is yellow", () => {
    expect(getRsiClassName(50)).toContain("yellow");
  });

  test("RSI above 70 is red", () => {
    expect(getRsiClassName(75)).toContain("red");
  });
});