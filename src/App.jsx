import { HashRouter, Routes, Route, NavLink, Link, useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Info, TrendingUp } from "lucide-react";
import Briefing from "./pages/Briefing";
import Dashboard from "./pages/Dashboard";
import CrewDetail from "./pages/CrewDetail";
import About from "./pages/About";
import Insights from "./pages/Insights";
import Starfield from "./components/Starfield";
import { MISSION } from "./data/mission";

function Insignia({ animated = false }) {
  const Tag = animated ? motion.svg : "svg";
  const extra = animated
    ? {
        initial: { rotate: -20, opacity: 0, scale: 0.7 },
        animate: { rotate: 0, opacity: 1, scale: 1 },
        transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
      }
    : {};
  return (
    <Tag width="26" height="26" viewBox="0 0 26 26" fill="none" {...extra}>
      <path d="M13 1 L24 7 V19 L13 25 L2 19 V7 Z" stroke="var(--color-accent)" strokeWidth="1.2" />
      <circle cx="13" cy="13" r="4.5" stroke="var(--color-accent)" strokeWidth="1.2" />
      <circle cx="13" cy="13" r="1.3" fill="var(--color-accent)" />
      <path d="M13 1 V6.5 M13 25 V19.5 M2 7 L7 10 M24 7 L19 10 M2 19 L7 16 M24 19 L19 16" stroke="var(--color-line-bright)" strokeWidth="0.9" />
    </Tag>
  );
}

function NavItem({ to, icon: Icon, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-4 py-2.5 text-sm border-l-2 transition-all duration-200 ${
          isActive
            ? "border-accent text-ink bg-panel-raised"
            : "border-transparent text-muted hover:text-ink hover:bg-panel-raised/50 hover:border-line-bright"
        }`
      }
    >
      <Icon size={15} strokeWidth={2} />
      {label}
    </NavLink>
  );
}

function AppShell() {
  const location = useLocation();
  const outlet = useOutlet();
  return (
    <div className="min-h-screen flex relative z-10">
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-60 shrink-0 border-r border-line bg-panel/80 backdrop-blur-sm flex flex-col"
      >
        <Link to="/" className="px-4 py-4 border-b border-line flex items-center gap-2.5 hover:bg-panel-raised/50 transition-colors">
          <Insignia />
          <div>
            <div className="text-[10px] tracking-widest text-faint uppercase font-display">Mission Health</div>
            <div className="text-[15px] font-display font-semibold text-ink leading-tight">Command Center</div>
          </div>
        </Link>
        <nav className="flex-1 py-3">
          <NavItem to="/dashboard" icon={Activity} label="Crew Overview" />
          <NavItem to="/insights" icon={TrendingUp} label="Insights" />
          <NavItem to="/about" icon={Info} label="Data & Methods" />
        </nav>
        <div className="px-4 py-3 border-t border-line text-[11px] text-faint space-y-1">
          <div className="flex justify-between tabular">
            <span className="text-muted">MISSION</span>
            <span className="text-ink">{MISSION.name.replace("SpaceX ", "")}</span>
          </div>
          <div className="flex justify-between tabular">
            <span className="text-muted">LAUNCH</span>
            <span>{MISSION.launchDate}</span>
          </div>
          <div className="flex justify-between tabular">
            <span className="text-muted">WINDOW</span>
            <span>L-92 &rarr; R+194</span>
          </div>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0">
        <motion.div
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-status-normal/10 border-b border-status-normal/30 text-status-normal text-[11px] tracking-wide px-4 py-1.5 text-center font-display flex items-center justify-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-status-normal animate-pulse" />
          REAL NASA OSDR DATA &middot; INSPIRATION4 (OSD-569, OSD-575) &middot; SEE ABOUT THIS DATA
        </motion.div>
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};
const pageTransition = { duration: 0.35, ease: [0.16, 1, 0.3, 1] };

function Page({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname === "/" ? "briefing" : "shell"}>
        <Route path="/" element={<Page><Briefing /></Page>} />
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/crew/:crewId" element={<CrewDetail />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Starfield />
      <AnimatedRoutes />
    </HashRouter>
  );
}
