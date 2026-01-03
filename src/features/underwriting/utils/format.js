export function formatCurrency(n) {
  const value = Number(n);
  if (!Number.isFinite(value)) return "$0";
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function formatPercent(decimal) {
  const value = Number(decimal);
  if (!Number.isFinite(value)) return "0%";
  return `${(value * 100).toFixed(2)}%`;
}
