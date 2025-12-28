import { useEffect, useState } from "react";
import EntryCard from "./EntryCard";
const API_URL = "http://localhost:4000/api/entries";

export default function EntriesList() {

  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        console.log("API response:", data);
        setEntries(data.entries || []);
      })
      .catch(err => console.log("Fetch error:", err));
  }, []);

  // 🎯 NEW: Function to update a single entry in the list
  function updateEntryInList(updatedEntry) {
    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry._id === updatedEntry._id ? updatedEntry : entry
      )
    );
  }

  return (
    <div className="entries-grid">
      {entries.map(entry =>
        <EntryCard 
          key={entry._id} 
          entry={entry}
          onEntryUpdate={updateEntryInList}  // 🎯 Pass update function down
        />
      )}
    </div>
  );
}