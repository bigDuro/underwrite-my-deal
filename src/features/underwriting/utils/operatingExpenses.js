export function calcMonthlyOperatingExpenses(inputs, overrides = {}) {
  const rent = safeNum(overrides.monthlyRent ?? inputs.monthlyRent);

  const monthlyFixed = safeNum(inputs.monthlyFixedExpenses);

  const monthlyTaxes = safeNum(inputs.annualPropertyTaxes) / 12;
  const monthlyInsurance = safeNum(inputs.annualInsurance) / 12;

  const vacancy = rent * pct(inputs.vacancyPct);
  const maintenance = rent * pct(inputs.maintenancePct);
  const management = rent * pct(inputs.managementPct);
  const capex = rent * pct(inputs.capexPct);

  const monthlyOperatingExpenses =
    monthlyFixed +
    monthlyTaxes +
    monthlyInsurance +
    vacancy +
    maintenance +
    management +
    capex;

  return {
    monthlyOperatingExpenses,
    breakdown: {
      monthlyFixed,
      monthlyTaxes,
      monthlyInsurance,
      vacancy,
      maintenance,
      management,
      capex,
    },
  };
}

function pct(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, n) / 100;
}

function safeNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
