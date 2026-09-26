import { Link } from "react-router-dom";
import { ChevronRight, AlertTriangle, Eye, CheckCircle2, Users, Database, ShieldAlert } from "lucide-react";
import { CREW, MISSION, TIMEPOINTS } from "../data/mission";
import { REAL_READINGS } from "../data/readings.real";
import { buildFlaggedReadings } from "../lib/flagging";
import { crewSummary, STATUS_LABEL } from "../lib/crewStatus";
import Sparkline from "../components/Sparkline";
import MissionTimeline from "../components/MissionTimeline";

const flagged = buildFlaggedReadings(REAL_READINGS);
const totalFlagged = flagged.filter((r) => r.severity === "flagged").length;
const totalWatch = flagged.filter((r) => r.severity === "watch").length;

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
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-status-normal animate-pulse" />
            <span className="text-[10px] tracking-widest text-accent uppercase font-display">
              {MISSION.dataSource}
            </span>
          </div>
          <h1 className="text-[26px] leading-tight font-display font-semibold text-ink">
            {MISSION.name}
          </h1>
          <p className="text-sm text-muted mt-1.5 max-w-xl leading-relaxed">{MISSION.summary}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] uppercase tracking-widest text-faint font-display mb-1">
            System Status
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-status-normal" />
            <span className="text-xs text-status-normal font-display tracking-wide">DATA ONLINE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-7">
        <div className="bracket bg-panel border border-line p-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <Users size={15} className="text-accent" />
            <span className="text-[9px] tracking-widest text-faint uppercase">Crew</span>
          </div>
          <div className="text-xl font-display font-semibold text-ink tabular">{CREW.length}</div>
        </div>
        <div className="bracket bg-panel border border-line p-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <Database size={15} className="text-accent" />
            <span className="text-[9px] tracking-widest text-faint uppercase">Readings</span>
          </div>
          <div className="text-xl font-display font-semibold text-ink tabular">{REAL_READINGS.length}</div>
        </div>
        <div className="bracket bg-panel border border-line p-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <Eye size={15} className="text-status-watch" />
            <span className="text-[9px] tracking-widest text-faint uppercase">Watch</span>
          </div>
          <div className="text-xl font-display font-semibold text-status-watch tabular">{totalWatch}</div>
        </div>
        <div className="bracket bg-panel border border-line p-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <ShieldAlert size={15} className="text-status-flagged" />
            <span className="text-[9px] tracking-widest text-faint uppercase">Flagged</span>
          </div>
          <div className="text-xl font-display font-semibold text-status-flagged tabular">{totalFlagged}</div>
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
