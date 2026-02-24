import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";


// REGISTER
export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword
    });

    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LOGOUT
export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({ message: "Logged out successfully" });
};


// GET CURRENT USER
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findById(req.user);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { fullName, status, profilePic } = req.body;

    const user = await User.findById(req.user);

    if (fullName) user.fullName = fullName;
    if (status) user.status = status;
    if (profilePic) user.profilePic = profilePic;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      status: updatedUser.status,
      profilePic: updatedUser.profilePic
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};