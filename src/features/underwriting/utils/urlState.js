const KEYS = [
  "propertyUrl",
  "purchasePrice",
  "downPayment",
  "interestRatePct",
  "loanTermYears",
  "monthlyRent",
  "monthlyFixedExpenses",
  "annualPropertyTaxes",
  "annualInsurance",
  "vacancyPct",
  "maintenancePct",
  "managementPct",
  "capexPct",
  "holdYears",
  "annualRentGrowthPct",
  "annualExpenseGrowthPct",
  "annualAppreciationPct",
  "afterRepairValue",
    "afterRepairMonthlyRent",
    "analysisMode",
];

// Encode the deal inputs into one URL-safe string
// export function encodeDealToQueryParam(inputs) {
//   const obj = {};
//   for (const k of KEYS) obj[k] = numOrNull(inputs[k]);
//   const json = JSON.stringify(obj);
//   // base64url (no + / =)
//   return btoa(unescape(encodeURIComponent(json)))
//     .replace(/\+/g, "-")
//     .replace(/\//g, "_")
//     .replace(/=+$/g, "");
// }

function b64urlEncode(str) {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function b64urlDecode(s) {
  const padded = padBase64(s.replace(/-/g, "+").replace(/_/g, "/"));
  return decodeURIComponent(escape(atob(padded)));
}

function padBase64(s) {
  const pad = s.length % 4;
  return pad ? s + "=".repeat(4 - pad) : s;
}

export function decodeDealFromQueryParam(dealParam) {
  if (!dealParam) return null;

  try {
    const json = b64urlDecode(dealParam);
    const payload = JSON.parse(json);

    // ✅ new versioned payload: { v: 1, inputs: {...} }
    if (payload && payload.v === 1 && payload.inputs && typeof payload.inputs === "object") {
      return pickKeys(payload.inputs);
    }

    // ✅ backwards compat: old payload was flat {purchasePrice:..., ...}
    if (payload && typeof payload === "object") {
      return pickKeys(payload);
    }

    return null;
  } catch (e) {
    return null;
  }
}



// Optional: readable params support (purchasePrice=... etc.)
export function readInputsFromSearchParams(searchParams) {
  const out = {};
  for (const k of KEYS) {
    if (!searchParams.has(k)) continue;
    const v = searchParams.get(k);

    if (k === "propertyUrl") out[k] = v || "";
    else out[k] = v === "" ? null : numOrNull(v);
  }
  return out;
}

export function writeInputsToSearchParams(searchParams, inputs) {
  for (const k of KEYS) {
    const v = inputs[k];
    if (v === null || v === undefined || v === "") {
      searchParams.delete(k);
    } else {
      searchParams.set(k, String(v));
    }
  }
  return searchParams;
}

function numOrNull(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// function padBase64(s) {
//   const pad = s.length % 4;
//   return pad ? s + "=".repeat(4 - pad) : s;
// }

function pickKeys(obj) {
  const cleaned = {};
  for (const k of KEYS) {
    if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
    cleaned[k] = k === "propertyUrl" ? strOrEmpty(obj[k]) : numOrNull(obj[k]);
  }
  return cleaned;
}


export function encodeDealToQueryParam(inputs) {
  try {
    const safeInputs = {};
    for (const k of KEYS) {
      safeInputs[k] =
        k === "propertyUrl" ? strOrEmpty(inputs[k]) : numOrNull(inputs[k]);
    }

    const payload = { v: 1, inputs: safeInputs };
    return b64urlEncode(JSON.stringify(payload));
  } catch {
    return "";
  }
}


function strOrEmpty(v) {
  return typeof v === "string" ? v.trim() : "";
}