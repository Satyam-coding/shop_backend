import jwt from "jsonwebtoken";
import { user } from "../models/user.js";

const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY||"my_secret";
export const authorization = async (req, res, next) => {
    try {
      let token = req.headers.authorization;
      token = token.replace("Bearer ", "").trim();
      if (!token || token=="null") {
        return res.status(400).json({ message: "Please Login first" });
      }

       console.log("from auth " + token);
  
      
      const decoded = jwt.verify(token, JWT_SECRET_KEY);
  
      if (decoded) {
        const exist = await user.findOne({ _id: decoded._id }).select({ password: 0, confirm_password: 0, otp: 0, otp_expiry: 0 });
        if (exist) {
          req.user_id=exist._id;
          req.user= exist;
          next();
        }
      }
    } catch (error) {
      res.status(500).json({ message: `Internal server error ${error}` });
    }
  }
  