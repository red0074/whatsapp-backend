import express from "express";
import jwt from "jsonwebtoken";
import User from "./user.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({ username, password });
    const token = jwt.sign({ id: user._id }, "ilovedeath", {
      expiresIn: "30d",
    });
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ id: user._id }, "ilovedeath", {
      expiresIn: "30d",
    });
    res.json({ token, user: { id: user._id, username: user.username } });
  } else {
    res.status(400).json({ error: "Invalid credentials" });
  }
});

export default router;
