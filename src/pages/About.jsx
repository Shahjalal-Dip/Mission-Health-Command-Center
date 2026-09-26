import { MISSION, CREW_MISSION_CONTEXT } from "../data/mission";
import { REAL_READINGS } from "../data/readings.real";

const subjectCount = new Set(REAL_READINGS.map((r) => r.crewId)).size;
const timepointCount = new Set(REAL_READINGS.map((r) => r.timepointId)).size;
const metricCount = new Set(REAL_READINGS.map((r) => r.metricId)).size;

export default function About() {
  return (
    <div className="px-8 py-7 max-w-2xl">
      <h1 className="text-[26px] font-display font-semibold text-ink mb-5">About This Data</h1>

      <div className="space-y-5 text-sm text-muted leading-relaxed">
        <p>
          Mission Health Command Center is built on data from NASA&apos;s{" "}
          <a href={MISSION.dataSourceUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">
            Open Science Data Repository (OSDR)
          </a>
          , specifically the SpaceX Inspiration4 (I4) mission &mdash; the first orbital
          spaceflight crewed entirely by civilians. NASA&apos;s OSDR publicly hosts biological
          datasets from this mission, including the biomarker data shown throughout this app.
        </p>

        <div>
          <div className="text-ink font-display font-semibold mb-1.5">On subject anonymization</div>
          <p>
            NASA OSDR identifies subjects as C001&ndash;C004 in the actual data files,
            without publishing which code corresponds to which named crew member. This app
            keeps that anonymization rather than guessing &mdash; the four Inspiration4
            crew members were {CREW_MISSION_CONTEXT.join(", ")}, shown here only as mission
            context, not linked to individual data.
          </p>
        </div>

        <div>
          <div className="text-ink font-display font-semibold mb-1.5">Timepoints</div>
          <p>
            Readings are anchored to seven real mission-phase sample collection points: L-92,
            L-44, L-3 (pre-flight) and R+1, R+45, R+82, R+194 (post-flight), where L/R count
            days before Launch and after Return.
          </p>
        </div>

        <div>
          <div className="text-ink font-display font-semibold mb-1.5">How flags work</div>
          <p>
            Each reading is compared against that crew member&apos;s own average pre-flight
            value. A deviation of 20%+ is marked &ldquo;watch,&rdquo; 35%+ is marked
            &ldquo;flagged.&rdquo; Standard clinical reference ranges are shown as secondary
            context. This is a rule-based decision-support signal for a ground-based reviewer
            &mdash; it is not a diagnosis, and is not a substitute for clinical judgment.
          </p>
        </div>

        <div>
          <div className="text-ink font-display font-semibold mb-1.5">Source studies</div>
          <ul className="space-y-1">
            {MISSION.osdStudies.map((s) => (
              <li key={s.id} className="tabular text-xs">
                {s.id} &mdash; <span className="font-sans">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-ink font-display font-semibold mb-1.5">Metrics tracked</div>
          <p>
            White Blood Cell Count, Absolute Lymphocytes, Hemoglobin, and Platelet Count
            (Quest Diagnostics CBC, OSD-569); Glucose and Sodium (Quest Diagnostics
            Comprehensive Metabolic Panel, OSD-575); and Interleukin-6 (Eve Technologies HD71
            cytokine panel, OSD-575). All seven are real, published values &mdash; not
            simulated.
          </p>
        </div>

        <div className="border border-status-normal/40 bg-status-normal/10 p-4 text-status-normal text-sm">
          This app is currently showing <strong>{REAL_READINGS.length} real readings</strong> across{" "}
          {subjectCount} subjects, {timepointCount} timepoints, and {metricCount} biomarkers
          ({subjectCount} &times; {timepointCount} &times; {metricCount} = {subjectCount * timepointCount * metricCount}),
          parsed directly from the OSDR CSV exports linked above. No values are simulated or
          estimated. These counts are computed from the underlying dataset, not hardcoded, so
          they can&apos;t drift out of sync if the data changes.
        </div>

        <div>
          <div className="text-ink font-display font-semibold mb-1.5">Known limitation</div>
          <p>
            With only 4 subjects and a 3-day mission, this is a small sample for statistical
            purposes. Flags here are a rule-based decision-support signal to guide a ground
            reviewer&apos;s attention &mdash; not a validated clinical or statistical finding.
          </p>
        </div>
      </div>
    </div>
  );
}
