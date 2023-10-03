import pkg, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../controllers/jwts.js";
import { createTransport } from "nodemailer";
import { cryptoRandomStringAsync } from "crypto-random-string";

const transporter = createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const { models } = pkg;

const userSchema = new Schema({
  name: { type: String, required: [true, "Name is required"] },
  lastname: { type: String, required: [true, "Lastname is required"] },
  age: { type: Number, required: [true, "Age is required"] },
  nationality: { type: String, required: [true, "Nationality is required"] },
  genre: { type: String, required: [true, "Genre is required"] },
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,

    // This regular expression is used to validate email addresses entered by the user.
    // The regular expression is explained in detail in the following table:
    // ^ - Start of the line
    // \S+ - Match one or more characters which are not whitespace characters
    // @ - Match a @ character
    // \S+ - Match one or more characters which are not whitespace characters
    // \. - Match a . character
    // \S+ - Match one or more characters which are not whitespace characters
    // $ - End of the line
    // The error message "Please use a valid email address." is displayed if the email address is invalid.

    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
  },
  number: { type: Number, required: [true, "Number is required"] },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  recoverCode: { type: String, required: false },
});

userSchema.methods.encryptPassword = function () {
  this.password = bcrypt.hash(this.password, 10);
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = async function () {
  return await createAccessToken({
    id: this._id,
    username: this.username,
  });
};

userSchema.methods.sendRecoverCode = async function () {
  this.recoverCode = await cryptoRandomStringAsync({
    length: 6,
    type: "alphanumeric",
  });
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: this.email,
    subject: "Account recover",
    text: "Hi son of a bitch",
    html: `<h1>There it is!</h1><p>your recover code is ${this.recoverCode}</p>`,
  });
  console.log(info);
};

export default models.User || model("User", userSchema);
