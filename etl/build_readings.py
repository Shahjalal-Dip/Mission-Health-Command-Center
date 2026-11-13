import csv, re, json
from pathlib import Path

UPLOAD_DIR = Path("/mnt/user-data/uploads")

SAMPLE_RE = re.compile(r"^(C\d{3})_[a-z-]+_(L-\d+|R\+\d+)")

def parse_sample(name):
    m = SAMPLE_RE.match(name)
    if not m:
        return None, None
    return m.group(1), m.group(2)

def load_csv(path):
    with open(path, encoding="utf-8-sig") as fh:
        return list(csv.DictReader(fh))

cbc_rows = load_csv(UPLOAD_DIR / "LSDS-7_Complete_Blood_Count_CBC_TRANSFORMED.csv")
cmp_rows = load_csv(UPLOAD_DIR / "LSDS-8_Comprehensive_Metabolic_Panel_CMP_TRANSFORMED.csv")
cyto_rows = load_csv(UPLOAD_DIR / "LSDS-8_Multiplex_serum_immune_EvePanel_TRANSFORMED.csv")

# metricId -> (source rows, value column, range_min column or None, range_max column or None, unit, display name, category, description)
METRIC_DEFS = {
    "wbc": (cbc_rows, "white_blood_cell_count_value_thousand_per_microliter",
            "white_blood_cell_count_range_min_thousand_per_microliter",
            "white_blood_cell_count_range_max_thousand_per_microliter",
            "x10\u00b3/\u00b5L", "White Blood Cell Count", "Immune",
            "Total white blood cell count. Broad marker of immune activation."),
    "lymphocyte_pct": (cbc_rows, "lymphocytes_value_percent",
            "lymphocytes_range_min_percent", "lymphocytes_range_max_percent",
            "%", "Lymphocyte Percentage", "Immune",
            "Proportion of white blood cells that are lymphocytes. Documented to shift during and after spaceflight."),
    "neutrophils_pct": (cbc_rows, "neutrophils_value_percent",
            "neutrophils_range_min_percent", "neutrophils_range_max_percent",
            "%", "Neutrophil Percentage", "Immune",
            "Proportion of white blood cells that are neutrophils, the first responders of the innate immune system."),
    "glucose": (cmp_rows, "glucose_value_milligram_per_deciliter",
            "glucose_range_min_milligram_per_deciliter", "glucose_range_max_milligram_per_deciliter",
            "mg/dL", "Glucose", "Metabolic",
            "Blood sugar. Used as a general marker of metabolic and physiological stress load."),
    "creatinine": (cmp_rows, "creatinine_value_milligram_per_deciliter",
            "creatinine_range_min_milligram_per_deciliter", "creatinine_range_max_milligram_per_deciliter",
            "mg/dL", "Creatinine", "Metabolic",
            "Kidney function marker; also reflects muscle mass, which is relevant given known spaceflight muscle loss."),
    "il6": (cyto_rows, "il_6_concentration_picogram_per_milliliter", None, None,
            "pg/mL", "Interleukin-6 (IL-6)", "Inflammation",
            "Key inflammatory cytokine. No universal clinical reference range exists for this assay, so this metric is flagged only by deviation from the crew member's own pre-flight baseline."),
}

readings = []
metrics_out = {}

# quick header sanity check
for mid, (rows, valcol, mincol, maxcol, unit, name, cat, desc) in METRIC_DEFS.items():
    if valcol not in rows[0]:
        print("MISSING COLUMN:", mid, valcol)
        continue
    range_lo, range_hi = None, None
    for row in rows:
        crew_id, tp = parse_sample(row["Sample Name"])
        if not crew_id:
            continue
        raw = row.get(valcol, "").strip()
        if raw in ("", "NA", "N/A"):
            continue
        try:
            val = float(raw)
        except ValueError:
            continue
        readings.append({"crewId": crew_id, "metricId": mid, "timepointId": tp, "value": val})
        if range_lo is None and mincol:
            try:
                range_lo = float(row[mincol])
                range_hi = float(row[maxcol])
            except (ValueError, TypeError):
                pass
    metrics_out[mid] = {
        "id": mid, "name": name, "shortName": name, "unit": unit, "category": cat,
        "normalRange": [range_lo, range_hi] if range_lo is not None else None,
        "description": desc,
        "source": "Quest Diagnostics reference range (from OSDR OSD-569/OSD-575)" if range_lo is not None else "No universal clinical reference range for this assay",
    }

print("Total readings:", len(readings))
print("Crew IDs found:", sorted(set(r["crewId"] for r in readings)))
print("Timepoints found:", sorted(set(r["timepointId"] for r in readings)))

Path("/home/claude/etl/readings.json").write_text(json.dumps(readings, indent=2))
Path("/home/claude/etl/metrics.json").write_text(json.dumps(list(metrics_out.values()), indent=2))
print("\nSample metric def:", json.dumps(metrics_out["wbc"], indent=2))

# ---------------------------------------------------------------------------
# To regenerate src/data/readings.real.js from these outputs:
# 1. Run this script (expects the 3 OSDR CSVs in /mnt/user-data/uploads,
#    or edit UPLOAD_DIR above to point at wherever you saved them)
# 2. It writes readings.json and metrics.json alongside this script
# 3. Those are hand-merged into src/data/readings.real.js and
#    src/data/metrics.js, which add rangeMin/rangeMax per reading and
#    hasClinicalRange per metric (see those files for the final shape)
# ---------------------------------------------------------------------------
