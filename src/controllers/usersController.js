import { User } from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { email, username } = req.body;

    const userFoundE = await User.findOne({ email });
    const userFoundU = await User.findOne({ username });

    if (userFoundE)
      return res.status(400).json({
        message: "The email is already in use",
      });

    if (userFoundU)
      return res.status(400).json({
        message: "The username is already in use",
      });

    const newUser = new User(req.body);
    await newUser.encryptPassword();
    const userSaved = await newUser.save();

    const token = await userSaved.generateToken();

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

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const patchProfile = async (req, res) => {
  try {
    const userPatch = await User.findByIdAndUpdate(req.params.id, req.body);
    if (!userPatch) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
