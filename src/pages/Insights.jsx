import { ExternalLink, TrendingUp, BookOpen } from "lucide-react";
import { METRICS, METRIC_MAP } from "../data/metrics";
import { CREW } from "../data/mission";
import { REAL_READINGS } from "../data/readings.real";
import { computeRecovery, summarizeRecoveryByMetric } from "../lib/recovery";
import { MISSION_DURATION_CONTEXT, CONTEXT_DISCLAIMER } from "../data/missionContext";

const recovery = computeRecovery(REAL_READINGS);
const summary = summarizeRecoveryByMetric(recovery);

const MAX_DAY = 194;

function RecoveryBar({ row }) {
  const metric = METRIC_MAP[row.metricId];
  return (
    <div className="mb-5">
      <div className="flex items-baseline justify-between mb-1.5">
        <div className="text-sm text-ink font-medium">{metric.name}</div>
        <div className="text-xs text-faint tabular">
          {row.medianDaysToRecover != null
            ? `median ${row.medianDaysToRecover}d to recover`
            : "no subject fully recovered by R+194"}
        </div>
      </div>
      <div className="space-y-1.5">
        {row.rows.map((r) => {
          const pct = r.recovered ? Math.min(100, (r.daysToRecover / MAX_DAY) * 100) : 100;
          return (
            <div key={r.crewId} className="flex items-center gap-2">
              <span className="text-xs text-faint tabular w-10 shrink-0">{r.crewId}</span>
              <div className="flex-1 h-2 bg-panel-raised relative">
                <div
                  className={`h-full ${r.recovered ? "bg-status-normal" : "bg-status-flagged/60"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-muted tabular w-24 shrink-0 text-right">
                {r.recovered ? `${r.daysToRecover}d` : "not by 194d"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Insights() {
  return (
    <div className="px-8 py-7 max-w-4xl">
      <h1 className="text-[26px] font-display font-semibold text-ink mb-1.5">Insights</h1>
      <p className="text-sm text-muted mb-8 max-w-2xl leading-relaxed">
        Two views: how the real Inspiration4 crew biomarkers actually recovered post-flight, and
        published NASA research on how spaceflight risk scales for longer missions.
      </p>

      {/* SECTION 1: Recovery Trajectory - data-driven */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={16} className="text-status-normal" />
          <h2 className="text-base font-display font-semibold text-ink">Recovery Trajectory</h2>
          <span className="text-xs text-status-normal bg-status-normal/10 px-1.5 py-0.5">real data</span>
        </div>
        <p className="text-xs text-muted mb-5 max-w-2xl leading-relaxed">
          For each biomarker, how many days after landing each subject's reading returned to
          within 20% of their own pre-flight baseline &mdash; and stayed there. Computed directly
          from the 4 real subjects across the observed R+1 to R+194 window. No projection beyond
          what was actually measured.
        </p>
        <div className="bracket bg-panel border border-line p-5">
          {summary.map((row) => (
            <RecoveryBar key={row.metricId} row={row} />
          ))}
        </div>
        <p className="text-xs text-faint mt-3 max-w-2xl leading-relaxed">
          Note the pattern: metabolic markers (Glucose, Sodium) normalized quickly and
          consistently across all subjects, while immune markers (Lymphocytes, IL-6) recovered
          more slowly and inconsistently &mdash; consistent with published spaceflight immunology
          findings about longer-lasting immune system changes post-flight.
        </p>
      </section>

      {/* SECTION 2: Mission Duration Context - literature, clearly separated */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={16} className="text-accent" />
          <h2 className="text-base font-display font-semibold text-ink">Mission-Duration Risk Context</h2>
          <span className="text-xs text-accent bg-accent/10 px-1.5 py-0.5">published research</span>
        </div>
        <p className="text-xs text-muted mb-5 max-w-2xl leading-relaxed">{CONTEXT_DISCLAIMER}</p>
        <div className="grid grid-cols-2 gap-3">
          {MISSION_DURATION_CONTEXT.map((c) => (
            <div key={c.id} className="bracket bg-panel border border-line p-4">
              <div className="text-sm font-medium text-ink mb-0.5">{c.title}</div>
              <div className="text-lg font-semibold text-accent mb-2 tabular">{c.stat}</div>
              <p className="text-xs text-muted leading-relaxed mb-3">{c.body}</p>
              <a
                href={c.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-faint hover:text-accent inline-flex items-center gap-1"
              >
                <ExternalLink size={11} /> {c.source}
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
