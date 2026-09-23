// Known caveats about specific readings in the source OSDR data, found during
// manual review. These are NOT alterations to the published values -- we
// display exactly what NASA published -- but we surface a note so a reviewer
// isn't misled by what looks like a clinically implausible data artifact.
//
// Keyed as `${crewId}|${metricId}|${timepointId}`.
export const DATA_NOTES = {
  "C003|platelets|L-92": {
    note: "Possible data artifact: 12.9 (range 140\u2013400) is clinically implausible for a routine pre-flight screening. Value shown exactly as published in OSDR OSD-569; not altered or excluded.",
  },
};

export function getDataNote(crewId, metricId, timepointId) {
  return DATA_NOTES[`${crewId}|${metricId}|${timepointId}`]?.note ?? null;
}
