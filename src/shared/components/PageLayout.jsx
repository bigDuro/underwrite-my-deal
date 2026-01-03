import React from "react";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";

export default function PageLayout({ title = "Real Estate Underwriting", children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          px: 3,
          py: 3,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
