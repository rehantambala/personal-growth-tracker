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

  return (
    <div className="entries-grid">
      {entries.map(entry =>
        <EntryCard key={entry._id} entry={entry} />
      )}
    </div>
  );
}
