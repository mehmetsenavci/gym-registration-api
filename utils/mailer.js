const nodemailer = require('nodemailer');

const sendEmail = async (opt) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        auth: {
            user: process.env.MAILER_USERNAME,
            pass: process.env.MAILER_PASSWORD,
        },
    });

    const mailOptions = {
        from: 'Mehmet Senavci <mehmetsenavci@example.io>',
        to: opt.email,
        subject: opt.subject,
        text: opt.message,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
