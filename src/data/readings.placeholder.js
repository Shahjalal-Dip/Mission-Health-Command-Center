// ============================================================================
// PLACEHOLDER DATA — NOT REAL ASTRONAUT VALUES
// ============================================================================
// This file exists ONLY so the UI can be built and demoed before the real
// OSDR data files are downloaded and cleaned. Every value below is synthetic.
// The shape (crewId, metricId, timepointId, value) is exactly what the real
// ETL output must match — once real data is ready, this file is replaced by
// `readings.json` (see /scripts/etl.md for instructions) and this file
// should be deleted so it can never accidentally ship in a build.
//
// isPlaceholder: true is checked by the UI to render a visible "SAMPLE DATA"
// banner across the app so this is never mistaken for real results.
// ============================================================================

export const IS_PLACEHOLDER = true;

const crewIds = ["isaacman", "proctor", "arceneaux", "sembroski"];
const timepointIds = ["L-92", "L-44", "L-3", "R+1", "R+45", "R+82"];

// simple deterministic pseudo-random so the demo looks the same every run
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generate(metricId, baseline, spikeAtReturn, spikeAmount) {
  const rows = [];
  crewIds.forEach((crewId, ci) => {
    timepointIds.forEach((tp, ti) => {
      const seed = ci * 100 + ti * 7 + metricId.length;
      const noise = (seededRandom(seed) - 0.5) * baseline * 0.12;
      let value = baseline + noise;
      if (spikeAtReturn && (tp === "R+1" || tp === "R+45")) {
        value += spikeAmount * (tp === "R+1" ? 1 : 0.4) * (0.7 + seededRandom(seed + 1) * 0.6);
      }
      rows.push({
        crewId,
        metricId,
        timepointId: tp,
        value: Math.round(value * 100) / 100,
      });
    });
  });
  return rows;
}

export const PLACEHOLDER_READINGS = [
  ...generate("wbc", 6.5, true, 2.1),
  ...generate("crp", 1.2, true, 2.4),
  ...generate("cortisol", 13, true, 5.5),
  ...generate("lymphocyte_pct", 30, true, -6),
];
