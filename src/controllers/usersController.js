import User from "../models/User.js";

export const register = async (req, res, next) => {
  try {
    const { email, username } = req.body;

    const userFound = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (userFound?.email === email)
      return res.status(400).json({
        message: ["The email is already in use"],
      });

    if (userFound?.username === username)
      return res.status(400).json({
        message: ["The username is already in use"],
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
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const patchProfile = async (req, res, next) => {
  try {
    const userPatch = await User.findByIdAndUpdate(req.params.id, req.body);
    if (!userPatch) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User updated" });
  } catch (error) {
    next(error);
  }
};
