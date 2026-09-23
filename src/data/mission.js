// Real, verified mission facts (source: NASA OSDR, nasa.gov/osdr-latest-news-i4-mission-datasets)
export const MISSION = {
  id: "inspiration4",
  name: "SpaceX Inspiration4",
  summary:
    "First orbital spaceflight crewed entirely by civilians. 3-day mission, ~590 km altitude aboard SpaceX Crew Dragon 'Resilience'.",
  launchDate: "2021-09-16",
  returnDate: "2021-09-18",
  dataSource: "NASA Open Science Data Repository (OSDR)",
  dataSourceUrl: "https://www.nasa.gov/osdr-latest-news-i4-mission-datasets/",
  osdStudies: [
    { id: "OSD-569", label: "Whole Blood" },
    { id: "OSD-570", label: "PBMC" },
    { id: "OSD-571", label: "Blood Plasma" },
    { id: "OSD-575", label: "Blood Serum" },
  ],
};

// Real mission timepoints as defined by OSDR/TRISH sample collection schedule.
// L = days before Launch, R = days after Return.
export const TIMEPOINTS = [
  { id: "L-92", label: "L-92", phase: "pre-flight", daysFromLaunch: -92 },
  { id: "L-44", label: "L-44", phase: "pre-flight", daysFromLaunch: -44 },
  { id: "L-3", label: "L-3", phase: "pre-flight", daysFromLaunch: -3 },
  { id: "R+1", label: "R+1", phase: "post-flight", daysFromLaunch: 4 },
  { id: "R+45", label: "R+45", phase: "post-flight", daysFromLaunch: 48 },
  { id: "R+82", label: "R+82", phase: "post-flight", daysFromLaunch: 85 },
];

// Real crew members of Inspiration4 (public figures, public mission).
export const CREW = [
  { id: "isaacman", name: "Jared Isaacman", role: "Commander" },
  { id: "proctor", name: "Sian Proctor", role: "Pilot" },
  { id: "arceneaux", name: "Hayley Arceneaux", role: "Medical Officer" },
  { id: "sembroski", name: "Chris Sembroski", role: "Mission Specialist" },
];
