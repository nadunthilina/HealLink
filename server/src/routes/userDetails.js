import express from "express";
import UserDetails from "../models/userDetails.js";
import User from "../models/User.js";


const router = express.Router();

// CREATE or UPDATE caretaker details
router.post("/save", async (req, res) => {
  try {
    const {
      userId,
      name,
      email,
      phone,
      address,
      specialization,
      experience,
      license,
      emergencyContact,
    } = req.body;

    // Check user exists
    const userExists = await User.findById(userId);
    if (!userExists)
      return res.status(404).json({ message: "User not found" });

    // Upsert (create if new, update if exists)
    const updated = await UserDetails.findOneAndUpdate(
      { userId }, // search using logged user id
      {
        name,
        email,
        phone,
        address,
        specialization,
        experience,
        license,
        emergencyContact,
      },
      { new: true, upsert: true } // KEY PART
    );

    res.status(200).json({
      message: "Details saved successfully",
      details: updated,
    });

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
