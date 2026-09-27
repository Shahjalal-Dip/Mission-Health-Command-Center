import { useState } from "react";
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

// Fixed starfield so the same stars don't re-randomize on every render
const STARS = Array.from({ length: 55 }).map(() => ({
  top: Math.random() * 100,
  left: Math.random() * 100,
  size: Math.random() * 2.4 + 1.4,
  delay: Math.random() * 4,
  duration: 2 + Math.random() * 3,
}));

function Starfield() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {STARS.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            boxShadow: "0 0 6px 1px rgba(255,255,255,0.6)",
          }}
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// A handful of streaking shooting stars, each on its own lazy, staggered cadence
const SHOOTING_STARS = [
  { top: "12%", left: "-6%", rotate: 22, delay: 1.5, repeatDelay: 10, duration: 1.3 },
  { top: "6%", left: "55%", rotate: 28, delay: 5, repeatDelay: 14, duration: 1.1 },
  { top: "34%", left: "78%", rotate: 34, delay: 8.5, repeatDelay: 12, duration: 1.4 },
  { top: "20%", left: "20%", rotate: 18, delay: 12, repeatDelay: 16, duration: 1.2 },
];

function ShootingStars() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {SHOOTING_STARS.map((s, i) => (
        <motion.div
          key={i}
          className="absolute h-[2px] w-[100px] rounded-full"
          style={{
            top: s.top,
            left: s.left,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,255,255,0))",
            transform: `rotate(${s.rotate}deg)`,
            transformOrigin: "left center",
          }}
          animate={{ x: ["0%", "260%"], opacity: [0, 1, 0] }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            repeatDelay: s.repeatDelay,
            delay: s.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

// Different liftoff routes: some rockets launch from below and climb up,
// others streak in from above and dive down — mix of both directions.
const FLIGHT_PATHS = [
  { fromX: "14%", toX: "18%", tilt: -2, direction: "up" },
  { fromX: "50%", toX: "62%", tilt: 10, direction: "up" },
  { fromX: "75%", toX: "40%", tilt: -12, direction: "up" },
  { fromX: "25%", toX: "70%", tilt: 16, direction: "up" },
  { fromX: "30%", toX: "55%", tilt: 8, direction: "down" },
  { fromX: "72%", toX: "38%", tilt: -14, direction: "down" },
  { fromX: "85%", toX: "20%", tilt: -18, direction: "down" },
];

// Satellites drift slowly, horizontally, at different heights/speeds/directions —
// no flame, just solar panels and a blinking light.
const SATELLITES = [
  { top: "16%", direction: "rtl", duration: 15, delay: 2, repeatDelay: 6, scale: 1 },
  { top: "58%", direction: "ltr", duration: 19, delay: 8, repeatDelay: 9, scale: 0.85 },
  { top: "38%", direction: "rtl", duration: 17, delay: 14, repeatDelay: 7, scale: 0.7 },
];

function Satellite({ top, direction, duration, delay, repeatDelay, scale }) {
  const fromX = direction === "ltr" ? "-8%" : "108%";
  const toX = direction === "ltr" ? "108%" : "-8%";
  const flip = direction === "ltr" ? 1 : -1;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ top }}
      initial={{ left: fromX, opacity: 0 }}
      animate={{ left: toX, opacity: [0, 1, 1, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        repeatDelay,
        delay,
        ease: "linear",
        opacity: {
          duration,
          repeat: Infinity,
          repeatDelay,
          delay,
          times: [0, 0.06, 0.9, 1],
        },
      }}
    >
      <div style={{ transform: `scale(${scale})` }} className="relative">
        <svg
          width="32"
          height="18"
          viewBox="0 0 32 18"
          fill="none"
          style={{ transform: `scaleX(${flip})` }}
        >
          <rect x="0" y="6" width="8" height="6" fill="var(--color-accent)" opacity="0.85" stroke="#0a0f1c" strokeWidth="0.5" />
          <rect x="24" y="6" width="8" height="6" fill="var(--color-accent)" opacity="0.85" stroke="#0a0f1c" strokeWidth="0.5" />
          <line x1="8" y1="9" x2="12" y2="9" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="20" y1="9" x2="24" y2="9" stroke="#cbd5e1" strokeWidth="1" />
          <rect x="12" y="5.5" width="8" height="7" rx="1.2" fill="#e5e7eb" stroke="var(--color-accent)" strokeWidth="0.6" />
          <circle cx="16" cy="9" r="1" fill="var(--color-accent)" />
        </svg>
        <motion.span
          className="absolute rounded-full"
          style={{ top: 3, left: 15, width: 2, height: 2, background: "#ff5c5c" }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}

function SatelliteField() {
  return (
    <>
      {SATELLITES.map((s, i) => (
        <Satellite key={i} {...s} />
      ))}
    </>
  );
}
function RocketLaunch({ startIndex = 0, instanceDelay = 0 }) {
  const [pathIndex, setPathIndex] = useState(startIndex % FLIGHT_PATHS.length);
  const path = FLIGHT_PATHS[pathIndex];
  const isDown = path.direction === "down";
  const rotate = isDown ? 180 + path.tilt : path.tilt;

  return (
    <motion.div
      key={pathIndex}
      className="absolute pointer-events-none"
      style={isDown ? { top: "-10%" } : { bottom: "-10%" }}
      initial={{ left: path.fromX, y: 0, opacity: 0, rotate }}
      animate={{
        left: path.toX,
        y: isDown ? "130vh" : "-130vh",
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 9,
        delay: instanceDelay,
        ease: [0.36, 0, 0.66, -0.03], // accelerating ease-in, like real liftoff
        opacity: { duration: 9, times: [0, 0.08, 0.82, 1] },
      }}
      onAnimationComplete={() =>
        setPathIndex((i) => (i + 1) % FLIGHT_PATHS.length)
      }
    >
      <div className="relative w-[34px]">
        {/* Exhaust trail */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-full"
          style={{
            width: 5,
            height: 130,
            background:
              "linear-gradient(to bottom, rgba(232,163,61,0.9), rgba(232,163,61,0.35) 40%, rgba(232,163,61,0) 100%)",
            filter: "blur(2px)",
          }}
          animate={{ opacity: [0.6, 1, 0.6], scaleY: [1, 1.15, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Flickering flame */}
        <motion.svg
          width="34"
          height="26"
          viewBox="0 0 34 26"
          className="absolute left-1/2 -translate-x-1/2 top-[46px]"
          animate={{ scaleY: [1, 1.3, 0.9, 1.15, 1], opacity: [0.9, 1, 0.85, 1] }}
          transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M17 0 C21 8 26 10 17 26 C8 10 13 8 17 0 Z"
            fill="url(#flameGrad)"
          />
          <defs>
            <linearGradient id="flameGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff4d6" />
              <stop offset="45%" stopColor="var(--color-accent)" />
              <stop offset="100%" stopColor="#e8a33d" stopOpacity="0" />
            </linearGradient>
          </defs>
        </motion.svg>

        {/* Rocket body */}
        <svg width="34" height="50" viewBox="0 0 34 50" fill="none">
          <path
            d="M17 0 C25 8 27 20 27 30 L27 38 L7 38 L7 30 C7 20 9 8 17 0 Z"
            fill="#e5e7eb"
            stroke="var(--color-accent)"
            strokeWidth="1"
          />
          <path d="M7 30 L1 42 L7 38 Z" fill="var(--color-accent)" />
          <path d="M27 30 L33 42 L27 38 Z" fill="var(--color-accent)" />
          <rect x="10" y="38" width="14" height="6" rx="1" fill="#0a0f1c" />
          <circle cx="17" cy="16" r="5" fill="#0a0f1c" stroke="var(--color-accent)" strokeWidth="1" />
          <circle cx="17" cy="16" r="1.6" fill="var(--color-accent)" />
        </svg>
      </div>
    </motion.div>
  );
}

export default function Briefing() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-10 sm:py-12 relative overflow-hidden bg-gradient-to-b from-[#0a0f1c] via-[#0a0f1c] to-[#111827] text-white">
      {/* Starfield */}
      <Starfield />
      <ShootingStars />

      {/* Rockets launching/diving through the background on staggered, changing routes */}
      <RocketLaunch startIndex={0} instanceDelay={1.5} />
      <RocketLaunch startIndex={4} instanceDelay={6} />

      {/* Satellites drifting across at different heights */}
      <SatelliteField />

      {/* Animated ambient glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        animate={{ scale: [1, 1.05, 1], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 6, repeat: Infinity }}
        style={{
          background:
            "radial-gradient(circle, rgba(232,163,61,0.15) 0%, rgba(232,163,61,0) 70%)",
        }}
      />

      <motion.div
        className="max-w-2xl w-full relative"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
      >
        <div className="text-center mb-10">
          {/* Futuristic pulsing emblem */}
          <motion.div
            className="mx-auto mb-5 relative w-[44px] h-[44px]"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="absolute inset-[-14px] rounded-full border border-accent/30"
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.svg
              width="44"
              height="44"
              viewBox="0 0 26 26"
              fill="none"
              initial={{ rotate: -25, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="relative"
            >
              <path
                d="M13 1 L24 7 V19 L13 25 L2 19 V7 Z"
                stroke="var(--color-accent)"
                strokeWidth="1"
              />
              <circle
                cx="13"
                cy="13"
                r="4.5"
                stroke="var(--color-accent)"
                strokeWidth="1"
              />
              <circle cx="13" cy="13" r="1.3" fill="var(--color-accent)" />
            </motion.svg>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 text-[11px] tracking-[0.2em] text-accent uppercase font-mono mb-3"
          >
            NASA Space Apps 2026 · Health Monitoring Software for Astronauts
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-[28px] sm:text-[36px] leading-tight font-display font-semibold text-accent mb-3 tracking-wide"
          >
            Mission Health<br />Command Center
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm text-gray-300 max-w-lg mx-auto leading-relaxed font-mono"
          >
            Long-duration spaceflight puts real, documented strain on the human
            body immune shifts, cardiovascular deconditioning, and slow
            post-flight recovery. Flight surgeons need a way to see deviation
            from a crew member&apos;s own baseline at a glance, explained in
            plain language, not buried in a spreadsheet.
          </motion.p>
        </div>

        {/* Stats panel */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-gradient-to-b from-[#0a0f1c] to-[#111827] backdrop-blur-md border border-accent/40 rounded-xl shadow-[0_0_25px_rgba(232,163,61,0.25)] p-6 mb-10 overflow-hidden"
        >
          {/* Ambient particle background */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute w-1 h-1 rounded-full bg-accent/40"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>

          <div className="relative text-[11px] tracking-widest text-accent uppercase font-mono mb-5">
            Built on real data, not simulation
          </div>

          {/* Stats grid */}
          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                className="relative flex flex-col items-center bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-accent/20 hover:border-accent/40 hover:shadow-[0_0_15px_rgba(232,163,61,0.3)] transition-all"
              >
                {/* Glowing ring behind number */}
                <motion.div
                  className="absolute w-16 h-16 rounded-full border border-accent/30"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Pulsing number */}
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [1, 0.85, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative text-4xl font-mono font-bold text-accent drop-shadow-md"
                >
                  <CountUp value={s.value} duration={1.4} />
                </motion.div>

                <div className="text-[11px] text-gray-300 uppercase tracking-wide mt-2">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Description */}
          <p className="relative text-xs text-gray-400 leading-relaxed font-mono">
            Every reading is parsed directly from NASA&apos;s Open Science Data
            Repository the <span className="text-accent font-semibold">{MISSION.name}</span> mission&apos;s real Complete Blood
            Count, Comprehensive Metabolic Panel, and cytokine data. No fabricated values,
            no synthetic demo data.
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6
                     flex flex-wrap items-center justify-center gap-3 px-2"
        >
          <Link to="/dashboard">
            <motion.span
              whileHover={{ scale: 1.05, boxShadow: "0 0 12px rgba(232,163,61,0.6)" }}
              whileTap={{ scale: 0.97 }}
              className="clip-tag inline-flex items-center gap-2 bg-gradient-to-r from-accent to-yellow-400 text-navy font-display font-semibold text-sm px-5 py-2.5 rounded-md transition-all"
            >
              Enter Command Center <ArrowRight size={16} />
            </motion.span>
          </Link>
          <a
            href={MISSION.dataSourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-gray-400 hover:text-accent inline-flex items-center gap-1.5 transition-colors font-mono"
          >
            NASA OSDR source <ExternalLink size={12} />
          </a>
        </motion.div>

        {/* System log ticker */}
        <div className="bottom-2 left-0 w-full text-center text-[10px] text-accent font-mono animate-pulse">
          <span className="text-xs text-status-normal font-display tracking-wide">SYSTEM ONLINE</span> Telemetry uplink established · Parsing biomarker streams · Baseline deviation analysis ready...
        </div>
      </motion.div>
    </div>
  );
}