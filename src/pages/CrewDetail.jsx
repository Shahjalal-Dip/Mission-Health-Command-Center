import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Eye } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { CREW, TIMEPOINTS } from "../data/mission";
import { METRICS } from "../data/metrics";
import { REAL_READINGS } from "../data/readings.real";
import { buildFlaggedReadings } from "../lib/flagging";

const flagged = buildFlaggedReadings(REAL_READINGS);

const SEVERITY_DOT = {
  normal: "bg-status-normal",
  watch: "bg-status-watch",
  flagged: "bg-status-flagged",
};

export default function CrewDetail() {
  const { crewId } = useParams();
  const member = CREW.find((c) => c.id === crewId);
  const [activeMetricId, setActiveMetricId] = useState(METRICS[0].id);
  const activeMetric = METRICS.find((m) => m.id === activeMetricId);

  if (!member) return <div className="p-8 text-muted">Crew member not found.</div>;

  const metricRows = flagged.filter((r) => r.crewId === crewId && r.metricId === activeMetricId);
  const chartData = TIMEPOINTS.map((tp) => {
    const row = metricRows.find((r) => r.timepointId === tp.id);
    return { timepoint: tp.label, phase: tp.phase, value: row?.value ?? null, row };
  });
  const sampleRow = metricRows[0];
  const hasRange = activeMetric.hasClinicalRange && sampleRow;

  const flaggedForCrew = flagged.filter((r) => r.crewId === crewId && r.severity !== "normal");

  return (
    <div className="px-8 py-7 max-w-5xl">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink mb-5">
        <ArrowLeft size={14} /> Crew Overview
      </Link>

      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{member.name}</h1>
          <div className="text-sm text-muted">{member.role}</div>
        </div>
      </div>

      {/* Metric selector */}
      <div className="flex gap-1 border-b border-line mb-5">
        {METRICS.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveMetricId(m.id)}
            className={`px-3.5 py-2.5 text-sm border-b-2 -mb-px transition-colors ${
              m.id === activeMetricId
                ? "border-accent text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {m.shortName}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Chart */}
        <div className="col-span-2 bg-panel border border-line p-5">
          <div className="flex items-baseline justify-between mb-1">
            <div className="text-sm font-medium text-ink">{activeMetric.name}</div>
            <div className="text-xs text-faint">{activeMetric.unit}</div>
          </div>
          <div className="text-xs text-muted mb-4 leading-relaxed">{activeMetric.description}</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid stroke="#2A3348" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="timepoint" tick={{ fill: "#8891A6", fontSize: 12 }} axisLine={{ stroke: "#2A3348" }} tickLine={false} />
              <YAxis tick={{ fill: "#8891A6", fontSize: 12 }} axisLine={{ stroke: "#2A3348" }} tickLine={false} width={40} />
              {hasRange && <ReferenceLine y={sampleRow.rangeMin} stroke="#5A6379" strokeDasharray="2 4" />}
              {hasRange && <ReferenceLine y={sampleRow.rangeMax} stroke="#5A6379" strokeDasharray="2 4" />}
              <Tooltip
                contentStyle={{ background: "#1B2338", border: "1px solid #2A3348", borderRadius: 0, fontSize: 12 }}
                labelStyle={{ color: "#E7EAF0" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#E8A33D"
                strokeWidth={2}
                dot={{ r: 4, fill: "#0E1420", stroke: "#E8A33D", strokeWidth: 2 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-xs text-faint mt-1">
            {hasRange
              ? `Dashed lines mark the Quest Diagnostics reference range for this draw (${sampleRow.rangeMin}\u2013${sampleRow.rangeMax} ${activeMetric.unit}).`
              : "No established clinical reference range for this research-use marker \u2014 assessed by deviation from baseline only."}
          </div>
        </div>

        {/* Timepoint readout + flags */}
        <div className="bg-panel border border-line p-5">
          <div className="text-sm font-medium text-ink mb-3">Readings by timepoint</div>
          <div className="space-y-2">
            {chartData.map((d) => (
              <div key={d.timepoint} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${SEVERITY_DOT[d.row?.severity ?? "normal"]}`} />
                  <span className="text-muted tabular text-xs">{d.timepoint}</span>
                  {d.row?.dataNote && (
                    <span title={d.row.dataNote} className="text-status-watch text-xs cursor-help">&#9888;</span>
                  )}
                </div>
                <span className="tabular text-ink">{d.value ?? "\u2014"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flag explanations */}
      <div className="mt-6">
        <div className="text-sm font-medium text-ink mb-3">
          Flags for {member.name} ({flaggedForCrew.length})
        </div>
        {flaggedForCrew.length === 0 ? (
          <div className="text-sm text-muted">No deviations flagged across tracked biomarkers.</div>
        ) : (
          <div className="space-y-2">
            {flaggedForCrew.map((r, i) => {
              const metric = METRICS.find((m) => m.id === r.metricId);
              const Icon = r.severity === "flagged" ? AlertTriangle : Eye;
              return (
                <div
                  key={i}
                  className={`flex gap-3 p-3 bg-panel border border-line border-l-[3px] ${
                    r.severity === "flagged" ? "border-l-status-flagged" : "border-l-status-watch"
                  }`}
                >
                  <Icon
                    size={16}
                    className={r.severity === "flagged" ? "text-status-flagged shrink-0 mt-0.5" : "text-status-watch shrink-0 mt-0.5"}
                  />
                  <div className="text-sm">
                    <span className="text-ink font-medium">{metric.shortName}</span>
                    <span className="text-faint tabular"> &middot; {r.timepointId}</span>
                    <div className="text-muted mt-0.5 leading-relaxed">{r.explanation}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
