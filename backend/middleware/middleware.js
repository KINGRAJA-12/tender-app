import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }
    let decode;
    try {
      decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRETE_KEY);
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    let user = await User.findByPk(decode.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }
    req.user = user;
    next();
    
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

