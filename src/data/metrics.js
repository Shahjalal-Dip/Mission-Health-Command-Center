// Metric definitions used by the flagging engine.
//
// Unlike our earlier placeholder version, these seven metrics are drawn
// directly from real Inspiration4 lab panels in NASA OSDR:
//   - CBC (Complete Blood Count), Quest Diagnostics -- OSD-569
//   - CMP (Comprehensive Metabolic Panel), Quest Diagnostics -- OSD-575
//   - Cytokine multiplex panel, Eve Technologies HD71 -- OSD-575
//
// IMPORTANT: normalRange is NOT set statically here. Real lab reference
// ranges (from Quest Diagnostics) vary by subject and were found to shift
// slightly even within the same subject across draws in the real data --
// so each individual reading carries its own rangeMin/rangeMax straight
// from the source CSV (see lib/flagging.js). Cytokine panel metrics (IL-6)
// have no established clinical reference range -- multiplex immunoassay
// panels like this are research-use, not diagnostic-grade -- so those
// metrics are flagged purely by deviation from the subject's own baseline.

export const METRICS = [
  {
    id: "wbc",
    name: "White Blood Cell Count",
    shortName: "WBC",
    unit: "x10\u00b3/\u00b5L",
    category: "Immune",
    hasClinicalRange: true,
    description:
      "Total immune cell count. Spaceflight is associated with immune system changes.",
    source: "Quest Diagnostics CBC panel, via NASA OSDR OSD-569",
  },
  {
    id: "abs_lymphocytes",
    name: "Absolute Lymphocytes",
    shortName: "Lymphocytes",
    unit: "cells/\u00b5L",
    category: "Immune",
    hasClinicalRange: true,
    description:
      "Count of lymphocytes, a white blood cell subtype. Documented to shift during and after spaceflight.",
    source: "Quest Diagnostics CBC panel, via NASA OSDR OSD-569",
  },
  {
    id: "hemoglobin",
    name: "Hemoglobin",
    shortName: "Hemoglobin",
    unit: "g/dL",
    category: "Hematology",
    hasClinicalRange: true,
    description:
      "Oxygen-carrying protein in red blood cells. Fluid shifts in microgravity can affect red cell mass and plasma volume. Note: the source CSV column is labeled '_percent' but reports g/dL values consistent with standard hemoglobin measurement -- likely a labeling artifact in NASA's transformed file, not a unit change; we display it as g/dL accordingly.",
    source: "Quest Diagnostics CBC panel, via NASA OSDR OSD-569",
  },
  {
    id: "platelets",
    name: "Platelet Count",
    shortName: "Platelets",
    unit: "x10\u00b3/\u00b5L",
    category: "Hematology",
    hasClinicalRange: true,
    description: "Blood cells responsible for clotting.",
    source: "Quest Diagnostics CBC panel, via NASA OSDR OSD-569",
  },
  {
    id: "glucose",
    name: "Glucose",
    shortName: "Glucose",
    unit: "mg/dL",
    category: "Metabolic",
    hasClinicalRange: true,
    description: "Blood sugar level, part of standard metabolic monitoring.",
    source: "Quest Diagnostics CMP panel, via NASA OSDR OSD-575",
  },
  {
    id: "sodium",
    name: "Sodium",
    shortName: "Sodium",
    unit: "mmol/L",
    category: "Metabolic",
    hasClinicalRange: true,
    description:
      "Key electrolyte; fluid shifts during spaceflight can affect electrolyte balance.",
    source: "Quest Diagnostics CMP panel, via NASA OSDR OSD-575",
  },
  {
    id: "il6",
    name: "Interleukin-6 (IL-6)",
    shortName: "IL-6",
    unit: "pg/mL",
    category: "Inflammation",
    hasClinicalRange: false,
    description:
      "Cytokine commonly used as a research marker of inflammation and physiological stress. Research-use multiplex assay -- no established clinical reference range, so this metric is flagged only by deviation from the subject's own baseline.",
    source: "Eve Technologies HD71 multiplex panel, via NASA OSDR OSD-575",
  },
];

export const METRIC_MAP = Object.fromEntries(METRICS.map((m) => [m.id, m]));

