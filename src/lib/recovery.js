import { TIMEPOINTS } from "../data/mission";
import { computeBaselines } from "./flagging";

// For each (crew, metric), finds the first post-flight timepoint at which the
// reading returns to within RECOVERY_THRESHOLD of that subject's own
// pre-flight baseline, and stays there (checked against all later timepoints
// too, so a single noisy dip doesn't count as "recovered").
//
// This is pure analysis of the real, already-collected R+1/R+45/R+82/R+194
// timepoints -- there is no extrapolation beyond what NASA actually measured.
// If a subject never returns within threshold by R+194 (the last timepoint
// OSDR has), we report that honestly as "not recovered within observed
// window" rather than guessing when it might happen.

const RECOVERY_THRESHOLD = 0.2; // 20%, matches the "watch" threshold

const POST_FLIGHT = TIMEPOINTS.filter((t) => t.phase === "post-flight").sort(
  (a, b) => a.daysPostReturn - b.daysPostReturn
);

export function computeRecovery(rawReadings) {
  const baselines = computeBaselines(rawReadings);
  const byKey = {}; // `${crewId}|${metricId}` -> { [timepointId]: value }
  rawReadings.forEach((r) => {
    const key = `${r.crewId}|${r.metricId}`;
    byKey[key] ??= {};
    byKey[key][r.timepointId] = r.value;
  });

  const results = []; // { crewId, metricId, daysToRecover: number|null, recovered: bool }

  Object.keys(byKey).forEach((key) => {
    const [crewId, metricId] = key.split("|");
    const baseline = baselines[crewId]?.[metricId];
    if (baseline == null || baseline === 0) return;

    const series = POST_FLIGHT.map((tp) => ({
      tp,
      value: byKey[key][tp.id],
    })).filter((d) => d.value != null);

    let recoveredAt = null;
    for (let i = 0; i < series.length; i++) {
      const withinThreshold = Math.abs((series[i].value - baseline) / baseline) <= RECOVERY_THRESHOLD;
      const staysWithin = series.slice(i).every(
        (d) => Math.abs((d.value - baseline) / baseline) <= RECOVERY_THRESHOLD
      );
      if (withinThreshold && staysWithin) {
        recoveredAt = series[i].tp.daysPostReturn;
        break;
      }
    }

    results.push({
      crewId,
      metricId,
      daysToRecover: recoveredAt,
      recovered: recoveredAt != null,
      lastObservedDay: series.length ? series[series.length - 1].tp.daysPostReturn : null,
    });
  });

  return results;
}

// Aggregates per-metric across all subjects: median days-to-recover among
// those who did recover within the observed window, plus a count of subjects
// who had not recovered by the last available timepoint (R+194).
export function summarizeRecoveryByMetric(recoveryResults) {
  const byMetric = {};
  recoveryResults.forEach((r) => {
    byMetric[r.metricId] ??= [];
    byMetric[r.metricId].push(r);
  });

  return Object.entries(byMetric).map(([metricId, rows]) => {
    const recoveredDays = rows.filter((r) => r.recovered).map((r) => r.daysToRecover).sort((a, b) => a - b);
    const median = recoveredDays.length
      ? recoveredDays[Math.floor((recoveredDays.length - 1) / 2)]
      : null;
    return {
      metricId,
      subjectsTotal: rows.length,
      subjectsRecovered: recoveredDays.length,
      subjectsNotRecovered: rows.length - recoveredDays.length,
      medianDaysToRecover: median,
      rows,
    };
  });
}
