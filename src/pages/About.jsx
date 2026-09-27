import { motion } from "framer-motion";
import { MISSION, CREW_MISSION_CONTEXT } from "../data/mission";
import { REAL_READINGS } from "../data/readings.real";

const subjectCount = new Set(REAL_READINGS.map((r) => r.crewId)).size;
const timepointCount = new Set(REAL_READINGS.map((r) => r.timepointId)).size;
const metricCount = new Set(REAL_READINGS.map((r) => r.metricId)).size;

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function About() {
  return (
    <div className="px-4 sm:px-6 md:px-8 py-8 max-w-3xl mx-auto bg-gradient-to-b from-[#0a0f1c] to-[#111827] text-white rounded-xl shadow-lg">
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-[28px] font-display font-bold text-accent mb-8 tracking-wide"
      >
        About This Data
      </motion.h1>

      <motion.div
        className="space-y-6 text-sm leading-relaxed"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.08 }}
      >
        {/* Intro */}
        <motion.p
          variants={item}
          transition={{ duration: 0.4 }}
          className="bg-white/5 backdrop-blur-md border border-accent/30 rounded-lg shadow-[0_0_12px_rgba(232,163,61,0.2)] p-5 text-gray-300"
        >
          Mission Health Command Center is built on data from NASA&apos;s{" "}
          <a
            href={MISSION.dataSourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            Open Science Data Repository (OSDR)
          </a>
          , specifically the SpaceX Inspiration4 (I4) mission the first orbital
          spaceflight crewed entirely by civilians. NASA&apos;s OSDR publicly hosts biological
          datasets from this mission, including the biomarker data shown throughout this app.
        </motion.p>

        {/* Subject anonymization */}
        <motion.div
          variants={item}
          transition={{ duration: 0.4 }}
          className="bg-white/5 backdrop-blur-md border border-accent/30 rounded-lg p-5"
        >
          <div className="text-accent font-display font-semibold mb-2 text-lg tracking-wide">
            On subject anonymization
          </div>
          <p className="text-gray-300">
            NASA OSDR identifies subjects as C001&ndash;C004 in the actual data files,
            without publishing which code corresponds to which named crew member. This app
            keeps that anonymization rather than guessing the four Inspiration4
            crew members were {CREW_MISSION_CONTEXT.join(", ")}, shown here only as mission
            context, not linked to individual data.
          </p>
        </motion.div>

        {/* Timepoints */}
        <motion.div
          variants={item}
          transition={{ duration: 0.4 }}
          className="bg-white/5 backdrop-blur-md border border-accent/30 rounded-lg p-5"
        >
          <div className="text-accent font-display font-semibold mb-2 text-lg tracking-wide">
            Timepoints
          </div>
          <p className="text-gray-300">
            Readings are anchored to seven real mission-phase sample collection points: L-92,
            L-44, L-3 (pre-flight) and R+1, R+45, R+82, R+194 (post-flight), where L/R count
            days before Launch and after Return.
          </p>
        </motion.div>

        {/* Flags */}
        <motion.div
          variants={item}
          transition={{ duration: 0.4 }}
          className="bg-white/5 backdrop-blur-md border border-accent/30 rounded-lg p-5"
        >
          <div className="text-accent font-display font-semibold mb-2 text-lg tracking-wide">
            How flags work
          </div>
          <p className="text-gray-300">
            Each reading is compared against that crew member&apos;s own average pre-flight
            value. A deviation of 20%+ is marked &ldquo;watch,&rdquo; 35%+ is marked
            &ldquo;flagged.&rdquo; Standard clinical reference ranges are shown as secondary
            context. This is a rule-based decision-support signal for a ground-based reviewer it is not a diagnosis, and is not a substitute for clinical judgment.
          </p>
        </motion.div>

        {/* Source studies */}
        <motion.div
          variants={item}
          transition={{ duration: 0.4 }}
          className="bg-white/5 backdrop-blur-md border border-accent/30 rounded-lg p-5"
        >
          <div className="text-accent font-display font-semibold mb-2 text-lg tracking-wide">
            Source studies
          </div>
          <ul className="space-y-1 text-gray-300">
            {MISSION.osdStudies.map((s) => (
              <li key={s.id} className="tabular text-xs">
                {s.id} &mdash; <span className="font-sans">{s.label}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Metrics tracked */}
        <motion.div
          variants={item}
          transition={{ duration: 0.4 }}
          className="bg-white/5 backdrop-blur-md border border-accent/30 rounded-lg p-5"
        >
          <div className="text-accent font-display font-semibold mb-2 text-lg tracking-wide">
            Metrics tracked
          </div>
          <p className="text-gray-300">
            White Blood Cell Count, Absolute Lymphocytes, Hemoglobin, and Platelet Count
            (Quest Diagnostics CBC, OSD-569); Glucose and Sodium (Quest Diagnostics
            Comprehensive Metabolic Panel, OSD-575); and Interleukin-6 (Eve Technologies HD71
            cytokine panel, OSD-575). All seven are real, published values not
            simulated.
          </p>
        </motion.div>

        {/* Dataset summary */}
        <motion.div
          variants={item}
          transition={{ duration: 0.4 }}
          className="border border-status-normal/40 bg-status-normal/10 p-5 rounded-lg text-status-normal text-sm font-mono shadow-[0_0_15px_rgba(34,197,94,0.3)]"
        >
          This app is currently showing <strong>{REAL_READINGS.length} real readings</strong> across{" "}
          {subjectCount} subjects, {timepointCount} timepoints, and {metricCount} biomarkers
          ({subjectCount} × {timepointCount} × {metricCount} = {subjectCount * timepointCount * metricCount}),
          parsed directly from the OSDR CSV exports linked above. No values are simulated or
          estimated. These counts are computed from the underlying dataset, not hardcoded, so
          they can&apos;t drift out of sync if the data changes.
        </motion.div>

        {/* Limitation */}
        <motion.div
          variants={item}
          transition={{ duration: 0.4 }}
          className="bg-white/5 backdrop-blur-md border border-accent/30 rounded-lg p-5"
        >
          <div className="text-accent font-display font-semibold mb-2 text-lg tracking-wide">
            Known limitation
          </div>
          <p className="text-gray-300">
            With only 4 subjects and a 3-day mission, this is a small sample for statistical
            purposes. Flags here are a rule-based decision-support signal to guide a ground
            reviewer&apos;s attention not a validated clinical or statistical finding.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
