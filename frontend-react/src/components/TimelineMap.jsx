import "../styles/timeline.css";

export default function TimelineMap({ entries, onSelect }) {

  if (!entries || entries.length === 0) return null;

  return (
    <div className="timeline-wrapper">

      <h3 className="timeline-title">
        Your Emotional Timeline
      </h3>

      <p className="timeline-subtitle">
        A quiet trace of how your inner world has shifted over time
      </p>

      <div className="timeline-track">

        {entries.map((entry, i) => {

          const tone = entry.emotionTone || "neutral";

          const size =
            Math.min(
              18 + (entry.note?.length || 0) / 40,
              42
            );

          return (
            <div
              key={entry._id || i}
              className={`timeline-node tone-${tone}`}
              style={{ width: size, height: size }}
              onClick={() => onSelect(entry)}
            >
              <div className="timeline-halo" />
            </div>
          );
        })}

      </div>

    </div>
  );
}
