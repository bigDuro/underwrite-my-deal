import React from "react";
import { Alert, Box, Chip, Stack, Typography, Divider } from "@mui/material";


function Row({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="baseline">
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body1" sx={{ fontWeight: 700 }}>{value}</Typography>
    </Stack>
  );
}

export default function UnderwritingSummary({ results, verdict }) {
  return (
    <Stack spacing={2}>
      {verdict && (
        <Alert severity={verdict.verdict.tone} icon={false}>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontWeight: 900 }}>
                {verdict.verdict.emoji} {verdict.verdict.label}
              </Typography>
              <Chip size="small" label={`Score: ${verdict.score}`} />
            </Stack>

            {verdict.reasons?.length > 0 && (
              <Box>
                {verdict.reasons.slice(0, 3).map((r, idx) => (
                  <Typography key={idx} variant="body2">• {r}</Typography>
                ))}
              </Box>
            )}

            {verdict.warnings?.length > 0 && (
              <Box>
                {verdict.warnings.slice(0, 2).map((w, idx) => (
                  <Typography key={idx} variant="body2" sx={{ opacity: 0.9 }}>
                    ⚠ {w}
                  </Typography>
                ))}
              </Box>
            )}
          </Stack>
        </Alert>
      )}
      {/* ...your existing summary rows/metrics here... */}
      <Stack spacing={1}>
        <Row label="Loan Amount" value={results.loanAmountFormatted} />
        <Row label="Est. Monthly P&I" value={results.monthlyPAndIFormatted} />
        <Divider sx={{ my: 1 }} />
        <Row label="Net Cash Flow / mo" value={results.netCashFlowMonthlyFormatted} />
        <Row label="Cash-on-Cash (annual)" value={results.cashOnCashFormatted} />
        <Divider sx={{ my: 1 }} />
        <Row label="NOI (monthly)" value={results.monthlyNOIFormatted} />
        <Row label="DSCR" value={results.dscrFormatted} />
        <Row label="Expense Ratio" value={results.expenseRatioFormatted} />

      </Stack>
      {/* e.g. monthly P&I, expenses, cash flow, CoC, etc */}
    </Stack>
  );
}

