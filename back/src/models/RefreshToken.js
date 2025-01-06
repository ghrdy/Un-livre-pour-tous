import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  token: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now, expires: "6h" }, // Tokens expire after 6 hours
});

export default mongoose.model("RefreshToken", refreshTokenSchema);
