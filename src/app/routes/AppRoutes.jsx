import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UnderwritingPage from "../../features/underwriting/pages/UnderwritingPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UnderwritingPage />} />
      <Route path="/deal" element={<UnderwritingPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
