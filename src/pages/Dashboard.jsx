import { Link } from "react-router-dom";
import { ChevronRight, AlertTriangle, Eye, CheckCircle2 } from "lucide-react";
import { CREW, MISSION } from "../data/mission";
import { PLACEHOLDER_READINGS } from "../data/readings.placeholder";
import { buildFlaggedReadings } from "../lib/flagging";
import { crewSummary, STATUS_LABEL } from "../lib/crewStatus";

const flagged = buildFlaggedReadings(PLACEHOLDER_READINGS);

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

export default function Dashboard() {
  return (
    <div className="px-8 py-7 max-w-5xl">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-wide text-faint mb-1.5">{MISSION.dataSource}</div>
        <h1 className="text-2xl font-semibold text-ink">{MISSION.name} &mdash; Crew Overview</h1>
        <p className="text-sm text-muted mt-1.5 max-w-2xl leading-relaxed">{MISSION.summary}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {CREW.map((member) => {
          const summary = crewSummary(member.id, flagged);
          const Icon = STATUS_ICON[summary.status];
          return (
            <Link
              key={member.id}
              to={`/crew/${member.id}`}
              className={`group flex items-center justify-between bg-panel border border-line border-l-[3px] pl-4 pr-3 py-4 hover:bg-panel-raised transition-colors ${BORDER_CLASS[summary.status]}`}
            >
              <div className="flex items-center gap-3.5">
                <Icon size={20} strokeWidth={2} className={ICON_CLASS[summary.status]} />
                <div>
                  <div className="text-sm font-medium text-ink">{member.name}</div>
                  <div className="text-xs text-muted">{member.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
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
                <ChevronRight size={16} className="text-faint group-hover:text-muted" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 text-xs text-faint leading-relaxed max-w-2xl">
        Status reflects deviation from each crew member&apos;s own pre-flight baseline across
        tracked biomarkers, with standard clinical reference ranges shown as secondary context.
        This is a decision-support signal, not a medical diagnosis.
      </div>
    </div>
  );
}
