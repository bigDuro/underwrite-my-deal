import React from "react";
import { Stack, Typography, Divider } from "@mui/material";

export default function UnderwritingSummary({ results }) {
  return (
    <Stack spacing={1}>
      <Row label="Loan Amount" value={results.loanAmountFormatted} />
      <Row label="Est. Monthly P&I" value={results.monthlyPAndIFormatted} />
      <Divider sx={{ my: 1 }} />
      <Row label="Net Cash Flow / mo" value={results.netCashFlowMonthlyFormatted} />
      <Row label="Cash-on-Cash (annual)" value={results.cashOnCashFormatted} />
    </Stack>
  );
}

function Row({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="baseline">
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body1" sx={{ fontWeight: 700 }}>{value}</Typography>
    </Stack>
  );
}
