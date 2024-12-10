const nodemailer = require("nodemailer");
require("dotenv").config();

class FlightController {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
  }

  handleBooking = async (req, res) => {
    try {
      console.log("handleBooking - this:", this); // Debug log
      const bookingData = req.body;

      // Validate booking datar
      if (!this.validateBookingData(bookingData)) {
        return res.status(400).json({
          message: "Invalid booking data. Please check all required fields.",
        });
      }

      // Create email content
      const emailContent = this.createEmailContent(bookingData);

      // Send email
      await this.sendEmail(emailContent);

      res.status(200).json({
        message: "Booking received successfully",
        bookingData,
      });
    } catch (error) {
      console.error("Booking error:", error);
      res.status(500).json({
        message: "Error processing booking",
        error: error.message,
      });
    }
  };

  validateBookingData(data) {
    const requiredFields = [
      "name",
      "phone",
      "email",
      "origin",
      "destination",
      "departureDate",
      "journeyType",
      "children",
      "infants",
      "class",
      "fareType",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return false;
      }
    }

    // Validate passenger counts
    const totalPassengers = parseInt(data.children) + parseInt(data.infants);

    if (totalPassengers > 9) {
      return false;
    }

    // Validate return date for return journeys
    if (data.journeyType === "return" && !data.returnDate) {
      return false;
    }

    // Validate return date for return journeys
    if (data.journeyType === "return" && !data.returnDate) {
      return false;
    }

    return true;
  }

  createEmailContent(data) {
    return `
            New Flight Booking Request

            Personal Information:
            --------------------
            Name: ${data.name}
            Phone: ${data.phone}
            Email: ${data.email}

            Flight Details:
            --------------
            From: ${data.origin}
            To: ${data.destination}
            Journey Type: ${data.journeyType}
            Departure Date: ${data.departureDate}
            ${
              data.journeyType === "return"
                ? `Return Date: ${data.returnDate}`
                : ""
            }

            Passengers:
            ----------
            Adults: ${data.adults}
            Children: ${data.children || 0}
            Infants: ${data.infants || 0}

            Class and Fare:
            --------------
            Class: ${data.class}
            Fare Type: ${data.fareType}

            Passenger DOB Details:
            --------------------
            ${this.formatDOBDetails(data)}
        `;
  }

  formatDOBDetails(data) {
    let dobDetails = "";

    // Format Children DOBs
    if (data.children) {
      for (let i = 1; i <= data.children; i++) {
        dobDetails += `Child ${i}: ${data[`childDob${i}`]}\n`;
      }
    }

    // Format Infant DOBs
    if (data.infants) {
      for (let i = 1; i <= data.infants; i++) {
        dobDetails += `Infant ${i}: ${data[`infantDob${i}`]}\n`;
      }
    }

    console.log("DOB Details:", dobDetails); // Debug log

    return dobDetails;
  }

  async sendEmail(content) {
    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL, // Sending to the same email
      subject: "New Flight Booking Request",
      text: content,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Email sending failed:", error);
      throw new Error("Failed to send email notification");
    }
  }
}

module.exports = new FlightController();
