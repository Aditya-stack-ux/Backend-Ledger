const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name){
    const subject = `Welcome to backend ledger!`
    const text = `Hi ${name},\n\nWelcome to Backend Ledger!\nYour account has been successfully created. You can now start using the platform.\n\nBest regards,\nBackend Ledger Team`;
    const html = `<p>Hi ${name},</p><p>Welcome to Backend Ledger! Your account has been successfully created. You can now start using the platform.</p><p>Best regards,<br/>Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}


async function sendTransactionEmail(userEmail, name, amount, toAccount) {

    const subject = "Transaction Confirmation";

    const text = `Hi ${name},\n\nYour transaction was successful.\n\nAmount: ₹${amount}\nTransferred To: ${toAccount}\n\nThank you for using Backend Ledger.\n\nRegards,\nBackend Ledger Team`;

    const html = `<p>Hi ${name},</p>\n<p>Your transaction was successful.</p>\n<p><strong>Amount:</strong> ₹${amount}</p>\n<p><strong>Transferred To:</strong> ${toAccount}</p>\n<p>Thank you for using Backend Ledger.</p>\n<p>Regards,<br/>Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {

    const subject = "Transaction Failed";

    const text = `Hi ${name},\n\nYour transaction could not be processed.\n\nAmount: ₹${amount}\nAttempted To: ${toAccount}\n\nPlease check your account balance or try again later.\nIf the issue persists, contact support.\n\nRegards,\nBackend Ledger Team`;

    const html = `<p>Hi ${name},</p>\n<p>Your transaction could not be processed.</p>\n<p><strong>Amount:</strong> ₹${amount}</p>\n<p><strong>Attempted To:</strong> ${toAccount}</p>\n<p>Please check your account balance or try again later.<br/>If the issue persists, contact support.</p>\n<p>Regards,<br/>Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}


module.exports = {sendRegistrationEmail,
                  sendTransactionEmail,
                  sendTransactionFailureEmail
};