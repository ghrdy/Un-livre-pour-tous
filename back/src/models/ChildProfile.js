import mongoose from "mongoose";

const childProfileSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  dateNaissance: Date,
  classeSuivie: String,
  noteObservation: String,
  photo: String, // URL or path to the photo
  status: String,
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("ChildProfile", childProfileSchema);
