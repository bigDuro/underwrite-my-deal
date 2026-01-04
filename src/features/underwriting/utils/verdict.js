import { safeNum } from "./number";

/**
 * Inputs:
 *  - inputs: the underwriting input model (for rent, etc.)
 *  - results: evaluateDeal(...) snapshot (for cash flow, expenses, P&I)
 *  - timeline (optional): buildPerformanceTimeline(...) output for breakeven, year-1 metrics, etc.
 */
export function buildDealVerdict(inputs, results, timeline) {
  const rent = activeMonthlyRent(inputs);
  const cashFlow = safeNum(results.netCashFlowMonthly);
  const opex = safeNum(results.monthlyOperatingExpenses);
  const pAndI = safeNum(results.monthlyPAndI);

  const cashFlowMarginPct = rent > 0 ? (cashFlow / rent) * 100 : 0; // % of rent
  const expenseRatioPct = rent > 0 ? (opex / rent) * 100 : 0;       // % of rent
  const noiMonthly = Math.max(0, rent - opex);
  const dscr = pAndI > 0 ? noiMonthly / pAndI : 999;

  const { breakevenMonth, breakevenYear } = computeBreakeven(timeline);

  // ---- Score model (simple, interpretable) ----
  // Start at 0, add/subtract points. Map total -> label.
  let score = 0;
  const reasons = [];
  const warnings = [];

  // 1) Cash flow (strongest signal for "good deal")
  if (cashFlow >= 200) { score += 3; reasons.push(`Strong monthly cash flow (+$${Math.round(cashFlow)}/mo).`); }
  else if (cashFlow >= 50) { score += 2; reasons.push(`Positive monthly cash flow (+$${Math.round(cashFlow)}/mo).`); }
  else if (cashFlow >= 0) { score += 1; reasons.push(`Barely cash-flow positive (+$${Math.round(cashFlow)}/mo).`); }
  else if (cashFlow >= -150) { score -= 2; warnings.push(`Negative cash flow (-$${Math.round(Math.abs(cashFlow))}/mo).`); }
  else { score -= 4; warnings.push(`Material negative cash flow (-$${Math.round(Math.abs(cashFlow))}/mo).`); }

  // 2) Cash flow margin
  if (cashFlowMarginPct >= 10) { score += 2; reasons.push(`Healthy cash-flow margin (${cashFlowMarginPct.toFixed(1)}% of rent).`); }
  else if (cashFlowMarginPct >= 5) { score += 1; reasons.push(`Moderate cash-flow margin (${cashFlowMarginPct.toFixed(1)}% of rent).`); }
  else if (cashFlowMarginPct < 0) { /* already handled above */ }
  else { score -= 1; warnings.push(`Thin cash-flow margin (${cashFlowMarginPct.toFixed(1)}% of rent).`); }

  // 3) DSCR (risk / lender viability)
  if (dscr >= 1.25) { score += 2; reasons.push(`Strong DSCR (${dscr.toFixed(2)}).`); }
  else if (dscr >= 1.10) { score += 1; reasons.push(`Acceptable DSCR (${dscr.toFixed(2)}).`); }
  else if (pAndI > 0) { score -= 2; warnings.push(`Low DSCR (${dscr.toFixed(2)}).`); }

  // 4) Expense ratio (silent killer)
  if (expenseRatioPct <= 45) { score += 1; reasons.push(`Efficient expense ratio (${expenseRatioPct.toFixed(0)}%).`); }
  else if (expenseRatioPct <= 55) { /* neutral */ }
  else { score -= 2; warnings.push(`High expense ratio (${expenseRatioPct.toFixed(0)}%).`); }

  // 5) Breakeven timeline (optional; requires timeline)
  if (breakevenMonth !== null) {
    if (breakevenMonth <= 6) { score += 1; reasons.push(`Breakeven quickly (month ${breakevenMonth}).`); }
    else if (breakevenMonth <= 18) { /* neutral */ }
    else { score -= 1; warnings.push(`Breakeven takes a while (~${breakevenYear.toFixed(1)} yrs).`); }
  }

  // 6) Sanity warnings
  if (rent <= 0) warnings.push("Rent is 0 — deal metrics are not meaningful.");
  if (inputs.downPayment === "" || safeNum(inputs.downPayment) <= 0) warnings.push("Down payment is 0 — cash-on-cash may be misleading.");
  if (safeNum(inputs.interestRatePct) <= 0) warnings.push("Interest rate is 0 — ensure you intended this.");

  const verdict = labelFromScore(score);

  return {
    verdict,       // { label, tone, emoji }
    score,         // numeric
    metrics: {
      rent,
      cashFlow,
      cashFlowMarginPct,
      expenseRatioPct,
      dscr,
      breakevenMonth,
      breakevenYear,
    },
    reasons,
    warnings,
  };
}

// ---------- helpers ----------

function labelFromScore(score) {
  if (score >= 6) return { label: "Strong deal", tone: "success", emoji: "🟢" };
  if (score >= 3) return { label: "Decent deal", tone: "info", emoji: "🟡" };
  if (score >= 0) return { label: "Thin / sensitive", tone: "warning", emoji: "🟠" };
  return { label: "High risk / likely bad", tone: "error", emoji: "🔴" };
}

function activeMonthlyRent(inputs) {
  const isAfterRepair = inputs.analysisMode === "afterRepair";
  return isAfterRepair && inputs.afterRepairMonthlyRent
    ? safeNum(inputs.afterRepairMonthlyRent)
    : safeNum(inputs.monthlyRent);
}

function computeBreakeven(timeline) {
  if (!timeline?.series?.length) return { breakevenMonth: null, breakevenYear: null };
  const hit = timeline.series.find((p) => safeNum(p.cumulativeCashFlow) >= 0);
  if (!hit) return { breakevenMonth: null, breakevenYear: null };
  return { breakevenMonth: hit.month, breakevenYear: hit.month / 12 };
}
