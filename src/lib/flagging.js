import { METRIC_MAP } from "../data/metrics";
import { TIMEPOINTS } from "../data/mission";

// Flags a reading based on TWO signals, both explainable in plain language:
//  1. Deviation from this crew member's own pre-flight baseline (average of
//     their L-92/L-44/L-3 readings) — this is the primary, most scientifically
//     honest signal for a 3-day mission with only 4 subjects.
//  2. Whether the value falls outside the standard clinical reference range
//     — shown as secondary context, never as a diagnostic claim.
//
// Severity is deliberately simple (normal / watch / flagged) — a rule-based
// MVP should be conservative and transparent, not pretend to clinical certainty.

const PRE_FLIGHT_IDS = TIMEPOINTS.filter((t) => t.phase === "pre-flight").map((t) => t.id);

export function computeBaselines(readings) {
  // returns { [crewId]: { [metricId]: averagePreFlightValue } }
  const baselines = {};
  readings.forEach((r) => {
    if (!PRE_FLIGHT_IDS.includes(r.timepointId)) return;
    baselines[r.crewId] ??= {};
    baselines[r.crewId][r.metricId] ??= [];
    baselines[r.crewId][r.metricId].push(r.value);
  });
  Object.keys(baselines).forEach((crewId) => {
    Object.keys(baselines[crewId]).forEach((metricId) => {
      const vals = baselines[crewId][metricId];
      baselines[crewId][metricId] = vals.reduce((a, b) => a + b, 0) / vals.length;
    });
  });
  return baselines;
}

// Deviation thresholds, expressed as % change from own baseline.
const WATCH_THRESHOLD = 0.20; // 20%
const FLAG_THRESHOLD = 0.35; // 35%

export function flagReading(reading, baseline) {
  const metric = METRIC_MAP[reading.metricId];
  const [lo, hi] = metric.normalRange;
  const outsideClinicalRange = reading.value < lo || reading.value > hi;

  let deviationPct = null;
  let severity = "normal";
  let reasonParts = [];

  if (baseline != null && baseline !== 0) {
    deviationPct = (reading.value - baseline) / baseline;
    const absDev = Math.abs(deviationPct);
    if (absDev >= FLAG_THRESHOLD) {
      severity = "flagged";
      reasonParts.push(
        `${(absDev * 100).toFixed(0)}% ${deviationPct > 0 ? "above" : "below"} this crew member's pre-flight baseline (${baseline.toFixed(2)} ${metric.unit}).`
      );
    } else if (absDev >= WATCH_THRESHOLD) {
      severity = "watch";
      reasonParts.push(
        `${(absDev * 100).toFixed(0)}% ${deviationPct > 0 ? "above" : "below"} this crew member's pre-flight baseline.`
      );
    }
  }

  if (outsideClinicalRange) {
    reasonParts.push(
      `Also outside the standard clinical reference range (${lo}\u2013${hi} ${metric.unit}).`
    );
    if (severity === "normal") severity = "watch";
  }

  return {
    ...reading,
    baseline,
    deviationPct,
    outsideClinicalRange,
    severity, // "normal" | "watch" | "flagged"
    explanation: reasonParts.length
      ? reasonParts.join(" ")
      : "Within expected range of this crew member's own baseline.",
  };
}

export function buildFlaggedReadings(rawReadings) {
  const baselines = computeBaselines(rawReadings);
  return rawReadings.map((r) => flagReading(r, baselines[r.crewId]?.[r.metricId] ?? null));
}
