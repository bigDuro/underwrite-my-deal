import React from "react";
import PageLayout from "./shared/components/PageLayout";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <PageLayout title="Real Estate Underwriting">
      <AppRoutes />
    </PageLayout>
  );
}
