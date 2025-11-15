import express from "express";
import UserDetails from "../models/userDetails.js";
import User from "../models/User.js";


const router = express.Router();

// Save user details
router.post("/save", async (req, res) => {
  try {
    const { userId, name, email, phone, address, specialization, experience, license, emergencyContact } = req.body;

    // check user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) return res.status(404).json({ message: "User not found" });

    // save details
    const details = new UserDetails({
      userId,
      name,
      email,
      phone,
      address,
      specialization,
      experience,
      license,
      emergencyContact,
    });

    await details.save();
    res.status(201).json({ message: "User details saved successfully", details });
  } catch (error) {
    console.error("Error saving user details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/details/:userId", async (req, res) => {
  try {
    const details = await UserDetails.findOne({ userId: req.params.userId });
    res.json(details);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
