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
        subject: 'Fidelizes - Confirm Your Account',
        html: `<h3>Welcome to Fidelizes!<h3><br>
        <p>Click on the link below to confirm your account:</p><br>
        <p>Link: <a href="https://www.fidelizes.com/confirm-account/${data.token}">https://www.fidelizes.com/confirm-account/${data.token}</a></p><br>
        <p>Fidelizes Team</p>
        `
    };
    return await transporter.sendMail(mailOptions);
};

module.exports = {
    send
};