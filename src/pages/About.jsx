import { MISSION } from "../data/mission";
import { IS_PLACEHOLDER } from "../data/readings.placeholder";

export default function About() {
  return (
    <div className="px-8 py-7 max-w-2xl">
      <h1 className="text-2xl font-semibold text-ink mb-5">About This Data</h1>

      <div className="space-y-5 text-sm text-muted leading-relaxed">
        <p>
          Mission Health Command Center is built on data from NASA&apos;s{" "}
          <a href={MISSION.dataSourceUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">
            Open Science Data Repository (OSDR)
          </a>
          , specifically the SpaceX Inspiration4 (I4) mission &mdash; the first orbital
          spaceflight crewed entirely by civilians, and the first mission with publicly
          released human biological data from a commercial spaceflight.
        </p>

        <div>
          <div className="text-ink font-medium mb-1.5">Timepoints</div>
          <p>
            Readings are anchored to six real mission-phase sample collection points: L-92,
            L-44, L-3 (pre-flight) and R+1, R+45, R+82 (post-flight), where L/R count days
            before Launch and after Return.
          </p>
        </div>

        <div>
          <div className="text-ink font-medium mb-1.5">How flags work</div>
          <p>
            Each reading is compared against that crew member&apos;s own average pre-flight
            value. A deviation of 20%+ is marked &ldquo;watch,&rdquo; 35%+ is marked
            &ldquo;flagged.&rdquo; Standard clinical reference ranges are shown as secondary
            context. This is a rule-based decision-support signal for a ground-based reviewer
            &mdash; it is not a diagnosis, and is not a substitute for clinical judgment.
          </p>
        </div>

        <div>
          <div className="text-ink font-medium mb-1.5">Source studies</div>
          <ul className="space-y-1">
            {MISSION.osdStudies.map((s) => (
              <li key={s.id} className="tabular text-xs">
                {s.id} &mdash; <span className="font-sans">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {IS_PLACEHOLDER && (
          <div className="border border-status-watch/40 bg-status-watch/10 p-4 text-status-watch text-sm">
            The app is currently showing <strong>synthetic placeholder values</strong>, not real
            astronaut biomarker readings. Real values from the OSDR studies above have not yet
            been loaded. This banner and the top-of-app notice will disappear once real data
            replaces the placeholder file.
          </div>
        )}
      </div>
    </div>
  );
}
