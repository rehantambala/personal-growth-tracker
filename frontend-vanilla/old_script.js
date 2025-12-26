console.log("Frontend loaded");

const apiUrl = "http://localhost:4000/api/entries";

//✅ Step 1 — Call Backend API
async function loadEntries() {
  const res = await fetch(apiUrl);
   /* Meaning:
“Backend, give me all growth entries.”
This is called an HTTP Request.
It travels like:
Browser ➜ Backend Server*/

  const data = await res.json();

  /*Meaning:
“Hey backend, give me all entries from DB”
Backend reads from MongoDB
returns JSON like:*/

async function addEntry() {

  const title = document.getElementById("titleInput").value.trim();
  const note  = document.getElementById("noteInput").value.trim();

  if (!title || !note) {
    alert("Title & Note are required");
    return;
  }

  const res = await fetch("http://localhost:4000/api/entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, note })
  });
  await fetch("http://localhost:4000/api/entries", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title, note })
});

titleInput.value = "";
noteInput.value = "";

// 🔥 Refresh entries on screen
fetchEntries();


  const data = await res.json();

  if (data.success) {

    // clear inputs
    document.getElementById("titleInput").value = "";
    document.getElementById("noteInput").value  = "";

    // reload entries list
    fetchEntries();
  }
}




  console.log("Fetched entries:", data);

  //✅ Step 2 — Select The Container
  const container = document.getElementById("entries");
  container.innerHTML = "";
  /*This grabs:
<div id="entries"></div>
We will add cards inside it.*/ 

//✅ Step 3 — Loop & Generate Cards
  data.entries.forEach(entry => {
    const div = document.createElement("div");
    div.className = "entry";

    div.innerHTML = `
      <h3>${entry.title}</h3>
      <p>${entry.note}</p>
      <small>${new Date(entry.createdAt).toLocaleString()}</small>
    `;

    container.appendChild(div);
  });
}

loadEntries();
