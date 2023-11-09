import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log(token);
    if (!token)
      return res
        .status(401)
        .json({ message: "No authorization token, authorization denied" });

    jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
      if (error) {
        return res
          .status(401)
          .json({ message: "Authorization token is not valid" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default authMiddleware;
