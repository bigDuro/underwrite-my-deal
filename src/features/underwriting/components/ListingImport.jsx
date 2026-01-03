import React, { useState } from "react";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";

export default function ListingImport({ onImported }) {
  const [url, setUrl] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [notes, setNotes] = useState([]);

  const run = async () => {
    setLoading(true);
    setErr(null);
    setNotes([]);
    try {
      const res = await fetch("http://localhost:8787/api/underwrite-from-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() || undefined, pastedText: pastedText.trim() || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Import failed");

      onImported(json.inputs);
      setNotes([
        `Confidence: ${Math.round((json.confidence || 0) * 100)}%`,
        ...(json.notes || []),
        ...(json.missing?.length ? [`Missing: ${json.missing.join(", ")}`] : []),
      ]);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
        Import from listing
      </Typography>

      <TextField
        label="Zillow / Redfin URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        fullWidth
        size="small"
        placeholder="https://www.zillow.com/..."
      />

      <TextField
        label="Or paste listing details (fallback)"
        value={pastedText}
        onChange={(e) => setPastedText(e.target.value)}
        fullWidth
        size="small"
        multiline
        minRows={3}
        placeholder="Paste the description, price, taxes, HOA, rent estimate, etc."
      />

      <Button variant="contained" onClick={run} disabled={loading || (!url.trim() && !pastedText.trim())}>
        {loading ? "Importing..." : "Import & Underwrite"}
      </Button>

      {err && <Alert severity="error">{err}</Alert>}
      {notes.length > 0 && (
        <Alert severity="info">
          {notes.map((n, i) => (
            <div key={i}>{n}</div>
          ))}
        </Alert>
      )}
    </Stack>
  );
}
