export default function EntryCard({ entry, onClick }) {

  const date = new Date(
    entry.createdAt || entry.date
  ).toLocaleDateString();

  return (
    <div className="entry-card" onClick={onClick}>
      <div className="entry-inner">

        <div className="entry-header">

          <h3>{entry.title || "Untitled Reflection"}</h3>

          <span className="entry-type">
            {entry.type || entry.category || "Reflection"}
          </span>
        </div>


        {/* 🌿 Awareness metadata chips */}
        <div className="entry-meta">

          {entry.emotionTone && (
            <span className="meta-chip mood-chip">
              {entry.emotionTone}
            </span>
          )}

          {entry.cognitiveLens && (
            <span className="meta-chip">
              {entry.cognitiveLens}
            </span>
          )}

          {entry.lifeContext && (
            <span className="meta-chip">
              {entry.lifeContext}
            </span>
          )}

        </div>


        <p className="entry-note">
          {entry.content || entry.note}
        </p>

        <span className="entry-date">
          {date}
        </span>

      </div>
    </div>
  );
}
