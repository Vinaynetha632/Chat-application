import express from "express";
import {
  register,
  login,
  logout,
  getMe,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";
import { changePassword } from "../controllers/authController.js";
import { updateProfile } from "../controllers/authController.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.put("/change-password", protect, changePassword);
router.put("/update-profile", protect, updateProfile);

export default router;
