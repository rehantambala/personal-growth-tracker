export function computeTrends(entries) {

  if (!entries || entries.length === 0)
    return { empty: true };

  const last7 = entries.slice(-7);
  const last30 = entries.slice(-30);

  const reflectionsLastWeek = last7.length;
  const reflectionsLastMonth = last30.length;

  const withAwareness = entries.filter(e => e.awarenessTags?.length > 0).length;

  const moodCounts = {};
  entries.forEach(e => {
    moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
  });

  const mostUsedMood =
    Object.entries(moodCounts).sort((a,b)=>b[1]-a[1])[0]?.[0];

  // Growth context trend
  const contextCounts = {};
  entries.forEach(e => {
    e.context?.forEach(ctx => {
      contextCounts[ctx] = (contextCounts[ctx] || 0) + 1;
    });
  });

  const dominantContext =
    Object.entries(contextCounts).sort((a,b)=>b[1]-a[1])[0]?.[0];

  return {
    reflectionsLastWeek,
    reflectionsLastMonth,
    withAwareness,
    mostUsedMood,
    dominantContext
  };
}
