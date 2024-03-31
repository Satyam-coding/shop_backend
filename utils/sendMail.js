import nodemailer from "nodemailer";
export const sendMail=async (email,subject,text)=>{
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.SMTP_Email,
    pass: process.env.SMTP_Password,
  },
});

    // console.log(`from ${process.env.SMTP_HOST} and to ${email}`)
    await transporter.sendMail({
    from: process.env.SMTP_HOST,
    to: email,
    subject,
    text
  });


}

