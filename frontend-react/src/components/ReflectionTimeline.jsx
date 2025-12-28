import React from "react";

export default function ReflectionTimeline({ entries }) {

  return (
    <div className="timeline-container">

      <h2>Life Journey Timeline</h2>

      <div className="timeline">
        {entries.map(entry => (
          <div className="timeline-item" key={entry._id}>

            <div className="timeline-dot" />

            <div className="timeline-content">

              <div className="t-date">
                {new Date(entry.createdAt).toLocaleDateString()}
              </div>

              <div className="t-title">{entry.title}</div>

              <div className="t-mood">{entry.mood}</div>

              <div className="t-context">
                {entry.context?.join(" • ")}
              </div>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
