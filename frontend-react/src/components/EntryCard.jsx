import React, { useState } from "react";
import AwarenessOverlay from "./AwarenessOverlay";

export default function EntryCard({ entry, onClick, onEntryUpdate }) {

  const [showAwarenessOverlay, setShowAwarenessOverlay] = useState(false);

  const hasAwareness =
    entry.emotionTone ||
    entry.cognitiveLens ||
    entry.lifeContext;

  const toneColor = {
    happy: "#9bffbe",
    good: "#c8ffd9",
    neutral: "#bfbfbf",
    sad: "#ffb3b3"
  }[entry.emotionTone];

  function handleAwarenessSave(updatedEntry) {
    if (onEntryUpdate) onEntryUpdate(updatedEntry);
    setShowAwarenessOverlay(false);
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  return (
    <>
      <div
        className="entry-card cinematic-card"
        onClick={onClick}
      >
        <div className="entry-inner">

          <div className="entry-header">
            <h3>{entry.title}</h3>
            <span className="entry-type">Reflection</span>
          </div>

          {hasAwareness && (
            <div className="entry-awareness fade-in">

              {entry.emotionTone && (
                <span
                  className="tone-dot pulse"
                  style={{ backgroundColor: toneColor }}
                />
              )}

              {entry.cognitiveLens && (
                <span className="awareness-chip pop-in">
                  {entry.cognitiveLens}
                </span>
              )}

              {entry.lifeContext && (
                <span className="awareness-chip subtle pop-in">
                  {entry.lifeContext}
                </span>
              )}

            </div>
          )}

          <p className="entry-note">{entry.note}</p>

          <div className="entry-date">
            {formatDate(entry.createdAt)}
          </div>

          {!hasAwareness && (
            <button
              className="add-awareness-btn ghost-button"
              onClick={(e) => {
                e.stopPropagation();
                setShowAwarenessOverlay(true);
              }}
            >
              ✦ Add Awareness
            </button>
          )}

        </div>
      </div>

      {showAwarenessOverlay && (
        <AwarenessOverlay
          entry={entry}
          onClose={() => setShowAwarenessOverlay(false)}
          onSave={handleAwarenessSave}
        />
      )}
    </>
  );
}
