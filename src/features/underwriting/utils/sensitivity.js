import { safeNum } from "./number";

export const SENSITIVITY_PRESETS = {
  base: { key: "base", label: "Base", shocks: {} },

  rentDown10: {
    key: "rentDown10",
    label: "Rent -10%",
    shocks: { rentMultiplier: 0.9 },
  },

  expensesUp10: {
    key: "expensesUp10",
    label: "Expenses +10%",
    shocks: { expenseMultiplier: 1.1 },
  },

  rateUp1: {
    key: "rateUp1",
    label: "Rate +1%",
    shocks: { rateDeltaPct: 1.0 },
  },
};

export function applySensitivity(inputs, presetKey) {
  const preset = SENSITIVITY_PRESETS[presetKey] || SENSITIVITY_PRESETS.base;
  const { rentMultiplier, expenseMultiplier, rateDeltaPct } = preset.shocks || {};

  const next = { ...inputs };

  // Rent shock should apply to the ACTIVE rent field for the current analysisMode
  const isAfterRepair = inputs.analysisMode === "afterRepair";

  if (rentMultiplier && rentMultiplier !== 1) {
    if (isAfterRepair && inputs.afterRepairMonthlyRent) {
      next.afterRepairMonthlyRent = round2(safeNum(inputs.afterRepairMonthlyRent) * rentMultiplier);
    } else {
      next.monthlyRent = round2(safeNum(inputs.monthlyRent) * rentMultiplier);
    }
  }

  // Expense shock: scale fixed + annual items + % of rent inputs
  // (This is a “stress test”; yes it double-counts a bit on % of rent, but that’s conservative.)
  if (expenseMultiplier && expenseMultiplier !== 1) {
    next.monthlyFixedExpenses = round2(safeNum(inputs.monthlyFixedExpenses) * expenseMultiplier);
    next.annualPropertyTaxes = round2(safeNum(inputs.annualPropertyTaxes) * expenseMultiplier);
    next.annualInsurance = round2(safeNum(inputs.annualInsurance) * expenseMultiplier);

    next.vacancyPct = round2(safeNum(inputs.vacancyPct) * expenseMultiplier);
    next.maintenancePct = round2(safeNum(inputs.maintenancePct) * expenseMultiplier);
    next.managementPct = round2(safeNum(inputs.managementPct) * expenseMultiplier);
    next.capexPct = round2(safeNum(inputs.capexPct) * expenseMultiplier);
  }

  // Rate shock: increase interest rate by N percentage points
  if (rateDeltaPct && rateDeltaPct !== 0) {
    next.interestRatePct = round2(safeNum(inputs.interestRatePct) + rateDeltaPct);
  }

  return next;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
