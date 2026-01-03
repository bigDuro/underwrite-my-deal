export const DEFAULT_UNDERWRITING_INPUTS = {
  propertyUrl: "",
  purchasePrice: 250000,
  downPayment: 50000,
  interestRatePct: 6.5,
  loanTermYears: 30,
  monthlyRent: 2200,

  // Fixed (non-% based) monthly costs you pay
  monthlyFixedExpenses: 200, // HOA, utilities owner pays, etc.

  // Annual items (converted to monthly)
  annualPropertyTaxes: 3000,
  annualInsurance: 1200,

  // % of rent (entered as percent, e.g. 5 = 5%)
  vacancyPct: 5,
  maintenancePct: 5,
  managementPct: 8,
  capexPct: 5,

  // timeline
  holdYears: 5,
  annualRentGrowthPct: 3,
  annualExpenseGrowthPct: 2,
  annualAppreciationPct: 3,

  // 👇 NEW — Rehab
  rehabItems: [], // [{ id, label, cost }]
  rehabContingencyPct: 10,

  afterRepairValue: null,        // ARV
  afterRepairMonthlyRent: null,  // ARR

  // Analysis mode
  analysisMode: "asis", // "asis" | "afterRepair"
};
