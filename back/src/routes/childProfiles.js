import express from "express";
import ChildProfile from "../models/ChildProfile.js";
import upload from "../middleware/imageUpload.js";
import authToken from "../middleware/authToken.js";

const router = express.Router();

// Middleware to check if the user has permission to manage child profiles
const canManageChildProfiles = (req, res, next) => {
  const { role } = req.user;
  if (role === "admin" || role === "referent" || role === "simple") {
    next();
  } else {
    res.status(403).json({ message: "Access denied (canManageChild)" });
  }
};

// Protected routes (authentication required)
router.use(authToken);

// Create a new child profile
router.post("/", canManageChildProfiles, upload, async (req, res) => {
  const {
    nom,
    prenom,
    dateNaissance,
    classeSuivie,
    noteObservation,
    parentId,
    status,
  } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;
  const newChildProfile = new ChildProfile({
    nom,
    prenom,
    dateNaissance,
    classeSuivie,
    noteObservation,
    photo,
    parentId,
    status,
  });
  try {
    const savedChildProfile = await newChildProfile.save();
    res.status(201).json(savedChildProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all child profiles
router.get("/", canManageChildProfiles, async (req, res) => {
  try {
    const childProfiles = await ChildProfile.find();
    res.json(childProfiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single child profile
router.get("/:id", canManageChildProfiles, async (req, res) => {
  try {
    const childProfile = await ChildProfile.findById(req.params.id);
    if (childProfile) {
      res.json(childProfile);
    } else {
      res.status(404).json({ message: "Child profile not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a child profile
router.put("/:id", canManageChildProfiles, upload, async (req, res) => {
  const {
    nom,
    prenom,
    dateNaissance,
    classeSuivie,
    noteObservation,
    parentId,
    status,
  } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : undefined;
  try {
    const updateData = {
      nom,
      prenom,
      dateNaissance,
      classeSuivie,
      noteObservation,
      parentId,
      status,
    };

    if (photo) {
      updateData.photo = photo;
    }

    // Remove undefined values
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedChildProfile = await ChildProfile.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (updatedChildProfile) {
      res.json(updatedChildProfile);
    } else {
      res.status(404).json({ message: "Child profile not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a child profile
router.delete("/:id", canManageChildProfiles, async (req, res) => {
  try {
    const deletedChildProfile = await ChildProfile.findByIdAndDelete(
      req.params.id
    );
    if (deletedChildProfile) {
      res.json({ message: "Child profile deleted" });
    } else {
      res.status(404).json({ message: "Child profile not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
