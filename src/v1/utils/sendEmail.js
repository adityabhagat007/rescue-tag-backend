import config from "../../../config/config.js";
import nodemailer from "nodemailer";

const sendEmail = async (email, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: config.HOST,
            service: config.SERVICE,
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.EMAIL,
                pass: config.EMAIL_API_KEY
            }
        });

        transporter.sendMail({
            from: config.EMAIL,
            to: email,
            subject: subject,
            html: html
        }, (err) => {
            console.log(err);
        });

        console.log("email sent successfully");
    } catch (error) {
        console.log("email not sent");
    }
};

export default sendEmail;