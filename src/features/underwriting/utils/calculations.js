import { formatCurrency, formatPercent } from "./format";
import { calcMonthlyOperatingExpenses } from "./operatingExpenses";
import { safeNum, monthlyPayment } from "./number";



export function evaluateDeal(inputs) {
  const purchasePrice = safeNum(inputs.purchasePrice);
  const downPayment = safeNum(inputs.downPayment);
  const interestRatePct = safeNum(inputs.interestRatePct);
  const loanTermYears = safeNum(inputs.loanTermYears);
  // const monthlyRent = safeNum(inputs.monthlyRent);
  const isAfterRepair = inputs.analysisMode === "afterRepair";

  const monthlyRent = isAfterRepair && inputs.afterRepairMonthlyRent
  ? safeNum(inputs.afterRepairMonthlyRent)
  : safeNum(inputs.monthlyRent);


  const propertyValue = isAfterRepair && inputs.afterRepairValue
    ? safeNum(inputs.afterRepairValue)
    : safeNum(inputs.purchasePrice);


  const loanAmount = Math.max(0, purchasePrice - downPayment);
  const monthlyRate = (interestRatePct / 100) / 12;
  const n = loanTermYears * 12;

  const monthlyPAndI = monthlyPayment(loanAmount, monthlyRate, n);

  const { monthlyOperatingExpenses } = calcMonthlyOperatingExpenses(inputs);

  const netCashFlowMonthly = monthlyRent - monthlyOperatingExpenses - monthlyPAndI;

  const cashInvested = downPayment;
  const cashOnCash = cashInvested > 0 ? (netCashFlowMonthly * 12) / cashInvested : 0;

  return {
    loanAmount,
    monthlyPAndI,
    monthlyOperatingExpenses,
    netCashFlowMonthly,
    cashOnCash,
    
    loanAmountFormatted: formatCurrency(loanAmount),
    monthlyPAndIFormatted: formatCurrency(monthlyPAndI),
    monthlyOperatingExpensesFormatted: formatCurrency(monthlyOperatingExpenses),
    netCashFlowMonthlyFormatted: formatCurrency(netCashFlowMonthly),
    cashOnCashFormatted: formatPercent(cashOnCash),
  };
}

