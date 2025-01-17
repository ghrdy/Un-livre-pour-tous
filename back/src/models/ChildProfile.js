import mongoose from "mongoose";

const childProfileSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  dateNaissance: {
    type: Date,
    required: true,
  },
  classeSuivie: {
    type: String,
    required: true,
  },
  noteObservation: {
    type: String,
  },
  photo: String, // URL or path to the photo
  status: {
    type: String,
    default: "possible",
  },
  hasLoan: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default mongoose.model("ChildProfile", childProfileSchema);
