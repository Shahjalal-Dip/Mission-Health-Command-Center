import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { MISSION } from "../data/mission";
import { REAL_READINGS } from "../data/readings.real";
import { METRICS } from "../data/metrics";
import CountUp from "../components/CountUp";

const subjectCount = new Set(REAL_READINGS.map((r) => r.crewId)).size;
const timepointCount = new Set(REAL_READINGS.map((r) => r.timepointId)).size;

const STATS = [
  { value: REAL_READINGS.length, label: "Real biomarker readings" },
  { value: subjectCount, label: "Inspiration4 subjects" },
  { value: timepointCount, label: "Mission timepoints" },
  { value: METRICS.length, label: "Tracked biomarkers" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export default function Briefing() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-10 sm:py-12 relative overflow-hidden">
      {/* Ambient glow behind hero */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(232,163,61,0.10) 0%, rgba(232,163,61,0) 70%)",
        }}
      />

      <motion.div
        className="max-w-2xl w-full relative"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
      >
        <div className="text-center mb-10">
          <motion.div
            className="mx-auto mb-5 relative w-[44px] h-[44px]"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* pulsing ring */}
            <motion.div
              className="absolute inset-[-14px] rounded-full border border-accent/30"
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.svg
              width="44" height="44" viewBox="0 0 26 26" fill="none"
              initial={{ rotate: -25, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="relative"
            >
              <path d="M13 1 L24 7 V19 L13 25 L2 19 V7 Z" stroke="var(--color-accent)" strokeWidth="1" />
              <circle cx="13" cy="13" r="4.5" stroke="var(--color-accent)" strokeWidth="1" />
              <circle cx="13" cy="13" r="1.3" fill="var(--color-accent)" />
            </motion.svg>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-[11px] tracking-[0.2em] text-accent uppercase font-display mb-3"
          >
            NASA Space Apps 2026 &middot; Health Monitoring Software for Astronauts
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-[26px] sm:text-[34px] leading-tight font-display font-semibold text-ink mb-3"
          >
            Mission Health<br />Command Center
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm text-muted max-w-lg mx-auto leading-relaxed"
          >
            Long-duration spaceflight puts real, documented strain on the human body &mdash;
            immune shifts, cardiovascular deconditioning, and slow post-flight recovery. Flight
            surgeons need a way to see deviation from a crew member&apos;s own baseline at a
            glance, explained in plain language, not buried in a spreadsheet.
          </motion.p>
        </div>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bracket bg-panel/90 backdrop-blur-sm border border-line p-4 sm:p-5 mb-6"
        >
          <div className="text-[10px] tracking-widest text-faint uppercase font-display mb-3">
            Built on real data, not simulation
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3 mb-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
              >
                <div className="text-2xl font-display font-semibold text-accent tabular">
                  <CountUp value={s.value} duration={1.4} />
                </div>
                <div className="text-[11px] text-faint leading-tight mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Every reading is parsed directly from NASA&apos;s Open Science Data Repository
            &mdash; the {MISSION.name} mission&apos;s real Complete Blood Count, Comprehensive
            Metabolic Panel, and cytokine data. No fabricated values, no synthetic demo data.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-3 px-2"
        >
          <Link to="/dashboard">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="clip-tag inline-flex items-center gap-2 bg-accent text-navy font-display font-semibold text-sm px-5 py-2.5 transition-colors"
            >
              Enter Command Center <ArrowRight size={16} />
            </motion.span>
          </Link>
          <a
            href={MISSION.dataSourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-faint hover:text-accent inline-flex items-center gap-1.5 transition-colors"
          >
            NASA OSDR source <ExternalLink size={12} />
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
