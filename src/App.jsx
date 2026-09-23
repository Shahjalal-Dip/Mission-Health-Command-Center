import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
import { Activity, Radio, Info } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import CrewDetail from "./pages/CrewDetail";
import About from "./pages/About";
import { MISSION } from "./data/mission";

function NavItem({ to, icon: Icon, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3 py-2 text-sm border-l-2 transition-colors ${
          isActive
            ? "border-accent text-ink bg-panel-raised"
            : "border-transparent text-muted hover:text-ink hover:bg-panel-raised/50"
        }`
      }
    >
      <Icon size={16} strokeWidth={2} />
      {label}
    </NavLink>
  );
}

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex">
        <aside className="w-56 shrink-0 border-r border-line bg-panel flex flex-col">
          <div className="px-4 py-4 border-b border-line">
            <div className="text-xs tracking-wide text-faint uppercase">Mission Health</div>
            <div className="text-base font-semibold text-ink leading-tight">Command Center</div>
          </div>
          <nav className="flex-1 py-3">
            <NavItem to="/" icon={Activity} label="Crew Overview" end />
            <NavItem to="/about" icon={Info} label="About This Data" />
          </nav>
          <div className="px-4 py-3 border-t border-line text-xs text-faint">
            <div className="flex items-center gap-1.5 mb-1">
              <Radio size={12} />
              {MISSION.name}
            </div>
            {MISSION.launchDate} &rarr; {MISSION.returnDate}
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="bg-status-normal/10 border-b border-status-normal/30 text-status-normal text-xs px-4 py-1.5 text-center">
            Real NASA OSDR data &middot; Inspiration4 mission (OSD-569, OSD-575) &middot; see About This Data
          </div>
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/crew/:crewId" element={<CrewDetail />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
}
