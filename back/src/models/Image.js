import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: String,
});

export default mongoose.model("Image", imageSchema);
