import express  from "express";

import {register,login,verifyOTP,userData, updatePassword,resetPassword, forgotPassword} from "../controllers/user.js";
import {validate} from "../validators/validation.js";
import { signUpZod } from "../validators/signup.js";
import {authorization} from "../middleware/user-auth.js";
import { createContact } from "../controllers/conatct.js";


const router=express.Router();

router.route("/register").post(validate(signUpZod),register);
router.route("/login").post(login);
router.route("/verifyOTP").post(verifyOTP);
router.route("/user").get(authorization,userData);



//dealing with password

router.route("/updatePassword").post(authorization,updatePassword);


router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword").post( resetPassword);




//** conatct routes */
router.route("/contact").post(createContact);

export default router;
