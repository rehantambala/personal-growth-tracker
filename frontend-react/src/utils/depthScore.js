export function computeDepth(entry) {

  let score = 0;

  const wordCount = entry.note?.split(" ").length;

  if (wordCount > 120) score += 3;
  else if (wordCount > 60) score += 2;
  else if (wordCount > 20) score += 1;

  if (entry.awarenessTags?.length > 0) score += 2;

  if (entry.context?.includes("growth")) score += 2;
  if (entry.context?.includes("transition")) score += 1;

  return score;
}
