import React from "react";

export function formatPrice(value: number): string {
  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatChange(value: number): string {
  const arrow = value > 0 ? "▲" : value < 0 ? "▼" : "−";
  const sign = value > 0 ? "+" : "";

  return `${arrow} ${sign}${value.toFixed(2)}%`;
}

export function formatVolume(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }

  return value.toString();
}

export function formatMarketCap(value: number): string {
  const crore = value / 10_000_000;

  return `₹${crore.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} Cr`;
}

export function getRsiClassName(rsi: number): string {
  if (rsi < 30) {
    return "text-green-600 font-semibold";
  }

  if (rsi <= 70) {
    return "text-yellow-600 font-semibold";
  }

  return "text-red-600 font-semibold";
}

export function PriceCell({ value }: { value: number }) {
  return <span>{formatPrice(value)}</span>;
}

export function ChangeCell({ value }: { value: number }) {
  const className =
    value > 0
      ? "text-green-600 font-semibold"
      : value < 0
        ? "text-red-600 font-semibold"
        : "text-gray-600";

  return <span className={className}>{formatChange(value)}</span>;
}

export function VolumeCell({ value }: { value: number }) {
  return <span>{formatVolume(value)}</span>;
}

export function MarketCapCell({ value }: { value: number }) {
  return <span>{formatMarketCap(value)}</span>;
}

export function RSICell({ value }: { value: number }) {
  return <span className={getRsiClassName(value)}>{value.toFixed(2)}</span>;
}