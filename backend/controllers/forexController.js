const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendForexDetails = (req, res) => {
  const { transactionType, location, currency, quantity, purpose, amount } =
    req.body;

  // Create a transporter object using SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // Format the email body based on transaction type
  const getEmailBody = () => {
    const commonDetails = `
      Location: ${location}
      Currency: ${currency}
      Quantity: ${quantity}
      Amount (INR): ${amount}
    `;

    if (transactionType === "buy") {
      return `
        NEW FOREX BUY REQUEST
        
        ${commonDetails}
        Purpose of Visit: ${purpose}
      `;
    } else {
      return `
        NEW FOREX SELL REQUEST
        
        ${commonDetails}
      `;
    }
  };

  // Email options
  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: `New Forex ${transactionType.toUpperCase()} Request`,
    text: getEmailBody(),
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Email error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to send email",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Forex request submitted successfully!",
    });
  });
};
