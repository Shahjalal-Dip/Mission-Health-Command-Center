// Metric definitions used by the flagging engine.
//
// IMPORTANT: `normalRange` values here are standard adult clinical reference
// ranges (the kind printed on any hospital lab report), used as the baseline
// band against which we compare a crew member's own readings. They are NOT
// spaceflight-specific thresholds — NASA has not published a single universal
// "safe range" for spaceflight, so our flagging engine (see lib/flagging.js)
// primarily flags DEVIATION FROM EACH CREW MEMBER'S OWN PRE-FLIGHT BASELINE,
// using the clinical range only as secondary context. This distinction is
// shown in the UI so we never imply a diagnostic claim.

export const METRICS = [
  {
    id: "wbc",
    name: "White Blood Cell Count",
    shortName: "WBC",
    unit: "x10\u2079/L",
    category: "Immune",
    normalRange: [4.5, 11.0],
    description:
      "Immune cell count. Spaceflight is associated with immune system changes, including shifts in white blood cell populations.",
    source: "Standard adult clinical reference range",
  },
  {
    id: "crp",
    name: "C-Reactive Protein",
    shortName: "CRP",
    unit: "mg/L",
    category: "Inflammation",
    normalRange: [0, 3.0],
    description:
      "General inflammation marker. Useful as a broad signal of physiological stress or immune activation.",
    source: "Standard adult clinical reference range",
  },
  {
    id: "cortisol",
    name: "Cortisol",
    shortName: "Cortisol",
    unit: "\u00b5g/dL",
    category: "Stress / Endocrine",
    normalRange: [6, 23],
    description:
      "Stress hormone. Often used as a proxy for physiological and psychological stress load.",
    source: "Standard adult AM clinical reference range",
  },
  {
    id: "lymphocyte_pct",
    name: "Lymphocyte Percentage",
    shortName: "Lymphocytes",
    unit: "%",
    category: "Immune",
    normalRange: [20, 40],
    description:
      "Proportion of white blood cells that are lymphocytes. Documented to shift during and after spaceflight.",
    source: "Standard adult clinical reference range",
  },
];

export const METRIC_MAP = Object.fromEntries(METRICS.map((m) => [m.id, m]));
