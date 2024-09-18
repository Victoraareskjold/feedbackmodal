const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("Feil ved tilkobling:", error);
  } else {
    console.log("Tilkobling er vellykket:", success);
  }
});

// Route for å håndtere tilbakemeldinger
app.post("/send-email", (req, res) => {
  console.log("Mottatt POST-forespørsel på /send-email");
  console.log("Forespørselens kropp:", req.body);

  const { emojiId, feedback, email } = req.body;

  if (!emojiId || !feedback || !email) {
    console.log("Manglende data:", { emojiId, feedback, email });
    return res.status(400).json({ message: "Manglende data i forespørselen." });
  }

  // Lag e-postinnholdet
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Ny tilbakemelding mottatt",
    text: `Du har mottatt en ny tilbakemelding:\n\nEmoji: ${emojiId}\nTilbakemelding: ${feedback}`,
  };

  // Send e-post
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Feil ved sending av e-post:", error);
      return res.status(500).json({ message: "Feil ved sending av e-post." });
    }
    console.log("E-post sendt:", info.response);
    res.status(200).json({ message: "Tilbakemelding sendt!" });
  });
});

// Route for å håndtere GET-forespørsel
app.get("/", (req, res) => {
  res.send("Server er i gang");
});

// Start serveren
app.listen(PORT, () => {
  console.log(`Server kjører på port ${PORT}`);
});
