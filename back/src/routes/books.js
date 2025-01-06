import express from "express";
import Book from "../models/Book.js";
import authToken from "../middleware/authToken.js";
import isAdmin from "../middleware/isAdmin.js";
import imageUpload from "../middleware/imageUpload.js";

const router = express.Router();

// Protected routes (authentication required)
router.use(authToken);

// Create a new book
router.post("/", isAdmin, imageUpload, async (req, res) => {
  const { titre } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;

  const newLivre = new Book({
    titre,
    photo,
  });

  try {
    const savedLivre = await newLivre.save();
    res.status(201).json(savedLivre);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all books
router.get("/", async (req, res) => {
  try {
    const livres = await Book.find();
    res.json(livres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single book
router.get("/:id", async (req, res) => {
  try {
    const livre = await Book.findById(req.params.id);
    if (livre) {
      res.json(livre);
    } else {
      res.status(404).json({ message: "Livre non trouvé" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a book
router.put("/:id", isAdmin, imageUpload, async (req, res) => {
  const { titre } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const updateData = { titre };
    if (photo) {
      updateData.photo = photo;
    }

    const updatedLivre = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (updatedLivre) {
      res.json(updatedLivre);
    } else {
      res.status(404).json({ message: "Livre not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a book
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const deletedLivre = await Book.findByIdAndDelete(req.params.id);
    if (deletedLivre) {
      res.json({ message: "Livre supprimé" });
    } else {
      res.status(404).json({ message: "Livre introuvable" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
