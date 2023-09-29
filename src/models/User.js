import { Schema, model } from "mongoose";
import pkg from "mongoose";
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
});

const User = models.User || model("User", userSchema);
export default User;