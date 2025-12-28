const API_BASE = "http://localhost:4000";

export async function fetchEntriesFromBackend() {
  try {
    const res = await fetch(`${API_BASE}/entries`);
    return await res.json();
  } catch (err) {
    console.error("Fetch entries failed", err);
    return [];
  }
}

export async function saveEntryToBackend(entry) {
  try {
    const res = await fetch(`${API_BASE}/entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    });

    return await res.json();
  } catch (err) {
    console.error("Save entry failed", err);
    return null;
  }
}

export async function updateEntryInBackend(id, data) {
  try {
    const res = await fetch(`${API_BASE}/entries/${id}/awareness`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    return await res.json();
  } catch (err) {
    console.error("Awareness update failed", err);
    return null;
  }
}
