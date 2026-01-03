import React from "react";
import { Grid, TextField } from "@mui/material";

function numberOrEmpty(v) {
  return v === null || v === undefined ? "" : v;
}

export default function TimelineControls({ value, onChange }) {
  const set = (key) => (e) => {
    const raw = e.target.value;
    const next = raw === "" ? "" : Number(raw);
    onChange({ ...value, [key]: next });
  };

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={12} sm={3}>
        <TextField
          label="Hold (years)"
          type="number"
          fullWidth
          value={numberOrEmpty(value.holdYears)}
          onChange={set("holdYears")}
          size="small"
        />
      </Grid>

      <Grid item xs={12} sm={3}>
        <TextField
          label="Rent growth %"
          type="number"
          fullWidth
          value={numberOrEmpty(value.annualRentGrowthPct)}
          onChange={set("annualRentGrowthPct")}
          size="small"
        />
      </Grid>

      <Grid item xs={12} sm={3}>
        <TextField
          label="Expense growth %"
          type="number"
          fullWidth
          value={numberOrEmpty(value.annualExpenseGrowthPct)}
          onChange={set("annualExpenseGrowthPct")}
          size="small"
        />
      </Grid>

      <Grid item xs={12} sm={3}>
        <TextField
          label="Appreciation %"
          type="number"
          fullWidth
          value={numberOrEmpty(value.annualAppreciationPct)}
          onChange={set("annualAppreciationPct")}
          size="small"
        />
      </Grid>
    </Grid>
  );
}
