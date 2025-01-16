import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  image: {
    type: String,
    default: null,
  },
  nom: {
    type: String,
    required: true,
  },
  annee: {
    type: Number,
    required: true,
  },
  animateurs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  projet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    default: null,
  },
});

export default mongoose.model("Project", projectSchema);
