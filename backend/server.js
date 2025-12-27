// 🟢 First: Importing libraries
const express = require("express");
const cors = require("cors");
/*  “Hey Node, I want to use Express”
“Hey Node, I want to use CORS”
express → helps us create server & APIs
cors → allows frontend & backend to communicate
 Without these:
❌ we cannot create routes
❌ browser would block requests */

const mongoose = require("mongoose");


//🟢 Creating the server
const app = express();  
/*Think of this like:
Creating the brain of your backend app
All routes, APIs, logic, requests
will run inside this app object */

//This creates the server application object.
// Everything runs inside this.

// 🟢 Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/personal_growth_tracker", {
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    console.log("MongoDB connected successfully 🚀");
  })
  .catch(err => {
    console.error("MongoDB connection error ❌", err);
  });

  // 🟢 MongoDB Schema (Structure of our Entry)
/* const entrySchema = new mongoose.Schema({
  title: { type: String, required: true },
  note: { type: String, required: true },

  mood: {
    type: String,
    enum: ["happy","good","neutral","sad"],
    default: "neutral"
  },

  category: {
    type: String,
    default: "General"
  },

  type: {
    type: String,
    default: "Reflection"
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});
*/
// 🟢 MongoDB Schema (Structure of our Entry)
const entrySchema = new mongoose.Schema({
  title: { type: String, required: true },
  note:  { type: String, required: true },

  mood: {
    type: String,
    enum: ["happy","good","neutral","sad"],
    default: "neutral"
  },

  category: {
    type: String,
    default: "General"
  },

  type: {
    type: String,
    default: "Reflection"
  },

  // 🌱 Psychological Awareness Metadata (Optional)

  emotionTone: {
    type: String,
    default: null
  },

  cognitiveLens: {
    type: String,
    default: null
  },

  lifeContext: {
    type: String,
    default: null
  },

  growthPhase: {
    type: String,
    default: null   // reserved for future tracker
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

// 🟢 Model = Collection in DB
const Entry = mongoose.model("Entry", entrySchema);



//Middleware = Helpers that run before routes
app.use(cors());
app.use(express.json());
/*1️⃣ cors()
This allows:
✔ frontend (browser / React)
to talk to
✔ backend (this server)
Without this —
browser blocks API calls 🚫
2️⃣ express.json()
This allows backend to read request body.
Meaning:
When someone sends JSON like:*/


// temporary storage (will replace with DB later)
// let entries = [];


// test route
/* app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is running 🚀"

  });
}); */

// get all entries from MongoDB
app.get("/api/entries", async (req, res) => {
  try {
    const entries = await Entry.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: entries.length,
      entries
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch entries",
      error: err.message
    });
  }
});

// 🟢 Alias route (frontend can also call /entries)
app.get("/entries", async (req, res) => {
  try {
    const entries = await Entry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch entries",
      error: err.message
    });
  }
});



// add a new growth entry
/*app.post("/api/entries", (req, res) => {
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
}); */

//Validation - improved version of the above route(POST /api/entries)
/*app.post("/api/entries", (req, res) => {

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
});  */
app.post("/api/entries", async (req, res) => {
  try {
    const entry = await Entry.create({
      title: req.body.title,
      note: req.body.note,
      mood: req.body.mood || "neutral",
      category: req.body.category || "General",
      type: req.body.type || "Reflection"
    });

    res.json({
      success: true,
      message: "Entry saved",
      entry
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to save entry",
      error: err.message
    });
  }
});

// 🟢 Alias route for saving entry ( /entries )
app.post("/entries", async (req, res) => {
  try {
    const entry = await Entry.create({
      title: req.body.title,
      note: req.body.note,
      mood: req.body.mood || "neutral",
      category: req.body.category || "General",
      type: req.body.type || "Reflection"
    });

    res.json(entry);

  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to save entry",
      error: err.message
    });
  }
});



// get all entries
/* app.get("/api/entries", (req, res) => {
  res.json({
    count: entries.length,
    entries
  });
}); */


// delete an entry by id
/*app.delete("/api/entries/:id", (req, res) => {

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

}); */

// 🗑 Delete entry from MongoDB
app.delete("/api/entries/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await Entry.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Entry not found"
      });
    }

    res.json({
      success: true,
      message: "Entry deleted successfully 🗑",
      deleted
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to delete entry",
      error: err.message
    });
  }
});


// 🟢 Alias delete route (/entries/:id)
app.delete("/entries/:id", async (req, res) => {
  try {
    const deleted = await Entry.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Entry not found"
      });
    }

    res.json({
      success: true,
      message: "Entry deleted",
      deleted
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to delete entry",
      error: err.message
    });
  }
});

// update an entry
/*app.patch("/api/entries/:id", (req, res) => {

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
  /*if (!title && !note) {
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

});  */

// improved version of the above route (PATCH /api/entries/:id)
app.patch("/api/entries/:id", async (req, res) => {
  try {
    const { title, note } = req.body;

    // update only provided fields
    const entry = await Entry.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(note && { note }),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Entry not found"
      });
    }

    res.json({
      success: true,
      message: "Entry updated successfully",
      entry
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to update entry",
      error: err.message
    });
  }
});

// 🟢 Alias update route (/entries/:id)
/* app.patch("/entries/:id", async (req, res) => {
  try {
    const entry = await Entry.findByIdAndUpdate(
      req.params.id,
      {
        ...(req.body.title && { title: req.body.title }),
        ...(req.body.note && { note: req.body.note }),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Entry not found"
      });
    }

    res.json(entry);

  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to update entry",
      error: err.message
    });
  }
});  */
// improved version of the above route (PATCH /api/entries/:id)
app.patch("/api/entries/:id", async (req, res) => {
  try {

    // 🟢 Extract only allowed fields from request body
    const {
      title,
      note,

      // 🌱 Awareness metadata (optional)
      emotionTone,
      cognitiveLens,
      lifeContext,
      growthPhase
    } = req.body;


    // 🟢 Build update object dynamically
    // (only updates fields that are actually sent)
    const updateData = {

      // always refresh timestamp
      updatedAt: new Date(),

      // core reflection edits
      ...(title && { title }),
      ...(note  && { note  }),

      // awareness fields — nullable but not auto-emptying
      ...(emotionTone   !== undefined && { emotionTone }),
      ...(cognitiveLens !== undefined && { cognitiveLens }),
      ...(lifeContext   !== undefined && { lifeContext }),
      ...(growthPhase   !== undefined && { growthPhase })
    };


    // 🟢 Perform document update
    const entry = await Entry.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } // return updated document
    );


    // 🛑 If entry doesn't exist
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Entry not found"
      });
    }


    // 🟢 Success response
    res.json({
      success: true,
      message: "Entry updated successfully",
      entry
    });


  } catch (err) {

    // ❌ Error response
    res.status(400).json({
      success: false,
      message: "Failed to update entry",
      error: err.message
    });
  }
});


// start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
