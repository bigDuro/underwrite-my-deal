import { formatCurrency, formatPercent } from "./format";
import { calcMonthlyOperatingExpenses } from "./operatingExpenses";
import { safeNum } from "./number"; // <-- recommended shared util

export function evaluateDeal(inputs) {
  const purchasePrice = safeNum(inputs.purchasePrice);
  const downPayment = safeNum(inputs.downPayment);
  const interestRatePct = safeNum(inputs.interestRatePct);
  const loanTermYears = safeNum(inputs.loanTermYears);

  const isAfterRepair = inputs.analysisMode === "afterRepair";

  const monthlyRent =
    isAfterRepair && inputs.afterRepairMonthlyRent
      ? safeNum(inputs.afterRepairMonthlyRent)
      : safeNum(inputs.monthlyRent);

  // (optional) keep propertyValue for future use
  const propertyValue =
    isAfterRepair && inputs.afterRepairValue
      ? safeNum(inputs.afterRepairValue)
      : safeNum(inputs.purchasePrice);

  const loanAmount = Math.max(0, purchasePrice - downPayment);
  const monthlyRate = (interestRatePct / 100) / 12;
  const n = loanTermYears * 12;

  const monthlyPAndI = monthlyPayment(loanAmount, monthlyRate, n);

  const { monthlyOperatingExpenses } = calcMonthlyOperatingExpenses(inputs, {
    monthlyRent, // IMPORTANT: ensures % of rent uses active rent
  });

  const monthlyNOI = monthlyRent - monthlyOperatingExpenses;

  const netCashFlowMonthly = monthlyRent - monthlyOperatingExpenses - monthlyPAndI;

  const cashInvested = downPayment;
  const cashOnCash = cashInvested > 0 ? (netCashFlowMonthly * 12) / cashInvested : 0;

  // ✅ New metrics
  const expenseRatio = monthlyRent > 0 ? (monthlyOperatingExpenses / monthlyRent) : 0;
  const dscr = monthlyPAndI > 0 ? (monthlyNOI / monthlyPAndI) : 0;

  return {
    loanAmount,
    monthlyPAndI,
    monthlyOperatingExpenses,
    monthlyNOI,
    netCashFlowMonthly,
    cashOnCash,
    expenseRatio,
    dscr,
    propertyValue, // optional but handy later

    loanAmountFormatted: formatCurrency(loanAmount),
    monthlyPAndIFormatted: formatCurrency(monthlyPAndI),
    monthlyOperatingExpensesFormatted: formatCurrency(monthlyOperatingExpenses),
    monthlyNOIFormatted: formatCurrency(monthlyNOI),
    netCashFlowMonthlyFormatted: formatCurrency(netCashFlowMonthly),
    cashOnCashFormatted: formatPercent(cashOnCash),
    expenseRatioFormatted: formatPercent(expenseRatio),
    dscrFormatted: dscr ? dscr.toFixed(2) : "0.00",
  };
}

function monthlyPayment(principal, monthlyRate, months) {
  if (principal <= 0 || months <= 0) return 0;
  if (monthlyRate <= 0) return principal / months;
  const pow = Math.pow(1 + monthlyRate, months);
  return principal * (monthlyRate * pow) / (pow - 1);
}


