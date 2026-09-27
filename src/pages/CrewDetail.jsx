import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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

const CATEGORY_COLOR = {
  Immune: "text-accent-2 bg-accent-2/10 border-accent-2/30",
  Hematology: "text-accent-2 bg-accent-2/10 border-accent-2/30",
  Metabolic: "text-accent bg-accent/10 border-accent/30",
  Inflammation: "text-status-flagged bg-status-flagged/10 border-status-flagged/30",
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
    <div className="px-4 sm:px-6 md:px-8 py-5 md:py-7 max-w-5xl">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors mb-5">
        <ArrowLeft size={14} /> Crew Overview
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-baseline gap-3 mb-6"
      >
        <h1 className="text-[24px] md:text-[28px] font-display font-semibold text-ink tabular tracking-wide">{member.id}</h1>
        <span className="text-xs text-faint clip-tag bg-panel-raised border border-line px-2.5 py-1">{member.role}</span>
      </motion.div>

      {/* Metric selector - clipped-corner chips with a sliding active indicator */}
      <div className="flex flex-wrap gap-2 mb-5">
        {METRICS.map((m) => {
          const active = m.id === activeMetricId;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMetricId(m.id)}
              className={`relative clip-tag px-3.5 py-2 text-xs font-medium border transition-colors overflow-hidden ${
                active
                  ? "border-accent text-accent"
                  : "bg-panel border-line text-muted hover:text-ink hover:border-line-bright"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="metric-tab-bg"
                  className="absolute inset-0 bg-accent/15"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{m.shortName}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Chart */}
        <div className="bracket lg:col-span-2 bg-panel border border-line p-4 sm:p-5 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMetricId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-baseline justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-display font-semibold text-ink">{activeMetric.name}</div>
                  <span className={`clip-tag text-[10px] px-1.5 py-0.5 border ${CATEGORY_COLOR[activeMetric.category] ?? ""}`}>
                    {activeMetric.category}
                  </span>
                </div>
                <div className="text-xs text-faint tabular">{activeMetric.unit}</div>
              </div>
              <div className="text-xs text-muted mb-4 leading-relaxed">{activeMetric.description}</div>
              <ResponsiveContainer width="100%" height={220} className="sm:!h-[260px]">
                <LineChart data={chartData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                  <CartesianGrid stroke="#263153" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="timepoint" tick={{ fill: "#8b96b3", fontSize: 12, fontFamily: "IBM Plex Mono" }} axisLine={{ stroke: "#263153" }} tickLine={false} />
                  <YAxis tick={{ fill: "#8b96b3", fontSize: 12, fontFamily: "IBM Plex Mono" }} axisLine={{ stroke: "#263153" }} tickLine={false} width={40} />
                  {hasRange && <ReferenceLine y={sampleRow.rangeMin} stroke="#566089" strokeDasharray="2 4" />}
                  {hasRange && <ReferenceLine y={sampleRow.rangeMax} stroke="#566089" strokeDasharray="2 4" />}
                  <Tooltip
                    contentStyle={{ background: "#182036", border: "1px solid #3a4872", borderRadius: 0, fontSize: 12, fontFamily: "IBM Plex Mono" }}
                    labelStyle={{ color: "#eef1f7" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#e8a33d"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#0a0f1a", stroke: "#e8a33d", strokeWidth: 2 }}
                    activeDot={{ r: 5 }}
                    isAnimationActive={true}
                    animationDuration={700}
                    animationEasing="ease-out"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="text-xs text-faint mt-1">
                {hasRange
                  ? `Dashed lines mark the Quest Diagnostics reference range for this draw (${sampleRow.rangeMin}\u2013${sampleRow.rangeMax} ${activeMetric.unit}).`
                  : "No established clinical reference range for this research-use marker \u2014 assessed by deviation from baseline only."}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Timepoint readout + flags */}
        <div className="bracket bg-panel border border-line p-4 sm:p-5">
          <div className="text-[10px] tracking-widest text-faint uppercase font-display mb-3">Readings by Timepoint</div>
          <div className="space-y-2">
            <AnimatePresence mode="wait">
              <motion.div key={activeMetricId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-2">
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
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Flag explanations */}
      <div className="mt-6">
        <div className="text-[10px] tracking-widest text-faint uppercase font-display mb-3">
          Flags for {member.id} ({flaggedForCrew.length})
        </div>
        {flaggedForCrew.length === 0 ? (
          <div className="text-sm text-muted">No deviations flagged across tracked biomarkers.</div>
        ) : (
          <div className="space-y-2">
            {flaggedForCrew.map((r, i) => {
              const metric = METRICS.find((m) => m.id === r.metricId);
              const Icon = r.severity === "flagged" ? AlertTriangle : Eye;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
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
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
