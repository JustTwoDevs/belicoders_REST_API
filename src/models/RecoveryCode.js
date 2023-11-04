import pkg from "mongoose";
import { cryptoRandomStringAsync } from "crypto-random-string";
import bcrypt from "bcryptjs";
import { createAccessToken } from "#controllers/jwts.js";
const { Schema, model, models } = pkg;

const EXPIRE_TIME = 10;

const RecoveryCodeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  code: { type: String },
  createdAt: { type: Date, expires: "10m" },
  expiresAt: { type: Date },
});

RecoveryCodeSchema.methods.generateCode = async function () {
  this.code = await cryptoRandomStringAsync({
    length: 6,
    type: "alphanumeric",
  });
  const date = new Date();
  this.createdAt = date;
  this.expiresAt = date.setMinutes(date.getMinutes() + EXPIRE_TIME);
};

RecoveryCodeSchema.methods.encryptRecoveryCode = async function () {
  this.code = await bcrypt.hash(this.code, 10);
};

RecoveryCodeSchema.methods.verifyCode = async function (recoveryCode) {
  if (this.expiresAt < Date.now()) return false;
  return await bcrypt.compare(recoveryCode, this.code);
};

RecoveryCodeSchema.methods.generateToken = async function () {
  const token = await createAccessToken({
    id: this._id,
    userId: this.userId,
    code: this.code,
  });
  return token;
};

export default models.RecoveryCode || model("RecoveryCode", RecoveryCodeSchema);
