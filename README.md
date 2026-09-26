# Mission Health Command Center

**NASA Space Apps Challenge 2026 — Create Health Monitoring Software for Astronauts on Space Missions**

A flight-surgeon-style dashboard that turns real NASA astronaut biomarker data into explainable, decision-support signals — built entirely on real, published data from NASA's Open Science Data Repository (OSDR), not simulation.

🔗 **Live demo:** _add your deployed URL here_
🎥 **Demo video:** _add your video link here_

---

## The problem

Long-duration spaceflight causes well-documented physiological strain: immune system shifts, cardiovascular deconditioning, bone and muscle loss, and slow post-flight recovery. Flight surgeons need a way to see *deviation from a crew member's own baseline* at a glance, explained in plain language — not buried in a spreadsheet of lab values.

## What we built

Mission Health Command Center replays real astronaut biomarker data on a mission timeline, flags meaningful deviations using a transparent rule-based engine, and explains *why* each flag was raised — in plain language, with the underlying lab reference range shown as context.

### Core features

- **Crew Overview** — roster of all 4 real Inspiration4 subjects, status color-coded by worst flagged biomarker, with a WBC trend sparkline per subject
- **Individual Timeline View** — chart of any tracked biomarker across all 7 real mission timepoints, with lab reference bands and per-timepoint readouts
- **Explainable flagging engine** — every flag states *why*: percent deviation from the subject's own pre-flight baseline, plus clinical reference range context where one exists
- **Recovery Trajectory (Insights)** — computes, from real post-flight data only, how many days each biomarker took to normalize per subject — no extrapolation beyond what was actually measured
- **Mission-Duration Risk Context (Insights)** — published NASA research on how risk scales for longer missions, clearly walled off from our own dataset so the two are never conflated
- **Full data transparency** — an "About This Data" page documents every source file, every assumption, and a known data-quality artifact we found and handled visibly rather than hiding

## NASA data used

| Source | Study | What it provides |
|---|---|---|
| NASA OSDR | [OSD-569](https://osdr.nasa.gov/bio/repo/data/studies/OSD-569) | Complete Blood Count (Quest Diagnostics) |
| NASA OSDR | [OSD-575](https://osdr.nasa.gov/bio/repo/data/studies/OSD-575) | Comprehensive Metabolic Panel + cytokine multiplex panel |
| NASA HRP | [Bone Fracture Risk evidence report](https://ntrs.nasa.gov/api/citations/20170004597/downloads/20170004597.pdf) | Literature context only (Insights page) |

All data is from the SpaceX **Inspiration4** mission — the first orbital spaceflight crewed entirely by civilians. NASA's Open Science Data Repository publicly hosts biological datasets from this mission. Subjects are anonymized as C001–C004 exactly as NASA published them; we deliberately did not attempt to map codes to named crew members, since NASA does not publish that mapping.

**196 real readings** across 4 subjects × 7 timepoints × 7 biomarkers — a complete grid, no gaps. Zero simulated values.

## Why this approach

With only 4 subjects and a 3-day mission, we made a deliberate choice: flag deviation from **each subject's own pre-flight baseline**, rather than a population-wide "normal" — this is both more scientifically honest for a small sample and closer to how a flight surgeon would actually think about an individual crew member's trend.

We also found and transparently handled a real data-quality issue: one biomarker reading (platelet count, subject C003, timepoint L-92) is a clinically implausible outlier in NASA's own published file. Rather than silently "fixing" NASA's data or hiding it, we display it exactly as published with a visible caveat, and exclude it specifically from baseline math (which it would otherwise distort) while keeping it visible in the raw timeline.

## Tech stack

- React + Tailwind CSS v4 (Vite)
- Recharts for data visualization
- No backend, no database — the real dataset (196 readings) is small enough that a one-time ETL into a static JSON/JS module is simpler and more reliable for a demo than standing up live infrastructure
- ETL: a one-time Python script (`/etl/build_readings.py`, see below) parses the raw OSDR CSV exports into the app's data shape

## Running locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Project structure

```
src/
  data/           mission facts, metrics, real readings, data-quality notes
  lib/            flagging engine, recovery analysis
  components/     Sparkline, MissionTimeline
  pages/          Briefing, Dashboard, CrewDetail, Insights, About
```

## Known limitations

- Small sample size (n=4, one 3-day mission) — flags are a decision-support signal, not a validated clinical or statistical finding
- Biomarkers tracked (CBC, metabolic panel, cytokines) do not include bone density or muscle mass, so the Mission-Duration Risk Context panel is literature-only and not connected to our subject data
- No live/continuous vitals stream exists publicly for privacy reasons; this tool works with the discrete-timepoint clinical data NASA has published

## Team

_Add your name/team here_

## License

_Add your license here (MIT recommended for Space Apps submissions)_
