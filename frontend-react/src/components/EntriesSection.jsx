import React, { useState, useEffect } from "react";
import "../styles/entries.css";

import EntryCard from "./EntryCard";
import EntryExpandedView from "./EntryExpandedView";
import AwarenessOverlay from "./AwarenessOverlay";

import {
  fetchEntriesFromBackend,
  saveEntryToBackend,
  updateEntryInBackend
} from "../api/entriesApi";

export default function EntriesSection() {

  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newNote, setNewNote] = useState("");

  // 🟢 Cinematic card open
  const [selectedEntry, setSelectedEntry] = useState(null);

  // 🟢 Awareness overlay after save
  const [pendingEntry, setPendingEntry] = useState(null);
  const [showAwareness, setShowAwareness] = useState(false);


  // 🟢 Load entries from backend
  useEffect(() => {
    async function load() {
      const data = await fetchEntriesFromBackend();
      setEntries(data || []);
    }
    load();
  }, []);


  // 🟢 Save new reflection
  async function handleSave() {

    if (!newTitle.trim() || !newNote.trim()) return;

    const saved = await saveEntryToBackend({
      title: newTitle,
      note: newNote,
      mood: "neutral",
      category: "General",
      type: "Reflection"
    });

    if (saved?._id) {

      // add to UI instantly
      setEntries(prev => [saved, ...prev]);

      // trigger awareness overlay
      setPendingEntry(saved);
      setShowAwareness(true);
    }

    setNewTitle("");
    setNewNote("");
    setShowModal(false);
  }


  // 🟢 Save awareness metadata + update UI
  async function handleAwarenessSave(meta) {

    const updated = await updateEntryInBackend(
      pendingEntry._id,   // <-- correct ID reference
      {
        emotionTone:   meta.emotionTone,
        cognitiveLens: meta.cognitiveLens,
        lifeContext:   meta.lifeContext
      }
    );

    if (!updated) return;

    // refresh in list
    setEntries(prev =>
      prev.map(e => e._id === updated._id ? updated : e)
    );

    // refresh expanded view also
    setSelectedEntry(updated);

    // close overlay
    setShowAwareness(false);
    setPendingEntry(null);
  }


  return (
    <section className="entries-wrapper">

      {/* Header */}
      <div className="entries-header">

        <div>
          <h2 className="entries-title">Your Reflections</h2>
          <p className="entries-subtitle">
            A quiet archive of thoughts — held without noise or judgment.
          </p>
        </div>

        <button
          className="new-entry-btn"
          onClick={() => setShowModal(true)}
        >
          ✨ New Reflection
        </button>

      </div>


      {/* Entries Grid */}
      <div className="entries-grid">

        {entries.map(entry => (
          <EntryCard
            key={entry._id}
            entry={entry}
            onClick={() => setSelectedEntry(entry)}
          />
        ))}

        {entries.length === 0 && (
          <p className="empty-state">
            No reflections yet — begin your first trace of thought.
          </p>
        )}

      </div>


      {/* ✨ Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">

            <h3>New Reflection</h3>

            <input
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />

            <textarea
              placeholder="Write your thoughts…"
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
            />

            <div className="modal-actions">

              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="save-btn"
                onClick={handleSave}
              >
                Save
              </button>

            </div>

          </div>
        </div>
      )}


      {/* 🌌 Awareness Overlay */}
      {showAwareness && pendingEntry && (
        <AwarenessOverlay
          entry={pendingEntry}
          onClose={() => {
            setShowAwareness(false);
            setPendingEntry(null);
          }}
          onSave={handleAwarenessSave}
        />
      )}


      {/* 🟢 Expanded cinematic view */}
      {selectedEntry && (
        <EntryExpandedView
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}

    </section>
  );
}
