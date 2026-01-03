import { evaluateDeal } from "./calculations";
import { calcMonthlyOperatingExpenses } from "./operatingExpenses";
import { safeNum, clampInt, monthlyPayment } from "./number";


export function buildPerformanceTimeline(inputs) {
  const base = evaluateDeal(inputs);

  const isAfterRepair = inputs.analysisMode === "afterRepair";

  // Value basis (purchase vs ARV)
  const baseValue = isAfterRepair && inputs.afterRepairValue
    ? safeNum(inputs.afterRepairValue)
    : safeNum(inputs.purchasePrice);

  // Rent basis (as-is vs after-repair)
  const baseRent = isAfterRepair && inputs.afterRepairMonthlyRent
    ? safeNum(inputs.afterRepairMonthlyRent)
    : safeNum(inputs.monthlyRent);

  // Financing is still based on purchase + down (unless you later add rehab financing)
  const purchasePrice = safeNum(inputs.purchasePrice);
  const downPayment = safeNum(inputs.downPayment);
  const loanAmount = Math.max(0, purchasePrice - downPayment);

  const holdYears = clampInt(inputs.holdYears, 1, 30);
  const months = holdYears * 12;

  const annualRentGrowth = safeNum(inputs.annualRentGrowthPct) / 100;
  const annualExpGrowth = safeNum(inputs.annualExpenseGrowthPct) / 100;
  const annualAppreciation = safeNum(inputs.annualAppreciationPct) / 100;

  const rMonthly = (safeNum(inputs.interestRatePct) / 100) / 12;
  const termMonths = clampInt(inputs.loanTermYears, 1, 40) * 12;

  const payment = monthlyPayment(loanAmount, rMonthly, termMonths);

  let balance = loanAmount;
  let cumulativeCashFlow = 0;

  const series = [];
  for (let m = 1; m <= months; m++) {
    const yearFrac = m / 12;

    // ✅ grow rent from the correct base rent
    const rent = baseRent * Math.pow(1 + annualRentGrowth, yearFrac);

    // grow fixed + annual portions by expense growth
    const fixedGrowthFactor = Math.pow(1 + annualExpGrowth, yearFrac);

    const grownInputs = {
      ...inputs,
      monthlyFixedExpenses: safeNum(inputs.monthlyFixedExpenses) * fixedGrowthFactor,
      annualPropertyTaxes: safeNum(inputs.annualPropertyTaxes) * fixedGrowthFactor,
      annualInsurance: safeNum(inputs.annualInsurance) * fixedGrowthFactor,
    };

    const { monthlyOperatingExpenses } = calcMonthlyOperatingExpenses(grownInputs, {
      monthlyRent: rent, // % items use current rent
    });

    // amortization
    const interest = balance > 0 ? balance * rMonthly : 0;
    const principal = Math.max(0, payment - interest);
    balance = Math.max(0, balance - principal);

    const netCashFlow = rent - monthlyOperatingExpenses - payment;
    cumulativeCashFlow += netCashFlow;

    // ✅ appreciate from the correct base value (ARV if afterRepair mode)
    const propertyValue = baseValue * Math.pow(1 + annualAppreciation, yearFrac);
    const equity = propertyValue - balance;

    series.push({
      month: m,
      year: Number((m / 12).toFixed(2)),
      rent,
      operatingExpenses: monthlyOperatingExpenses,
      payment,
      netCashFlow,
      cumulativeCashFlow,
      loanBalance: balance,
      propertyValue,
      equity,
    });
  }

  return { snapshot: base, series };
}
