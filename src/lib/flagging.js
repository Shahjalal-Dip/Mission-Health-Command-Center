import { METRIC_MAP } from "../data/metrics";
import { TIMEPOINTS } from "../data/mission";
import { getDataNote, isExcludedFromBaseline } from "../data/dataNotes";

// Flags a reading based on TWO signals, both explainable in plain language:
//  1. Deviation from this crew member's own pre-flight baseline (average of
//     their L-92/L-44/L-3 readings) — the primary, most scientifically
//     honest signal for a 3-day mission with only 4 subjects.
//  2. Whether the value falls outside the REAL per-sample clinical reference
//     range reported by Quest Diagnostics for that specific draw (rangeMin/
//     rangeMax on the reading itself — these are the actual lab's ranges,
//     not a guessed constant, and were confirmed to vary by subject).
//     Metrics with no established clinical range (e.g. research-use cytokine
//     panels) skip this signal entirely rather than fabricate one.
//
// Severity is deliberately simple (normal / watch / flagged) — a rule-based
// MVP should be conservative and transparent, not pretend to clinical certainty.

const PRE_FLIGHT_IDS = TIMEPOINTS.filter((t) => t.phase === "pre-flight").map((t) => t.id);

export function computeBaselines(readings) {
  const baselines = {};
  readings.forEach((r) => {
    if (!PRE_FLIGHT_IDS.includes(r.timepointId)) return;
    if (isExcludedFromBaseline(r.crewId, r.metricId, r.timepointId)) return;
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

const WATCH_THRESHOLD = 0.2; // 20%
const FLAG_THRESHOLD = 0.35; // 35%

export function flagReading(reading, baseline) {
  const metric = METRIC_MAP[reading.metricId];
  const hasRange = metric.hasClinicalRange && reading.rangeMin != null && reading.rangeMax != null;
  const outsideClinicalRange = hasRange && (reading.value < reading.rangeMin || reading.value > reading.rangeMax);

  let deviationPct = null;
  let severity = "normal";
  let reasonParts = [];

  if (baseline != null && baseline !== 0) {
    deviationPct = (reading.value - baseline) / baseline;
    const absDev = Math.abs(deviationPct);
    if (absDev >= FLAG_THRESHOLD) {
      severity = "flagged";
      reasonParts.push(
        `${(absDev * 100).toFixed(0)}% ${deviationPct > 0 ? "above" : "below"} this subject's pre-flight baseline (${baseline.toFixed(2)} ${metric.unit}).`
      );
    } else if (absDev >= WATCH_THRESHOLD) {
      severity = "watch";
      reasonParts.push(
        `${(absDev * 100).toFixed(0)}% ${deviationPct > 0 ? "above" : "below"} this subject's pre-flight baseline.`
      );
    }
  }

  if (outsideClinicalRange) {
    reasonParts.push(
      `Also outside the lab-reported reference range for this draw (${reading.rangeMin}\u2013${reading.rangeMax} ${metric.unit}).`
    );
    if (severity === "normal") severity = "watch";
  }

  if (!metric.hasClinicalRange && reasonParts.length === 0) {
    reasonParts.push("No established clinical reference range for this research-use marker; assessed against baseline only.");
  }

  const dataNote = getDataNote(reading.crewId, reading.metricId, reading.timepointId);
  if (dataNote) {
    reasonParts.push(dataNote);
    if (severity === "normal") severity = "watch";
  }

  return {
    ...reading,
    baseline,
    deviationPct,
    outsideClinicalRange,
    severity,
    dataNote,
    explanation: reasonParts.length
      ? reasonParts.join(" ")
      : "Within expected range of this subject's own baseline.",
  };
}

export function buildFlaggedReadings(rawReadings) {
  const baselines = computeBaselines(rawReadings);
  return rawReadings.map((r) => flagReading(r, baselines[r.crewId]?.[r.metricId] ?? null));
}
