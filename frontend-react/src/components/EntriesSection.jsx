import React, { useState, useEffect } from "react";
import EntryCard from "./EntryCard";
import NewEntryModal from "./NewEntryModal";
import "../styles/entries.css";
import { saveEntryToBackend } from "../api/entriesApi";
import EntryExpandedView from "./EntryExpandedView";
import { fetchEntriesFromBackend } from "../api/entriesApi";


export default function EntriesSection({ entries = [], loading }) {

  // Local reflections added by user (temporary until DB save)
  const [localEntries, setLocalEntries] = useState([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Merge backend + local state
  const allEntries = [...localEntries, ...entries];

  const [selectedEntry, setSelectedEntry] = useState(null);


  // When backend loads fresh data, keep local ones on top
  useEffect(() => {
    // prevents duplicates if page refresh happens later
  }, [entries]);

 const handleAddEntry = async (entry) => {

  // 1) Add instantly to UI
  const tempId = Date.now();
  const tempEntry = { ...entry, _id: tempId, temp: true };

  setLocalEntries(prev => [tempEntry, ...prev]);

  // 2) Try saving to backend
  const saved = await saveEntryToBackend(entry);

  // 3) If backend responded — replace local copy
  if (saved?._id) {
    setLocalEntries(prev =>
      prev.map(e => e._id === tempId ? saved : e)
    );
  }

  
  // 4) If failed — keep local safely (no UX break)
};



  return (
    <section className="entries-wrapper">

      <div className="entries-header-row">

        <div>
          <h2 className="section-heading">Your Reflections</h2>
          <p className="section-sub">
            A quiet archive of thoughts — held without noise or judgment.
          </p>
        </div>

        <button
          className="new-entry-btn"
          onClick={() => setIsModalOpen(true)}
        >
          + New Reflection
        </button>

      </div>

      {/* Loading */}
      {loading && (
        <div className="entries-loading">
          <div className="loader-ring" />
          <span>Listening to your memories…</span>
        </div>
      )}

      {/* Empty */}
      {!loading && allEntries.length === 0 && (
        <div className="empty-note">
          No reflections yet — your journey begins here.
        </div>
      )}

      {/* Entries */}
      {!loading && allEntries.length > 0 && (
        <div className="entries-grid">
         {allEntries.map((entry, i) => (
  <EntryCard
    key={i}
    entry={entry}
    onClick={() => setSelectedEntry(entry)}
  />
))}

        </div>
      )}
      

      {/* Modal */}
      <NewEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddEntry}
      />
<EntryExpandedView
  entry={selectedEntry}
  onClose={() => setSelectedEntry(null)}
/>

      
    </section>
  );
}
