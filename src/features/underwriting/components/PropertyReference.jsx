import React from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

export default function PropertyReference({ value, onChange }) {
  const url = value.propertyUrl || "";

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
        Property reference
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="stretch">
        <TextField
          label="Listing URL (Zillow / Redfin / etc.)"
          value={url}
          onChange={(e) => onChange({ ...value, propertyUrl: e.target.value })}
          fullWidth
          size="small"
          placeholder="https://www.zillow.com/..."
        />

        <Button
          variant="outlined"
          disabled={!isValidHttpUrl(url)}
          onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
          sx={{ whiteSpace: "nowrap" }}
        >
          Open
        </Button>

        <Button
          variant="outlined"
          disabled={!url.trim()}
          onClick={() => navigator.clipboard.writeText(url.trim())}
          sx={{ whiteSpace: "nowrap" }}
        >
          Copy
        </Button>
      </Stack>

      {!url.trim() ? (
        <Box />
      ) : (
        <Typography variant="caption" color="text.secondary">
          This URL is included in your share link.
        </Typography>
      )}
    </Stack>
  );
}

function isValidHttpUrl(s) {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
