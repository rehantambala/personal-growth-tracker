export default function EntryCard({ entry }) {

  const date = new Date(
    entry.createdAt || entry.date
  ).toLocaleDateString();

  return (
    <div className="entry-card">
      <div className="entry-inner">

        <div className="entry-header">
          <h3>{entry.title || "Untitled Reflection"}</h3>

          <span className="entry-type">
            {entry.type || entry.category || "Reflection"}
          </span>
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
