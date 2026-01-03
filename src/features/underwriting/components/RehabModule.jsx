import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { v4 as uuid } from "uuid";

export default function RehabModule({ value, onChange }) {
  const items = value.rehabItems || [];

  const update = (next) => onChange({ ...value, ...next });

  const addItem = () => {
    update({
      rehabItems: [...items, { id: uuid(), label: "", cost: 0 }],
    });
  };

  const updateItem = (id, patch) => {
    update({
      rehabItems: items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    });
  };

  const removeItem = (id) => {
    update({
      rehabItems: items.filter((i) => i.id !== id),
    });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6" fontWeight={700}>
        Rehab / Remodel
      </Typography>

      {items.map((i) => (
        <Stack key={i.id} direction="row" spacing={1}>
          <TextField
            label="Item"
            value={i.label}
            onChange={(e) => updateItem(i.id, { label: e.target.value })}
            fullWidth
            size="small"
          />
          <TextField
            label="Cost"
            type="number"
            value={i.cost}
            onChange={(e) => updateItem(i.id, { cost: Number(e.target.value) })}
            size="small"
          />
          <Button onClick={() => removeItem(i.id)}>✕</Button>
        </Stack>
      ))}

      <Button variant="outlined" onClick={addItem}>
        Add rehab item
      </Button>

      <TextField
        label="Contingency (%)"
        type="number"
        value={value.rehabContingencyPct}
        onChange={(e) =>
          update({ rehabContingencyPct: Number(e.target.value) })
        }
        size="small"
      />
    </Stack>
  );
}
