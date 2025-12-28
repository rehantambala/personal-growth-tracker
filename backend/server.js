// 🟢 First: Importing libraries
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

/* express → creates backend server & routes
   cors → allows frontend to communicate with backend */

const app = express();  // 🧠 Main backend application object


// 🟢 Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/personal_growth_tracker", {
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log("MongoDB connected successfully 🚀"))
.catch(err => console.error("MongoDB connection error ❌", err));



// 🟢 MongoDB Schema — Structure of each reflection entry
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

  // 🌱 Psychological Awareness Metadata (optional)
  emotionTone:   { type: String, default: null },
  cognitiveLens: { type: String, default: null },
  lifeContext:   { type: String, default: null },
  growthPhase:   { type: String, default: null }, // reserved for tracker phase

  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});


// 🟢 Model = MongoDB collection
const Entry = mongoose.model("Entry", entrySchema);



// 🟢 Middleware
app.use(cors());         // allow frontend → backend communication
app.use(express.json()); // allow backend to read JSON bodies



// 🟢 Get all entries (Sorted newest first)
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

// Alias route (frontend can also call /entries)
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



// 🟢 Add a new reflection entry
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

// Alias create route
app.post("/entries", async (req, res) => {
  try {
    const entry = await Entry.create(req.body);
    res.json(entry);

  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to save entry",
      error: err.message
    });
  }
});



// 🟢 Delete entry
app.delete("/api/entries/:id", async (req, res) => {
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



// 🟢 Update reflection (core fields + awareness metadata)
app.patch("/api/entries/:id", async (req, res) => {
  try {

    // Only update fields that are actually provided
    const {
      title,
      note,
      emotionTone,
      cognitiveLens,
      lifeContext,
      growthPhase
    } = req.body;

    const updateData = {
      updatedAt: new Date(),

      ...(title && { title }),
      ...(note && { note }),

      // awareness values — nullable but intentionally set
      ...(emotionTone   !== undefined && { emotionTone }),
      ...(cognitiveLens !== undefined && { cognitiveLens }),
      ...(lifeContext   !== undefined && { lifeContext }),
      ...(growthPhase   !== undefined && { growthPhase })
    };

    const entry = await Entry.findByIdAndUpdate(
      req.params.id,
      updateData,
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



// 🟢 Awareness — Dedicated Save Route
// (Triggered ONLY when user confirms overlay)
app.patch("/api/entries/:id/awareness", async (req, res) => {
  try {

    const entry = await Entry.findByIdAndUpdate(
      req.params.id,
      {
        emotionTone:   req.body.emotionTone || null,
        cognitiveLens: req.body.cognitiveLens || null,
        lifeContext:   req.body.lifeContext || null,
        growthPhase:   req.body.growthPhase || null,
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
      message: "Awareness saved",
      entry
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Awareness update failed",
      error: err.message
    });
  }
});



// 🟢 Start backend server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
