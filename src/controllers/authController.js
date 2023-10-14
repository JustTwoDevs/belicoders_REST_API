import User from "../models/User.js";
import RecoveryCode from "../models/RecoveryCode.js";

export const login = async (req, res, next) => {
  try {
    const { userInfo, password } = req.body;
    const userFound = await User.findOne({
      $or: [{ email: userInfo }, { username: userInfo }],
    });

    if (!userFound)
      return res.status(400).json({
        message: "The username or email is incorrect",
      });

    const isMatch = await userFound.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "The password is incorrect",
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

export const verifyRecoveryCode = async (req, res, next) => {
  try {
    const { userId, recoveryCode } = req.body;
    const foundRecoveryCode = await RecoveryCode.findOne({
      userId,
    });
    if (foundRecoveryCode != null) {
      const isVerified = await foundRecoveryCode.verifyCode(recoveryCode);
      if (isVerified) {
        const recoveryToken = await foundRecoveryCode.generateToken();
        res.cookie("recovery", recoveryToken, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });
        await foundRecoveryCode.deleteOne();
        res
          .status(200)
          .json({ message: "Recovery code generated succesfully" });
      } else {
        res.status(400).json({ message: "Recovery code wrong or has expired" });
      }
    } else {
      res
        .status(404)
        .json({ message: "Recovery code not generated or has expired" });
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const resetedUser = await User.findByIdAndUpdate(
      req.recovery.userId,
      {
        password: newPassword,
      },
      { new: true },
    );
    if (resetedUser != null) {
      await resetedUser.encryptPassword();
      await resetedUser.save();
      res.cookie("recovery", "", {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
      });
      res.status(200).json({ message: "Password Changed succesfully" });
    } else {
      res.status(404).json({ messag: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};
