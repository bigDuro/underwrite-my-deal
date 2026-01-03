import React, { useMemo, useState } from "react";
import { Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

// import { formatCurrency } from "../../../../shared/utils/format";
import { formatCurrency } from "../utils/format";

export default function PerformanceChart({ series }) {
  const [mode, setMode] = useState("cashflow"); // cashflow | equity | balances

  const lines = useMemo(() => {
    if (mode === "cashflow") {
      return [
        { key: "netCashFlow", label: "Net Cash Flow (mo)" },
        { key: "cumulativeCashFlow", label: "Cumulative Cash Flow" },
      ];
    }
    if (mode === "equity") {
      return [
        { key: "equity", label: "Equity" },
        { key: "propertyValue", label: "Property Value" },
      ];
    }
    return [
      { key: "loanBalance", label: "Loan Balance" },
    ];
  }, [mode]);

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Performance Over Time
        </Typography>

        <ButtonGroup size="small" variant="outlined">
          <Button onClick={() => setMode("cashflow")} disabled={mode === "cashflow"}>
            Cash Flow
          </Button>
          <Button onClick={() => setMode("equity")} disabled={mode === "equity"}>
            Equity
          </Button>
          <Button onClick={() => setMode("balances")} disabled={mode === "balances"}>
            Loan
          </Button>
        </ButtonGroup>
      </Stack>

      <Box sx={{ height: 320, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tickFormatter={(m) => `${m}`} />
            <YAxis tickFormatter={(v) => formatCurrency(v)} width={90} />
            <Tooltip formatter={(v) => formatCurrency(v)} labelFormatter={(m) => `Month ${m}`} />
            <Legend />
            {lines.map((l) => (
              <Line
                key={l.key}
                type="monotone"
                dataKey={l.key}
                name={l.label}
                dot={false}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
