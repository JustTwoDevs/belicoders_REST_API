import User from "../models/User.js";
import { createAccessToken } from "./jwts.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { password, email, username } = req.body;

    const userFoundE = await User.findOne({ email });
    const userFoundU = await User.findOne({ username });

    if (userFoundE)
      return res.status(400).json({
        message: ["The email is already in use"],
      });

    if (userFoundU)
      return res.status(400).json({
        message: ["The username is already in use"],
      });

    const passwordHash = await bcrypt.hash(password, 10);

    req.body.password = passwordHash;

    const newUser = new User(req.body);
    const userSaved = await newUser.save();

    const token = await createAccessToken({
      id: userSaved._id,
    });

    res.cookie("token", token, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
    });

    res.status(201).json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
