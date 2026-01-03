import React, { useMemo } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function numberOrEmpty(v) {
  return v === null || v === undefined ? "" : v;
}

function safeNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function pctOfRentLabel(pct, rent) {
  const p = safeNum(pct);
  const r = safeNum(rent);
  const monthly = (r * p) / 100;
  if (!r || !p) return "";
  return `~$${Math.round(monthly).toLocaleString()}/mo`;
}

export default function UnderwritingForm({ value, onChange }) {
  const set = (key) => (e) => {
    const raw = e.target.value;
    const next = raw === "" ? "" : Number(raw);
    onChange({ ...value, [key]: next });
  };

  const rent = value.monthlyRent;

  const varHints = useMemo(() => {
    return {
      vacancy: pctOfRentLabel(value.vacancyPct, rent),
      maintenance: pctOfRentLabel(value.maintenancePct, rent),
      management: pctOfRentLabel(value.managementPct, rent),
      capex: pctOfRentLabel(value.capexPct, rent),
    };
  }, [value.vacancyPct, value.maintenancePct, value.managementPct, value.capexPct, rent]);

  return (
    <Stack spacing={2}>
      {/* ===== Core Deal Inputs ===== */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
          Deal
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <MoneyField
              label="Purchase price"
              value={value.purchasePrice}
              onChange={set("purchasePrice")}
              helperText="Contract price"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <MoneyField
              label="Down payment"
              value={value.downPayment}
              onChange={set("downPayment")}
              helperText="Cash into the deal"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <PercentField
              label="Interest rate"
              value={value.interestRatePct}
              onChange={set("interestRatePct")}
              helperText="APR"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <YearsField
              label="Loan term"
              value={value.loanTermYears}
              onChange={set("loanTermYears")}
              helperText="Years"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <MoneyField
              label="Monthly rent"
              value={value.monthlyRent}
              onChange={set("monthlyRent")}
              helperText="Gross rent"
            />
          </Grid>
        </Grid>
      </Box>
      <Divider />

      {/* ===== After Repair ===== */}
      <Accordion sx={{ backgroundImage: "none" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 800 }}>After Repair</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="After Repair Value (ARV)"
                type="number"
                fullWidth
                value={numberOrEmpty(value.afterRepairValue)}
                onChange={set("afterRepairValue")}
                helperText="Estimated value after rehab"
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="After Repair Monthly Rent"
                type="number"
                fullWidth
                value={numberOrEmpty(value.afterRepairMonthlyRent)}
                onChange={set("afterRepairMonthlyRent")}
                helperText="Expected rent after rehab"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <ToggleButtonGroup
                  value={value.analysisMode || "asis"}
                  exclusive
                  onChange={(_, v) => v && onChange({ ...value, analysisMode: v })}
                  size="small"
                >
                  <ToggleButton value="asis">As-Is</ToggleButton>
                  <ToggleButton value="afterRepair">After Repair</ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>






      <Divider />

      {/* ===== Operating Expenses ===== */}
      <Accordion sx={{ backgroundImage: "none" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 800 }}>Operating expenses</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <MoneyField
              label="Fixed monthly"
              value={value.monthlyFixedExpenses}
              onChange={set("monthlyFixedExpenses")}
              helperText="HOA + utilities owner pays, etc."
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <MoneyField
              label="Property taxes (annual)"
              value={value.annualPropertyTaxes}
              onChange={set("annualPropertyTaxes")}
              helperText="We convert to monthly"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <MoneyField
              label="Insurance (annual)"
              value={value.annualInsurance}
              onChange={set("annualInsurance")}
              helperText="We convert to monthly"
            />
          </Grid>
        </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ===== % of rent ===== */}
      <Accordion sx={{ backgroundImage: "none" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 800 }}>Reserves (% of rent)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <PercentField
              label="Vacancy"
              value={value.vacancyPct}
              onChange={set("vacancyPct")}
              helperText={varHints.vacancy || "Percent of rent"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <PercentField
              label="Maintenance"
              value={value.maintenancePct}
              onChange={set("maintenancePct")}
              helperText={varHints.maintenance || "Repairs allowance"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <PercentField
              label="Management"
              value={value.managementPct}
              onChange={set("managementPct")}
              helperText={varHints.management || "If self-managing, set 0%"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <PercentField
              label="CapEx reserve"
              value={value.capexPct}
              onChange={set("capexPct")}
              helperText={varHints.capex || "Roof/HVAC/etc."}
            />
          </Grid>
        </Grid>
        </AccordionDetails>
      </Accordion>

      {/* ===== Advanced assumptions ===== */}
      <Accordion sx={{ backgroundImage: "none" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 800 }}>Advanced assumptions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <YearsField
                label="Hold period"
                value={value.holdYears}
                onChange={set("holdYears")}
                helperText="Timeline length"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <PercentField
                label="Rent growth"
                value={value.annualRentGrowthPct}
                onChange={set("annualRentGrowthPct")}
                helperText="Annual"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <PercentField
                label="Expense growth"
                value={value.annualExpenseGrowthPct}
                onChange={set("annualExpenseGrowthPct")}
                helperText="Annual (fixed + annual items)"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <PercentField
                label="Appreciation"
                value={value.annualAppreciationPct}
                onChange={set("annualAppreciationPct")}
                helperText="Annual"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}

/** ---------- Field helpers ---------- */

function MoneyField({ label, value, onChange, helperText }) {
  return (
    <TextField
      label={label}
      type="number"
      fullWidth
      size="small"
      value={numberOrEmpty(value)}
      onChange={onChange}
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
        inputProps: { min: 0 },
      }}
      helperText={helperText}
    />
  );
}

function PercentField({ label, value, onChange, helperText }) {
  return (
    <TextField
      label={label}
      type="number"
      fullWidth
      size="small"
      value={numberOrEmpty(value)}
      onChange={onChange}
      InputProps={{
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
        inputProps: { min: 0, step: 0.25 },
      }}
      helperText={helperText}
    />
  );
}

function YearsField({ label, value, onChange, helperText }) {
  return (
    <TextField
      label={label}
      type="number"
      fullWidth
      size="small"
      value={numberOrEmpty(value)}
      onChange={onChange}
      InputProps={{
        endAdornment: <InputAdornment position="end">yrs</InputAdornment>,
        inputProps: { min: 1, step: 1 },
      }}
      helperText={helperText}
    />
  );
}
