import validator from "./validator.js";
import User from "#models/User.js";

const registerRequestValidator = async (body, errors) => {
  const { email, username } = body;

  const userFound = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (userFound?.email === email) {
    errors.push({
      on: "email",
      message: "The email is already in use",
    });
  }

  if (userFound?.username === username) {
    errors.push({
      on: "username",
      message: "The username is already in use",
    });
  }
};

export const registerValidator = validator(registerRequestValidator, null);
