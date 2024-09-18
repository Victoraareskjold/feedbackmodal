const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Nodemailer konfigurering
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route for å håndtere tilbakemeldinger
app.post("/send-feedback", (req, res) => {
  const { emoji, feedback, email } = req.body;

  // Lag e-postinnholdet
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender alltid fra din e-post
    to: email, // Send til mottakerens e-post fra iframen
    subject: "Ny tilbakemelding mottatt",
    text: `Du har mottatt en ny tilbakemelding:\n\nEmoji: ${emoji}\nTilbakemelding: ${feedback}`,
  };

  // Send e-post
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Feil ved sending av e-post." });
    }
    res.status(200).json({ message: "Tilbakemelding sendt!" });
  });
});

// Start serveren
app.listen(PORT, () => {
  console.log(`Server kjører på port localhost:${PORT}`);
});
