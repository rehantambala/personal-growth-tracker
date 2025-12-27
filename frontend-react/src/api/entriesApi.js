const API_BASE = "http://localhost:5000"; // change later if deployed

export async function saveEntryToBackend(entry) {
  try {
    const res = await fetch(`${API_BASE}/entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    });

    if (!res.ok) throw new Error("Server rejected request");

    return await res.json();

  } catch (err) {
    console.warn("Backend save failed — keeping local copy", err);
    return null; // fail gracefully
  }
}
export async function fetchEntriesFromBackend() {
  try {
    const res = await fetch("http://localhost:5000/entries");

    if (!res.ok) throw new Error("Fetch failed");

    return await res.json();

  } catch (err) {
    console.warn("Could not load entries — offline mode", err);
    return [];
  }
}
