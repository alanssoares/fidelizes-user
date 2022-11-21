import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_NOREPLY,
        pass: process.env.EMAIL_NOREPLY_PW
    }
});

async function send(data) {
    const mailOptions = {
        from: process.env.EMAIL_NOREPLY,
        to: data.email,
        subject: data.subject,
        html: data.template
    };
    return await transporter.sendMail(mailOptions);
};

module.exports = {
    send
};