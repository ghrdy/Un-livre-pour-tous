import express from "express";
import Image from "../models/Image.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import authToken from "../middleware/authToken.js";
import imageUpload from "../middleware/imageUpload.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

// Protected routes (authentication required)
router.use(authToken);

// Obtenir le répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const currentDir = path.dirname(__filename);

// Route pour récupérer une image par son nom de fichier
router.get("/:filename", async (req, res) => {
  const imagePath = path.join(currentDir, "../../uploads", req.params.filename);
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ message: "Image not found" });
  }
});

// Route pour l'upload d'images
router.post("/", imageUpload, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier envoyé" });
  }

  try {
    const filePath = `/uploads/${req.file.filename}`;
    const newImage = new Image({ url: filePath });
    await newImage.save();

    res
      .status(200)
      .json({ message: "Image uploadée avec succès!", url: filePath });
  } catch (dbError) {
    res
      .status(500)
      .json({ error: "Erreur lors de la sauvegarde dans la base de données" });
  }
});

// Route pour récupérer les images existantes
router.get("/", (req, res) => {
  const directoryPath = path.join(currentDir, "../../uploads");
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan files");
    }
    res.send(files);
  });
});

// Route pour supprimer une image par son URL
router.delete("/:url", isAdmin, async (req, res) => {
  const url = `/uploads/${req.params.url}`;
  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  try {
    const image = await Image.findOneAndDelete({ url });
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    const imagePath = path.join(currentDir, "../../", url);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.json({ message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;