import mongoose from "mongoose";

const livreSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Book", livreSchema);
