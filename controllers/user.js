import { user } from "../models/user.js";

import { sendMail } from "../utils/sendMail.js";

const OTP_EXPIRE=  process.env.OTP_EXPIRE||5;
export const register = async (req, res) => {

    const { fname, lname, email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        res.status(400).json({ message: "Confrm password not matched" });
    }

    else {
        const exist = await user.findOne({ email });
        if (exist) {
            res.status(400).json({ message: "User already exist. Please Login" });
        }
        else {
            const otp = Math.floor(Math.random() * 1000000);
            const otp_expiry = new Date(Date.now() + OTP_EXPIRE * 60 * 1000);

            const new_user = new user({ fname, lname, email, password, otp, otp_expiry });
            await new_user.save();
            await sendMail(email, "Verify your account", `Your OTP is ${otp}`);
            console.log(new_user);

            res.status(201).json({ message: "Registered Successfully" });
        }
    }

}

export const login = async function login(req, res) {
    try {
        const { email, password } = req.body;
        const exist = await user.findOne({ email });

        if (!exist || !(await exist.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        } else if (!exist.is_verified) {
            const otp = Math.floor(Math.random() * 1000000);
            const otp_expiry = new Date(Date.now() + OTP_EXPIRE * 60 * 1000);
            exist.otp = otp;
            exist.otp_expiry = otp_expiry;
            await exist.save();

            await sendMail(email, "Verify your account", `Your OTP is ${otp}`);

            console.log(exist);
            return res.status(400).json({ message: "Account not Verified" });
        } else {
            return res.status(200).json({
                message: "Login Successfully",
                token: exist.generateToken(),
            });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: `Internal Server Error ${error}` });
    }
}



export const verifyOTP = async (req, res) => {

    const { otp } = req.body;
    const exist = await user.findOne({ otp });
    if (!exist) {
        return res.status(400).json({ message: "Invalid OTP" });
    }
    else if ((new Date(Date.now())) > exist.otp_expiry) {
        return res.status(400).json({ message: "OTP Expired" });
    }
    else {

        await exist.updateOne({ is_verified: true });
        exist.otp = undefined;
        exist.otp_expiry = undefined;
        await exist.save();
        return res.status(200).json({ message: "OTP Verified" });
    }
}


export const userData = async (req, res) => {
    // console.log("from user data"+req.user);
    res.status(200).json(req.user);

}


export const updatePassword = async (req, res) => {

    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New Password and Confirm Password do not match" });
    }


    const current_user = await user.findById(req.user_id);

    const matchPassword = await current_user.comparePassword(oldPassword);

    if (!matchPassword) {
        return res.status(400).json({ message: "Old Password is incorrect" });
    }

    current_user.password = newPassword;
    await current_user.save();
    return res.status(200).json({ message: "Password Updated" });

}

export const forgotPassword = async (req, res) => {

    const { email } = req.body;
    const exist = await user.findOne({ email });
    if (!exist) {
        return res.status(400).json({ message: "User not found" });
    }

    const reset_otp = Math.floor(Math.random() * 1000000);
    const reset_expiry = new Date(Date.now() + OTP_EXPIRE * 60 * 1000);
    sendMail(email, "Reset Password OTP", `Your password is ${reset_otp}`);
    exist.reset_otp = reset_otp;
    exist.reset_otp_expiry = reset_expiry;
    await exist.save();
    res.status(200).json({ message: "OTP sent to your email" });
}

export const resetPassword = async (req, res) => {

    const { otp, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New Password and Confirm Password do not match" });
    }

    const exist = await user.findOne({ reset_otp: otp });
    if (!exist) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date(Date.now()) > exist.reset_otp_expiry) {
        return res.status(400).json({ message: "OTP Expired" });
    }

    console.log("np" + newPassword);
    exist.password = newPassword;
    await exist.save();
    console.log("from resetP" + exist);


    res.status(200).json({ message: "Password Changed" });

}