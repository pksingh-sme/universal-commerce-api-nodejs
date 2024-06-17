const config = require('../../config/config');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const mustache = require('mustache');
const juice = require('juice'); // This package inlines CSS

// Read and inline CSS
function inlineCss(html, cssFilePath) {
    const css = fs.readFileSync(cssFilePath, 'utf8');
    return juice.inlineContent(html, css);
}

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service provider
    auth: {
        user: config.emailUser, // Replace with your email address
        pass: config.emailPassword // Replace with your email password or app password
    }
});

// Define the email options
const mailOptions = (to, subject, html) => ({
    from: '"Your Service" <pksingh.sme@gmail.com>', // Sender address
    to, // List of recipients
    subject, // Subject line
    html // HTML body
});

// Send the email
async function sendEmail(to, subject, templatePath, data) {
    try {
        const template = fs.readFileSync(templatePath, 'utf8');
        const htmlWithInlineCss = inlineCss(mustache.render(template, data), path.join(__dirname, '../templates/emails/emailStyles.css'));

        const info = await transporter.sendMail(mailOptions(to, subject, htmlWithInlineCss));
        //console.log('Message sent: %s', info.messageId);
        //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = {
    sendEmail
};
