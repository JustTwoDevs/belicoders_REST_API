import User from "#models/User.js";
import Rival ,{ States } from "#models/Rival.js";
import Contest from "#models/Contest.js";

export const register = async (req, res, next) => {
  try {
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
  
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: res.error });
    next(error);
  }
};

export const getProfileById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const patchProfile = async (req, res, next) => {
  try {
    const userPatch = await User.findById(req.user.id);
    if (!userPatch) return res.status(404).json({ message: "User not found" });
    if (userPatch.name) userPatch.name = req.body.name;
    if (userPatch.lastname) userPatch.lastname = req.body.lastname;
    if (userPatch.nationality) userPatch.nationality = req.body.nationality;
    if (userPatch.birtDate) userPatch.birtDate = req.body.birtDate;
    if (userPatch.genre) userPatch.genre = req.body.genre;
    if (userPatch.username) userPatch.username = req.body.username;
    if (userPatch.email) userPatch.email = req.body.email;
    if (userPatch.number) userPatch.number = req.body.number;
    await userPatch.save();
   
    res.status(200).json({ message: "User updated", userPatch });
  } catch (error) {
    next(error);
  }
};


export const getRivals = async (req, res, next) => {
  try {
    const rivals = await Rival.find({ createdBy: req.params.userId,
      state: States.PUBLISHED
     });

    res.json(rivals);
  } catch (error) {
    next(error);
  }
}

export const getContests = async (req, res, next) => {
  try {
    const contests = await Contest.find({ createdBy: req.params.userId,
      state: States.PUBLISHED });
    res.json(contests);
  } catch (error) {
    next(error);
  }
};
export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    user.password = newPassword;
    await user.encryptPassword();
    await user.save();

    res.status(200).json({ message: "Password changed" });
  } catch (error) {
    next(error);
  }

  

};
