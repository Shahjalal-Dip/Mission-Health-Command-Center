import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import { MISSION } from "../data/mission";
import { REAL_READINGS } from "../data/readings.real";
import { METRICS } from "../data/metrics";

const subjectCount = new Set(REAL_READINGS.map((r) => r.crewId)).size;
const timepointCount = new Set(REAL_READINGS.map((r) => r.timepointId)).size;

const STATS = [
  { value: REAL_READINGS.length, label: "Real biomarker readings" },
  { value: subjectCount, label: "Inspiration4 subjects" },
  { value: timepointCount, label: "Mission timepoints" },
  { value: METRICS.length, label: "Tracked biomarkers" },
];

export default function Briefing() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <svg width="44" height="44" viewBox="0 0 26 26" fill="none" className="mx-auto mb-5">
            <path d="M13 1 L24 7 V19 L13 25 L2 19 V7 Z" stroke="var(--color-accent)" strokeWidth="1" />
            <circle cx="13" cy="13" r="4.5" stroke="var(--color-accent)" strokeWidth="1" />
            <circle cx="13" cy="13" r="1.3" fill="var(--color-accent)" />
          </svg>
          <div className="text-[11px] tracking-[0.2em] text-accent uppercase font-display mb-3">
            NASA Space Apps 2026 &middot; Health Monitoring Software for Astronauts
          </div>
          <h1 className="text-[34px] leading-tight font-display font-semibold text-ink mb-3">
            Mission Health<br />Command Center
          </h1>
          <p className="text-sm text-muted max-w-lg mx-auto leading-relaxed">
            Long-duration spaceflight puts real, documented strain on the human body &mdash;
            immune shifts, cardiovascular deconditioning, and slow post-flight recovery. Flight
            surgeons need a way to see deviation from a crew member&apos;s own baseline at a
            glance, explained in plain language, not buried in a spreadsheet.
          </p>
        </div>

        <div className="bracket bg-panel border border-line p-5 mb-6">
          <div className="text-[10px] tracking-widest text-faint uppercase font-display mb-3">
            Built on real data, not simulation
          </div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-display font-semibold text-accent tabular">{s.value}</div>
                <div className="text-[11px] text-faint leading-tight mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Every reading is parsed directly from NASA&apos;s Open Science Data Repository
            &mdash; the {MISSION.name} mission&apos;s real Complete Blood Count, Comprehensive
            Metabolic Panel, and cytokine data. No fabricated values, no synthetic demo data.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="clip-tag inline-flex items-center gap-2 bg-accent text-navy font-display font-semibold text-sm px-5 py-2.5 hover:bg-accent/90 transition-colors"
          >
            Enter Command Center <ArrowRight size={16} />
          </Link>
          <a
            href={MISSION.dataSourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-faint hover:text-accent inline-flex items-center gap-1.5 transition-colors"
          >
            NASA OSDR source <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
