import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: String,
  password: String,
  projet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    default: null,
  },
  role: {
    type: String,
    enum: ["admin", "referent", "simple"],
    default: "simple",
  },
  validated: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("User", userSchema);
