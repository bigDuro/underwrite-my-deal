import React from "react";
import { Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { SENSITIVITY_PRESETS } from "../utils/sensitivity";

export default function SensitivityControls({ value, onChange }) {
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
        Sensitivity
      </Typography>

      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, v) => v && onChange(v)}
        size="small"
      >
        {Object.values(SENSITIVITY_PRESETS).map((p) => (
          <ToggleButton key={p.key} value={p.key}>
            {p.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Stack>
  );
}
