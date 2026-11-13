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
// L = days before Launch, R = days after Return. Confirmed against actual
// OSD-569 sample sheet (s_OSD-569.txt) -- 7 timepoints, not 6.
export const TIMEPOINTS = [
  { id: "L-92", label: "L-92", phase: "pre-flight", daysFromLaunch: -92 },
  { id: "L-44", label: "L-44", phase: "pre-flight", daysFromLaunch: -44 },
  { id: "L-3", label: "L-3", phase: "pre-flight", daysFromLaunch: -3 },
  { id: "R+1", label: "R+1", phase: "post-flight", daysFromLaunch: 4 },
  { id: "R+45", label: "R+45", phase: "post-flight", daysFromLaunch: 48 },
  { id: "R+82", label: "R+82", phase: "post-flight", daysFromLaunch: 85 },
  { id: "R+194", label: "R+194", phase: "post-flight", daysFromLaunch: 197 },
];

// NASA OSDR anonymizes Inspiration4 subjects as C001-C004 in the actual data
// files (see s_OSD-569.txt). We deliberately do NOT map these to individual
// crew member names ourselves, since OSDR does not publish that mapping and
// we won't invent one. Crew names are shown only as mission-level context.
export const CREW = [
  { id: "C001", name: "Subject C001", role: "Inspiration4 Crew" },
  { id: "C002", name: "Subject C002", role: "Inspiration4 Crew" },
  { id: "C003", name: "Subject C003", role: "Inspiration4 Crew" },
  { id: "C004", name: "Subject C004", role: "Inspiration4 Crew" },
];

// The four named Inspiration4 crew members, shown as mission-level context
// only (About page) -- not linked to individual subject codes above.
export const CREW_MISSION_CONTEXT = [
  "Jared Isaacman (Commander)",
  "Sian Proctor (Pilot)",
  "Hayley Arceneaux (Medical Officer)",
  "Chris Sembroski (Mission Specialist)",
];
