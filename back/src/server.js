import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/users.js";
import projectRoutes from "./routes/projects.js";
import childProfileRoutes from "./routes/childProfiles.js";
import bookLoanRoutes from "./routes/bookLoans.js";
import bookRoutes from "./routes/books.js";
import uploadRoutes from "./routes/upload.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import authenticateToken from "./middleware/authToken.js";

import createAdmin from "../createAdmin.js"; // Assurez-vous que le chemin est correct

const app = express();
const port = 5001;

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000", // Origine autorisée
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Méthodes autorisées
    credentials: true, // Autorise les cookies et les identifiants
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["set-cookie"],
  })
);

// Handle preflight requests
app.options("*", cors());

// Create uploads directory if it doesn't exist
import fs from "fs";
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Protected route for serving static files from the uploads directory
app.use(
  "/uploads",
  authenticateToken,
  express.static(path.join(__dirname, "../uploads"))
);

// MongoDB connection
mongoose.connect("mongodb://mongo:27017");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  console.log("Connected to MongoDB");
  await createAdmin();
});

app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/childProfiles", childProfileRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/bookLoans", bookLoanRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
