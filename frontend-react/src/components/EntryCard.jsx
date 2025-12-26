export default function EntryCard({ entry }) {
  return (
    <div className="entry-card">

      <div className="entry-inner">

        <div className="entry-header">
          <h2>{entry.title}</h2>
          <span className="entry-type">
            {entry.type || "Reflection"}
          </span>
        </div>

        <p className="entry-note">
          {entry.note}
        </p>

        <small className="entry-date">
          {new Date(entry.createdAt).toLocaleString()}
        </small>

      </div>

    </div>
  );
}
