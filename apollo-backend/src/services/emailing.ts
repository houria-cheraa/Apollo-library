import nodeMailer from "nodemailer";

const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
    },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to,
            subject,
            html,
        });
    } catch (error) {
        console.warn(error);
    }
};
