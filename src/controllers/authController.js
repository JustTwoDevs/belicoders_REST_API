import { User } from "../models/User.js";

export const login = async (req, res) => {
  try {
    const { password, username, email } = req.body;
    const userFound = username
      ? await User.findOne({ username })
      : email
      ? await User.findOne({ email })
      : null;

    if (!userFound)
      return res.status(400).json({
        message: ["The username or email is incorrect"],
      });

    const isMatch = await userFound.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: ["The password is incorrect"],
      });
    }

    const token = await userFound.generateToken();

    res.cookie("token", token, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
    });

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};
