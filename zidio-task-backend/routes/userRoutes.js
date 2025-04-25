const express = require("express");
const router = express.Router();
const User = require("../models/userModel"); // Adjust path if needed
const { verifyToken, allowRoles } = require("../middleware/authMiddleware"); // If you have auth middleware
const multer = require("multer");
const upload = require("../middleware/cloudinaryUpload");
const Submit = require("../models/submit");

router.put(
  "/update-profile",
  verifyToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found." });

      const { phone, location, birthday, bio } = req.body;

      user.phone = phone ?? user.phone;
      user.location = location ?? user.location;
      user.birthday = birthday ?? user.birthday;
      user.bio = bio ?? user.bio;

      if (req.file && req.file.path) {
        user.avatar = req.file.path; // or cloudinary URL
      }

      await user.save();

      res.json({
        message: "Profile updated successfully",
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          phone: user.phone,
          location: user.location,
          birthday: user.birthday,
          bio: user.bio,
          role: user.role,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong." });
    }
  }
);

// GET /api/users/search?query=username
router.get(
  "/search",
  verifyToken,
  allowRoles("admin", "manager"),
  async (req, res) => {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    try {
      const users = await User.find({
        username: { $regex: query, $options: "i" },
      }).select("username avatar name");

      res.json({ users }); // ✅ Return as an array under `users`
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Add a new team member
router.post("/", verifyToken, allowRoles("admin"), async (req, res) => {
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

router.put("/change-password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword, updatedPassword } = req.body;

    console.log("Body received:", req.body);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(updatedPassword, 10);
    await user.save();

    return res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error in change-password route:", err);
    return res.status(500).json({ message: err.message || "Server error" });
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
router.get("/", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const team = await User.find();
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch team members" });
  }
});
router.post("/submit", async (req, res) => {
  const { name, email } = req.body;
  const iSubmit = new Submit({ name, email });
  await iSubmit.save();
  // submit= new Submit(req.body)
});

module.exports = router;
