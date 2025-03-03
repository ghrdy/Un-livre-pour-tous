import express from "express";
import Project from "../models/Project.js";
import User from "../models/User.js";
import Book from "../models/Book.js";
import ChildProfile from "../models/ChildProfile.js";
import authToken from "../middleware/authToken.js";
import isAdmin from "../middleware/isAdmin.js";
import upload from "../middleware/imageUpload.js";

const router = express.Router();

// Protected routes (authentication required)
router.use(authToken);

// Create a new project
router.post("/", isAdmin, upload, async (req, res) => {
  try {
    const { nom, annee, description, animateurs, books, children } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newProject = new Project({
      image,
      nom,
      annee,
      description,
      animateurs: animateurs ? JSON.parse(animateurs) : [],
      books: books ? JSON.parse(books) : [],
      children: children ? JSON.parse(children) : [],
    });

    const savedProject = await newProject.save();
    
    // Update users associated with this project
    if (animateurs && JSON.parse(animateurs).length > 0) {
      await User.updateMany(
        { _id: { $in: JSON.parse(animateurs) } },
        { $set: { projet: savedProject._id } }
      );
    }
    
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single project
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("animateurs")
      .populate("books")
      .populate("children");
    
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a project
router.put("/:id", isAdmin, upload, async (req, res) => {
  try {
    const { nom, annee, description, animateurs, books, children } = req.body;
    const updateData = {
      nom,
      annee,
      description,
      animateurs: animateurs ? JSON.parse(animateurs) : undefined,
      books: books ? JSON.parse(books) : undefined,
      children: children ? JSON.parse(children) : undefined,
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Remove undefined values
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (updatedProject) {
      // Update users associated with this project
      if (animateurs) {
        const animateursArray = JSON.parse(animateurs);
        
        // Remove project reference from users no longer associated
        await User.updateMany(
          { projet: req.params.id, _id: { $nin: animateursArray } },
          { $set: { projet: null } }
        );
        
        // Add project reference to newly associated users
        await User.updateMany(
          { _id: { $in: animateursArray } },
          { $set: { projet: req.params.id } }
        );
      }
      
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a project
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (deletedProject) {
      // Remove project reference from associated users
      await User.updateMany(
        { projet: req.params.id },
        { $set: { projet: null } }
      );
      
      res.json({ message: "Project deleted" });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add books to a project
router.post("/:id/books", isAdmin, async (req, res) => {
  try {
    const { bookIds } = req.body;
    
    if (!bookIds || !Array.isArray(bookIds)) {
      return res.status(400).json({ message: "Book IDs are required" });
    }
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    // Add books to project
    project.books = [...new Set([...project.books, ...bookIds])];
    await project.save();
    
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove books from a project
router.delete("/:id/books", isAdmin, async (req, res) => {
  try {
    const { bookIds } = req.body;
    
    if (!bookIds || !Array.isArray(bookIds)) {
      return res.status(400).json({ message: "Book IDs are required" });
    }
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    // Remove books from project
    project.books = project.books.filter(
      (bookId) => !bookIds.includes(bookId.toString())
    );
    await project.save();
    
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add children to a project
router.post("/:id/children", isAdmin, async (req, res) => {
  try {
    const { childIds } = req.body;
    
    if (!childIds || !Array.isArray(childIds)) {
      return res.status(400).json({ message: "Child IDs are required" });
    }
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    // Add children to project
    project.children = [...new Set([...project.children, ...childIds])];
    await project.save();
    
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove children from a project
router.delete("/:id/children", isAdmin, async (req, res) => {
  try {
    const { childIds } = req.body;
    
    if (!childIds || !Array.isArray(childIds)) {
      return res.status(400).json({ message: "Child IDs are required" });
    }
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    // Remove children from project
    project.children = project.children.filter(
      (childId) => !childIds.includes(childId.toString())
    );
    await project.save();
    
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all books for a project
router.get("/:id/books", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("books");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json(project.books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all children for a project
router.get("/:id/children", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("children");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json(project.children);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users (animateurs) for a project
router.get("/:id/users", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("animateurs");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json(project.animateurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;