import React, { useState, useEffect } from "react";
import "../styles/entries.css";

import EntryCard from "./EntryCard";
import EntryExpandedView from "./EntryExpandedView";
import AwarenessOverlay from "./AwarenessOverlay";
import NewEntryModal from "./NewEntryModal";
import AnalyticsDashboard from "./AnalyticsDashboard";

import { fetchEntriesFromBackend } from "../api/entriesApi";
import FloatingQuickActions from "./FloatingQuickActions";


export default function EntriesSection() {

  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [pendingEntry, setPendingEntry] = useState(null);
  const [showAwareness, setShowAwareness] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchEntriesFromBackend();

        // force normalize to array always
        const list =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.entries)
            ? data.entries
            : [];

        setEntries(list);

      } catch (err) {
        console.error("Failed to load entries:", err);
        setEntries([]); // fail safe
      }
    }

    load();
  }, []);

  // Open modal when New Reflection is clicked
  function handleNewReflection() {
    setShowModal(true);
  }

  // After modal saves entry, show awareness overlay
  function handleEntrySaved(savedEntry) {
    setEntries(prev => [savedEntry, ...prev]);
    setShowModal(false);
    setPendingEntry(savedEntry);
    setShowAwareness(true);
  }

  // Update entry in list after awareness is saved
  function handleAwarenessSave(updatedEntry) {
    
    // Update the entry in the main list
    setEntries(prev =>
      prev.map(e =>
        e._id === updatedEntry._id ? updatedEntry : e
      )
    );

    // Update selectedEntry if it's the same one
    setSelectedEntry(prev =>
      prev && prev._id === updatedEntry._id
        ? updatedEntry
        : prev
    );

    // Close overlay AFTER state updates
    setPendingEntry(null);
    setShowAwareness(false);
  }

  return (
    <section className="entries-wrapper">

      {/* Header with tagline and button */}
   <div className="entries-hero-center">

  <h1 className="entries-title">
    ✨ Your Reflections
  </h1>

  <p className="entries-subtitle">
    A quiet archive of thoughts — held without noise or judgment.
  </p>

  <button
    className="new-reflection-btn hero-btn"
    onClick={handleNewReflection}
  >
    Start a Reflection<span className="icon">✦</span>

  </button>

</div>



      <div className="entries-grid">
        {entries.map(entry => (
          <EntryCard
            key={entry._id}
            entry={entry}
            onClick={() => setSelectedEntry(entry)}
            onEntryUpdate={handleAwarenessSave}
          />
        ))}
      </div>

      {/* Analytics Dashboard - Below all entries */}
      {entries.length > 0 && (
        <div id="analytics" className="analytics-section">

          <AnalyticsDashboard entries={entries} />
        </div>
      )}

      {/* New Entry Modal */}
      {showModal && (
        <NewEntryModal
          onClose={() => setShowModal(false)}
          onSave={handleEntrySaved}
        />
      )}

      {showAwareness && pendingEntry && (
        <AwarenessOverlay
          entry={pendingEntry}
          onSave={handleAwarenessSave}
          onClose={() => {
            setPendingEntry(null);
            setShowAwareness(false);
          }}
        />
      )}

      {selectedEntry && (
        <EntryExpandedView
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}
      <FloatingQuickActions onAdd={() => setShowModal(true)} />


    </section>
  );
}