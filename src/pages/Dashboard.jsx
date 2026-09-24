import { Link } from "react-router-dom";
import { ChevronRight, AlertTriangle, Eye, CheckCircle2 } from "lucide-react";
import { CREW, MISSION, TIMEPOINTS } from "../data/mission";
import { REAL_READINGS } from "../data/readings.real";
import { buildFlaggedReadings } from "../lib/flagging";
import { crewSummary, STATUS_LABEL } from "../lib/crewStatus";
import Sparkline from "../components/Sparkline";
import MissionTimeline from "../components/MissionTimeline";

const flagged = buildFlaggedReadings(REAL_READINGS);

const STATUS_ICON = { normal: CheckCircle2, watch: Eye, flagged: AlertTriangle };
const BORDER_CLASS = {
  normal: "border-l-status-normal",
  watch: "border-l-status-watch",
  flagged: "border-l-status-flagged",
};
const ICON_CLASS = {
  normal: "text-status-normal",
  watch: "text-status-watch",
  flagged: "text-status-flagged",
};
const SPARK_COLOR = {
  normal: "var(--color-status-normal)",
  watch: "var(--color-status-watch)",
  flagged: "var(--color-status-flagged)",
};

function crewSparkline(crewId) {
  return TIMEPOINTS.map(
    (tp) => flagged.find((r) => r.crewId === crewId && r.metricId === "wbc" && r.timepointId === tp.id)?.value ?? null
  );
}

export default function Dashboard() {
  return (
    <div className="px-8 py-7 max-w-5xl">
      <div className="mb-6 flex items-start justify-between gap-8">
        <div>
          <div className="text-[10px] tracking-widest text-accent uppercase font-display mb-1.5">
            {MISSION.dataSource}
          </div>
          <h1 className="text-[26px] leading-tight font-display font-semibold text-ink">
            {MISSION.name}
          </h1>
          <p className="text-sm text-muted mt-1.5 max-w-xl leading-relaxed">{MISSION.summary}</p>
        </div>
      </div>

      <div className="mb-7">
        <MissionTimeline />
      </div>

      <div className="text-[10px] tracking-widest text-faint uppercase font-display mb-3">
        Crew Roster &middot; {CREW.length} Subjects
      </div>

      <div className="grid grid-cols-2 gap-3">
        {CREW.map((member) => {
          const summary = crewSummary(member.id, flagged);
          const Icon = STATUS_ICON[summary.status];
          return (
            <Link
              key={member.id}
              to={`/crew/${member.id}`}
              className={`bracket group flex items-center justify-between bg-panel border border-line border-l-[3px] pl-4 pr-4 py-4 hover:bg-panel-raised hover:border-line-bright transition-colors ${BORDER_CLASS[summary.status]}`}
            >
              <div className="flex items-center gap-3.5">
                <Icon size={18} strokeWidth={2} className={ICON_CLASS[summary.status]} />
                <div>
                  <div className="text-sm font-display font-semibold text-ink tabular tracking-wide">
                    {member.id}
                  </div>
                  <div className="text-xs text-faint">{member.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <Sparkline values={crewSparkline(member.id)} color={SPARK_COLOR[summary.status]} />
                <div className="text-right min-w-[80px]">
                  <div className="text-xs tabular text-faint">
                    {summary.flaggedCount > 0 && (
                      <span className="text-status-flagged">{summary.flaggedCount} flagged</span>
                    )}
                    {summary.flaggedCount > 0 && summary.watchCount > 0 && " \u00b7 "}
                    {summary.watchCount > 0 && (
                      <span className="text-status-watch">{summary.watchCount} watch</span>
                    )}
                    {summary.flaggedCount === 0 && summary.watchCount === 0 && (
                      <span>{STATUS_LABEL[summary.status]}</span>
                    )}
                  </div>
                </div>
                <ChevronRight size={16} className="text-faint group-hover:text-accent transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 text-xs text-faint leading-relaxed max-w-2xl">
        Status reflects deviation from each crew member&apos;s own pre-flight baseline across
        tracked biomarkers, with lab-reported clinical reference ranges shown as secondary
        context. This is a decision-support signal, not a medical diagnosis. WBC trend shown
        above per subject.
      </div>
    </div>
  );
}
