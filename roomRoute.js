import express from "express";
import Room from "./room.js";
import protect from "./authMiddleware.js";

const router = express.Router();

router.post("/create", protect, async (req, res) => {
  const { name } = req.body;
  try {
    const room = await Room.create({ name, users: [req.user._id] });
    res.json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/join", protect, async (req, res) => {
  const { name } = req.body;
  const room = await Room.findOne({ name });
  if (room) {
    room.users.push(req.user._id);
    await room.save();
    res.json(room);
  } else {
    res.status(404).json({ error: "Room not found" });
  }
});

export default router;
