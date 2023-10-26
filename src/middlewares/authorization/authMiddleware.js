import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const { token } = req.cookies;
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
      if (!req.params.userId) next();
      else if (req.params.userId === user.id) next();
      else
        return res
          .status(403)
          .json({ message: "You are not allowed to access this endpoint" });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default authMiddleware;