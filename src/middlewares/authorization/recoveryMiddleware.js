import jwt from "jsonwebtoken";

const recoveryMiddleware = (req, res, next) => {
  try {
    const { recovery } = req.cookies;

    if (!recovery)
      return res
        .status(401)
        .json({ message: "No recovery token, authorization denied" });

    jwt.verify(recovery, process.env.TOKEN_SECRET, (error, recoveryData) => {
      if (error) {
        return res.status(401).json({ message: "Recovery token is not valid" });
      }
      req.recovery = recoveryData;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default recoveryMiddleware;
