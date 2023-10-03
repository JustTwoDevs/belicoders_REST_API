import User from "../models/User.js";

export const login = async (req, res, next) => {
  try {
    const { userInfo, password } = req.body;
    const userFound = await User.findOne({
      $or: [{ email: userInfo }, { username: userInfo }],
    });

    if (!userFound)
      res.status(400).json({
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
    next(error);
  }
};

export const logout = async (_req, res, next) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      expires: new Date(0),
    });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const generateRecoverCode = async (req, res, next) => {
  try {
    const userInfo = req.body.userInfo;
    const foundUser = await User.findOne({
      $or: [{ email: userInfo }, { username: userInfo }],
    });
    if (foundUser != null) {
      await foundUser.sendRecoverCode();
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
};

export const checkRecoverCode = async (req, res, next) => {
  try {
    const { userInfo, recoverCode } = req.body;
    const foundUser = await User.findOne({
      $or: [{ email: userInfo }, { username: userInfo }],
    });
    if (foundUser != null) {
      if (foundUser.recoverCode === recoverCode) {
        res.sendStatus(204);
      } else {
        res.status(400).json({ message: "Incorrect code" });
      }
    } else {
      res.status(400);
    }
  } catch (error) {
    next(error);
  }
};

export const recovePassword = async (req, res, next) => {
  try {
    const { userInfo, recoverCode, newPassword } = req.body;
    const patchedUser = await User.findOne({
      $or: [{ email: userInfo }, { username: userInfo }],
    });
    if (patchedUser != null) {
      if (patchedUser.recoverCode === recoverCode) {
        patchedUser.password = newPassword;
        patchedUser.recoverCode = null;
        await patchedUser.save();
        res.sendStatus(204);
      } else {
        res.status(400).json({ message: "Incorrect code" });
      }
    } else {
      res.status(404);
    }
  } catch (error) {
    next(error);
  }
};
