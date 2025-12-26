console.log("Frontend loaded");

const apiUrl = "http://localhost:4000/api/entries";

function showToast(message, color = "#4ade80") {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.style.display = "block";
  toast.style.borderColor = color;

  setTimeout(() => toast.style.display = "none", 1800);
}

/* -------------------
   SKELETON LOADER
--------------------*/
function showSkeletons() {
  const container = document.getElementById("entries");
  container.innerHTML = `
    <div class="skeleton"></div>
    <div class="skeleton"></div>
    <div class="skeleton"></div>
  `;
}

/* -------------------
   LOAD ENTRIES
--------------------*/
async function loadEntries() {

  showSkeletons();   // prevents glitch

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    let entries = [...data.entries];

    const container = document.getElementById("entries");

    if (!entries.length) {
      container.innerHTML = `
        <p style="opacity:0.7">
          ✨ No entries yet — start your growth journey!
        </p>
      `;
      return;
    }

    /* SORT */
    const sortType = document.getElementById("sortSelect").value;
    if (sortType === "oldest") entries = entries.reverse();

    /* SEARCH */
    const search = document.getElementById("searchInput").value.toLowerCase();
    entries = entries.filter(e =>
      e.title.toLowerCase().includes(search) ||
      e.note.toLowerCase().includes(search)
    );

    if (!entries.length) {
      container.innerHTML = `<p style="opacity:.7">🔎 No matching entries</p>`;
      return;
    }

    /* CLEAR SKELETONS BEFORE RENDER */
    container.innerHTML = "";

    /* RENDER */
    entries.forEach(entry => {
      const div = document.createElement("div");
      div.className = "entry";
const moodEmoji = {
  happy: "😄",
  good: "🙂",
  neutral: "😐",
  sad: "😞"
}[entry.mood || "neutral"];

      div.innerHTML = `
        <h3>${moodEmoji}${entry.title}</h3>
        <p>${entry.note}</p>
        <small>${new Date(entry.createdAt).toLocaleString()}</small>

        <div class="actions">
          <button onclick="editEntry('${entry._id}', '${entry.title}', '${entry.note}')">
            ✏️ Edit
          </button>

          <button onclick="deleteEntry('${entry._id}')">
            🗑 Delete
          </button>
        </div>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    document.getElementById("entries").innerHTML = `<p>❌ Failed to load entries</p>`;
    showToast("Server unreachable ❌", "#f87171");
  }
}

/* -------------------
   ADD ENTRY
--------------------*/
async function addEntry() {

  const title = titleInput.value.trim();
  const note  = noteInput.value.trim();
  const mood  = moodInput.value;

  if (!title || !note) return showToast("Title & Note required ⚠️", "#f87171");

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, note, mood })
  });

  const data = await res.json();

  if (data.success) {
    titleInput.value = "";
    noteInput.value = "";
    moodInput.value = "neutral";

    loadEntries();
    showToast("Entry added ✔️");
  }
}


/* -------------------
   DELETE
--------------------*/
async function deleteEntry(id) {

  if (!confirm("Delete this entry?")) return;

  try {
    const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      loadEntries();
      showToast("Entry deleted 🗑");
    }

  } catch {
    showToast("Delete failed ❌", "#f87171");
  }
}

/* -------------------
   EDIT
--------------------*/
async function editEntry(id, oldTitle, oldNote) {

  const title = prompt("Edit Title", oldTitle);
  const note  = prompt("Edit Note", oldNote);

  if (!title || !note) return;

  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, note })
    });

    const data = await res.json();

    if (data.success) {
      loadEntries();
      showToast("Entry updated ✏️");
    }

  } catch {
    showToast("Update failed ❌", "#f87171");
  }
}

/* Run on page load */
loadEntries();

let editingId = null;

function editEntry(id, title, note) {

  editingId = id;

  document.getElementById("editTitle").value = title;
  document.getElementById("editNote").value  = note;

  document.getElementById("editModal").style.display = "flex";
}

function closeEdit() {
  document.getElementById("editModal").style.display = "none";
}
async function saveEdit() {

  const title = editTitle.value.trim();
  const note  = editNote.value.trim();

  if (!title || !note)
    return showToast("Title & Note required ⚠️", "#f87171");

  const res = await fetch(`${apiUrl}/${editingId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, note })
  });

  const data = await res.json();

  if (data.success) {
    closeEdit();
    loadEntries();
    showToast("Entry updated ✏️");
  }
}

let deleteId = null;

function deleteEntry(id) {
  deleteId = id;
  document.getElementById("deleteModal").style.display = "flex";
}

function closeDelete() {
  document.getElementById("deleteModal").style.display = "none";
}
async function confirmDelete() {

  const res = await fetch(`${apiUrl}/${deleteId}`, {
    method: "DELETE"
  });

  const data = await res.json();

  if (data.success) {
    closeDelete();
    loadEntries();
    showToast("Entry deleted 🗑");
  }
}
