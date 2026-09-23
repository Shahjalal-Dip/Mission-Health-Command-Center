const RANK = { normal: 0, watch: 1, flagged: 2 };

export function worstSeverity(flaggedReadings) {
  return flaggedReadings.reduce((worst, r) => (RANK[r.severity] > RANK[worst] ? r.severity : worst), "normal");
}

export function crewSummary(crewId, flaggedReadings) {
  const rows = flaggedReadings.filter((r) => r.crewId === crewId);
  const flaggedCount = rows.filter((r) => r.severity === "flagged").length;
  const watchCount = rows.filter((r) => r.severity === "watch").length;
  return {
    status: worstSeverity(rows),
    flaggedCount,
    watchCount,
    totalReadings: rows.length,
  };
}

export const STATUS_LABEL = {
  normal: "Nominal",
  watch: "Watch",
  flagged: "Flagged",
};

export const STATUS_COLOR = {
  normal: "status-normal",
  watch: "status-watch",
  flagged: "status-flagged",
};
