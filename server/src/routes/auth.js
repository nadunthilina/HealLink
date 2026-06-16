import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import Patient from "../models/Patient.js";
import Caretaker from "../models/Caretaker.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";

function signTokens(user) {
  const payload = {
    sub: user._id.toString(),
    role: user.role,
    name: user.name,
  };
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ sub: payload.sub }, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, age, gender } = req.body;
    const role = "patient"; // Only patient registration is allowed from public signup

    if (!name || !email || !password || !age || !gender)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, passwordHash, role });

    // Generate PAT- ID
    const lastPatient = await Patient.findOne({ patientId: { $exists: true, $ne: null } }).sort({ patientId: -1 })
    let newIdNum = 1
    if (lastPatient && lastPatient.patientId) {
      const match = lastPatient.patientId.match(/PAT-(\d+)/)
      if (match) newIdNum = parseInt(match[1]) + 1
    }
    const patientId = `PAT-${newIdNum.toString().padStart(8, '0')}`

    try {
      await Patient.create({
        patientId,
        name,
        email,
        phone,
        age: Number(age),
        gender,
        userId: user._id,
        status: 'active'
      });
    } catch (err) {
      await User.findByIdAndDelete(user._id);
      throw err;
    }

    const tokens = signTokens(user);

    res
      .status(201)
      .json({ user: { id: user._id, name, email, role }, ...tokens });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (user.status !== 'active')
      return res.status(403).json({ message: 'Account inactive. Contact admin.' });

    if (!user.passwordHash) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });


    // Create access + refresh tokens
    const tokens = signTokens(user);

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ message: "Missing refreshToken" });
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const user = await User.findById(decoded.sub);
    if (!user) return res.status(401).json({ message: "Invalid token" });
    const tokens = signTokens(user);
    res.json(tokens);
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// ✅ Get user details by ID
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name email phone");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Verify token and get current user
router.get("/verify", async (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) {
      return res
        .status(401)
        .json({ authenticated: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.sub).select(
      "name email role status"
    );

    if (!user) {
      return res
        .status(404)
        .json({ authenticated: false, message: "User not found" });
    }

    if (user.status !== "active") {
      return res
        .status(403)
        .json({ authenticated: false, message: "Account inactive" });
    }

    res.json({
      authenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({
          authenticated: false,
          expired: true,
          message: "Token expired",
        });
    }
    return res
      .status(401)
      .json({ authenticated: false, message: "Invalid token" });
  }
});

// ✅ Verify password for Sudo Mode
router.post("/verify-password", requireAuth(), async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const ownerPassword = process.env.OWNER_PASSWORD || "Owner@HealLink2026";
    if (password !== ownerPassword) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.json({ success: true, message: "Password verified" });
  } catch (error) {
    console.error("Password verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
