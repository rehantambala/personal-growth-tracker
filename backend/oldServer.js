// temporary storage (will replace with DB later)
 let entries = [];

 // test route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is running 🚀"

  });
}); 

// add a new growth entry
app.post("/api/entries", (req, res) => {
  const entry = {
    id: Date.now(),
    title: req.body.title,
    note: req.body.note,
    createdAt: new Date()
  };

  entries.push(entry);

  res.json({
    success: true,
    message: "Entry saved successfully",
    entry
  });
}); 

//Validation - improved version of the above route(POST /api/entries)
app.post("/api/entries", (req, res) => {

  const title = (req.body.title || "").trim();
  const note = (req.body.note || "").trim();

  // validation
  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Title is required"
    });
  }

  if (!note) {
    return res.status(400).json({
      success: false,
      message: "Note is required"
    });
  }

  // create entry
  const entry = {
    id: Date.now(),
    title,
    note,
    createdAt: new Date()
  };
  // save entry
  entries.push(entry);
// send response(Success)
  res.json({
    success: true,
    message: "Entry saved successfully",
    entry
  });
});  

// delete an entry by id
app.delete("/api/entries/:id", (req, res) => {

//🔹 Get id from URL
  const id = Number(req.params.id);

//🔹 Find entry in list
  const index = entries.findIndex(e => e.id === id);

//🔹 If entry doesn’t exist
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Entry not found"
    });
  }

//🔹 Otherwise delete entry
  const deleted = entries.splice(index, 1)[0];

//🔹 Send response back
  res.json({
    success: true,
    message: "Entry deleted successfully",
    deleted
  });

}); 

// update an entry
app.patch("/api/entries/:id", (req, res) => {

//🔹 Get id from URL
  const id = Number(req.params.id);
//🔹 Find entry
  const entry = entries.find(e => e.id === id);
//If not found
  if (!entry) {
    return res.status(404).json({
      success: false,
      message: "Entry not found"
    });
  }
//🔹 Read new values
  const title = req.body.title?.trim();
  const note  = req.body.note?.trim(); 
  /* The ?. means:
if value exists → use it
if not → ignore safely */

//🔹 If request contains nothing to update
  // if both fields missing
  if (!title && !note) {
    return res.status(400).json({
      success: false,
      message: "Nothing to update"
    });
  }
//🔹 Update only provided fields
  if (title) entry.title = title;
  if (note)  entry.note  = note;
//🔹 Add timestamp
  entry.updatedAt = new Date();
//🔹 Send response
  res.json({
    success: true,
    message: "Entry updated successfully",
    entry
  });

});  

// get all entries
app.get("/api/entries", (req, res) => {
  res.json({
    count: entries.length,
    entries
  });
}); 