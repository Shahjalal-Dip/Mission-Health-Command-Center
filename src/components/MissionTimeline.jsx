import { TIMEPOINTS, MISSION } from "../data/mission";

// Non-linear day scale compressed for legibility (real days shown in labels,
// position is rank-based so early/late timepoints don't crush the middle).
export default function MissionTimeline({ highlightId }) {
  return (
    <div className="border border-line bg-panel px-4 py-3">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px] tracking-widest text-faint uppercase font-display">
          Mission Timeline &middot; {MISSION.name}
        </span>
        <span className="text-[10px] tracking-widest text-faint uppercase font-display">
          Launch {MISSION.launchDate}
        </span>
      </div>
      <div className="relative flex items-center">
        <div className="absolute left-0 right-0 h-px bg-line-bright" />
        {TIMEPOINTS.map((tp, i) => (
          <div key={tp.id} className="relative flex-1 flex flex-col items-center">
            <div
              className={`w-2 h-2 rotate-45 border ${
                tp.id === highlightId
                  ? "bg-accent border-accent"
                  : tp.phase === "pre-flight"
                  ? "bg-navy border-line-bright"
                  : "bg-navy border-status-normal/60"
              }`}
            />
            <span className={`mt-2 text-[10px] tabular ${tp.id === highlightId ? "text-accent" : "text-faint"}`}>
              {tp.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
