import mongoose from "mongoose";

const roomSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Room = mongoose.model("Room", roomSchema);
export default Room;
