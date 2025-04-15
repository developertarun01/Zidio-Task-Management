const express = require("express");
const router = express.Router();
const User = require("../models/userModel"); // Adjust path if needed
const { verifyToken, allowRoles } = require("../middleware/authMiddleware"); // If you have auth middleware

// GET /api/users/search?query=username
router.get("/search", verifyToken, allowRoles("admin", "manager"), async (req, res) => {
  try {
    const query = req.query.query || "";
    const regex = new RegExp(query, "i");

    const users = await User.find({
      $or: [{ username: regex }, { name: regex }, { email: regex }],
    })
      .select("username name email avatar") // assuming you have these fields
      .limit(10);

    res.json({ users });
  } catch (err) {
    console.error("User search failed:", err);
    res.status(500).json({ message: "Server Error" });
  }
});
// Add a new team member
router.post("/",verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const { username, email, role, password } = req.body;
    const newMember = new User({ username, email, role, password });
    await newMember.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ error: "Failed to add team member" });
  }
});

// Update a team member's details
router.put("/:id", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const { username, email, role, password } = req.body;
    const updatedMember = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role, password },
      { new: true }
    );
    res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ error: "Failed to update team member" });
  }
});

// Delete a team member
router.delete("/:id", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const deletedMember = await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Member deleted successfully", deletedMember });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete team member" });
  }
});

// Get all team members
router.get("/",verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const team = await User.find();
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch team members" });
  }
});

module.exports = router;
