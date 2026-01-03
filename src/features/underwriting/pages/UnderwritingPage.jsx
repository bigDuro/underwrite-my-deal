import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import UnderwritingForm from "../components/UnderwritingForm";
import UnderwritingSummary from "../components/UnderwritingSummary";
import { DEFAULT_UNDERWRITING_INPUTS } from "../model/defaults";
// import TimelineControls from "../components/TimelineControls";
import PerformanceChart from "../components/PerformanceChart";
import { buildPerformanceTimeline } from "../utils/timeline";
import PropertyReference from "../components/PropertyReference";
import { useLocation, useNavigate } from "react-router-dom";
import {
    decodeDealFromQueryParam,
    encodeDealToQueryParam,
    readInputsFromSearchParams,
} from "../utils/urlState";


export default function UnderwritingPage() {
    const [inputs, setInputs] = useState(DEFAULT_UNDERWRITING_INPUTS);

    const location = useLocation();
    const navigate = useNavigate();

    // Prevent URL->state->URL loops
    const hydratedRef = useRef(false);
    const lastDealRef = useRef(null);

    // 1) On first load (or when URL changes), hydrate inputs from URL
    useEffect(() => {
  const sp = new URLSearchParams(location.search);
  const dealParam = sp.get("deal") || "";

  // if we already hydrated this exact deal string, skip
  if (dealParam && dealParam === lastDealRef.current) return;

  const fromDeal = decodeDealFromQueryParam(dealParam);
  const fromReadable = readInputsFromSearchParams(sp);
  console.log(fromDeal)

  const merged = {
    ...DEFAULT_UNDERWRITING_INPUTS,
    ...(fromDeal || {}),
    ...(Object.keys(fromReadable).length ? fromReadable : {}),
  };

  setInputs(merged);
  hydratedRef.current = true;
  lastDealRef.current = dealParam;
}, [location.search]);

    // 2) When inputs change, write them back to the URL (debounced)
    useEffect(() => {
        if (!hydratedRef.current) return;

        const id = setTimeout(() => {
            const sp = new URLSearchParams(location.search);

            // Write compact param, remove verbose params
            const encoded = encodeDealToQueryParam(inputs);
            sp.set("deal", encoded);

            // Optional: clear readable params to avoid duplication
            // (keep this on for compact share links)
            [
                "purchasePrice", "downPayment", "interestRatePct", "loanTermYears", "monthlyRent",
                "monthlyFixedExpenses", "annualPropertyTaxes", "annualInsurance", "vacancyPct",
                "maintenancePct", "managementPct", "capexPct", "holdYears", "annualRentGrowthPct",
                "annualExpenseGrowthPct", "annualAppreciationPct"
            ].forEach((k) => sp.delete(k));

            const next = `${location.pathname}?${sp.toString()}`;

            // Replace so typing doesn’t spam browser history
            navigate(next, { replace: true });
        }, 300);

        return () => clearTimeout(id);
    }, [inputs, location.pathname, location.search, navigate]);

    const timeline = useMemo(() => buildPerformanceTimeline(inputs), [inputs]);
    const results = timeline.snapshot;

    return (
        <Box sx={{ width: "100%" }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    px: { xs: 2, sm: 3 },
                    mb: 2,
                }}
            >
                <Box sx={{ width: "100%", maxWidth: 1440 }}>
                    <Paper sx={{ p: 2, backgroundColor: "background.paper" }}>
                        <PropertyReference value={inputs} onChange={setInputs} />
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigator.clipboard.writeText(window.location.href)}
                        >
                            Copy share link
                        </Button>
                    </Paper>
                </Box>
            </Box>
            {/* ================= Inputs (centered) ================= */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    px: { xs: 2, sm: 3 },
                    mb: 2,
                }}
            >
                <Box sx={{ width: "100%", maxWidth: 1440 }}>
                    <Paper sx={{ p: 2, backgroundColor: "background.paper" }}>
                        <UnderwritingForm value={inputs} onChange={setInputs} />
                    </Paper>
                </Box>
            </Box>

            {/* ================= Results (full width) ================= */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    px: { xs: 2, sm: 3 },
                    mb: 2,
                }}
            >
                <Box sx={{ width: "100%", maxWidth: 1440 }}>
                    <Paper sx={{ p: 2, backgroundColor: "background.paper" }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                            Summary
                        </Typography>

                        <UnderwritingSummary results={results} />
                        <PerformanceChart series={timeline.series} />
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}
