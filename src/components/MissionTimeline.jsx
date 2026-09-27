import { motion } from "framer-motion";
import { TIMEPOINTS, MISSION } from "../data/mission";

export default function MissionTimeline({ highlightId }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border border-line bg-panel/90 backdrop-blur-sm px-4 py-3 relative overflow-hidden"
    >
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
            {tp.id === highlightId && (
              <motion.div
                className="absolute w-2 h-2 rotate-45 border border-accent"
                animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.3 }}
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
    </motion.div>
  );
}
