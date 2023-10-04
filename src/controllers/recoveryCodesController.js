import RecoveryCode from "../models/RecoveryCode.js";
import User from "../models/User.js";

export const generateRecoveryCode = async (req, res, next) => {
  try {
    const userInfo = req.body.userInfo;
    const foundUser = await User.findOne({
      $or: [{ email: userInfo }, { username: userInfo }],
    });
    if (foundUser != null) {
      const foundRecoveryCode = await RecoveryCode.findOne({
        userId: foundUser._id,
      });
      if (
        foundRecoveryCode != null &&
        foundRecoveryCode.expiresAt > Date.now()
      ) {
        res.status(400).json("Recovery code already generated and still valid");
      } else {
        const newRecoveryCode = new RecoveryCode({ userId: foundUser._id });
        await newRecoveryCode.generateCode();
        await foundUser.sendRecoveryCode(newRecoveryCode.code);
        await newRecoveryCode.encryptRecoveryCode();
        await newRecoveryCode.save();
        res.status(201).json({ userId: foundUser._id });
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    next(error);
  }
};

export const regenerateRecoveryCode = async (req, res, next) => {
  try {
    const userInfo = req.body.userInfo;
    const foundUser = await User.findOne({
      $or: [{ email: userInfo }, { username: userInfo }],
    });
    if (foundUser != null) {
      const foundRecoveryCode = await RecoveryCode.findOne({
        userId: foundUser._id,
      });
      if (
        foundRecoveryCode != null &&
        foundRecoveryCode.expiresAt > Date.now()
      ) {
        await foundRecoveryCode.generateCode();
        await foundUser.sendRecoveryCode(foundRecoveryCode.code);
        await foundRecoveryCode.encryptRecoveryCode();
        await foundRecoveryCode.save();
        res.status(201).json({ userId: foundUser._id });
      } else {
        res
          .status(404)
          .json("Recovery code already not generated or has expired");
      }
    }
  } catch (error) {
    next(error);
  }
};
