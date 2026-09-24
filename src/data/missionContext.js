// Real, verified NASA-published figures on how certain spaceflight risks
// scale with mission duration. These are LITERATURE CONTEXT ONLY -- NOT
// derived from, or extrapolated from, the Inspiration4 biomarker data this
// app displays elsewhere. I4 was a 3-day mission and our CBC/metabolic/
// cytokine panels do not measure bone density or muscle mass at all, so
// there is no honest way to connect these figures to our actual dataset.
// They exist to give a ground reviewer context for why longer missions
// warrant more monitoring, not to make a claim about any specific subject.
export const MISSION_DURATION_CONTEXT = [
  {
    id: "bone",
    title: "Bone density",
    stat: "1\u20131.5% loss per month",
    body: "NASA's Human Research Program reports averaged bone mineral density loss of 1\u20131.5% per month at weight-bearing skeletal sites (hip, spine, lower limbs) during typical 4\u20136 month long-duration missions.",
    source: "NASA Human Research Program, Risk of Bone Fracture evidence report",
    sourceUrl: "https://ntrs.nasa.gov/api/citations/20170004597/downloads/20170004597.pdf",
  },
  {
    id: "muscle",
    title: "Muscle mass",
    stat: "Up to 20% loss in 5\u201311 days",
    body: "NASA-affiliated research indicates astronauts can lose up to 20% of muscle mass on missions of just 5\u201311 days, with losses up to 30% on longer missions, primarily in anti-gravity muscles (calves, quadriceps, back).",
    source: "NASA-affiliated spaceflight muscle atrophy research",
    sourceUrl: "https://news.liverpool.ac.uk/?p=102224",
  },
];

export const CONTEXT_DISCLAIMER =
  "These figures describe general spaceflight research findings for longer-duration missions and are shown for mission-planning context only. They are not derived from, or applied to, the Inspiration4 biomarker data shown elsewhere in this app \u2014 our source panels (CBC, metabolic panel, cytokine panel) do not measure bone density or muscle mass.";
