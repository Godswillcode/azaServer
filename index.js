const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const logger = require("morgan");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.json());

app.post("/send", (req, res) => {
  const pushout = `
  <p> You have a new message from aza contact</p>
  <h3>Customer Details</h3>
  <ul>
  <li>Contact_Name: ${req.body.person.contactName}</li>
  <li>Contact_Phone: ${req.body.person.contactPhone}</li>
  <li>Contact_Email: ${req.body.person.contactEmail}</li>
  <li>Contact_Message: ${req.body.person.contactMessage}</li>
  

  `;

  let transporter = nodemailer.createTransport({
    host: "azaproperty.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.WEBMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  let mailOptions = {
    from: `${req.body.person.contactName} <${req.body.person.contactEmail}>`,
    to: process.env.WEBMAIL, // list of receivers
    subject: "Aza property contact form ✔", // Subject line
    text: "Hello there", // plain text body
    html: pushout, // html body
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      res.json({
        status: "fail",
      });
    } else {
      console.log("== Message Sent ==");
      res.json({
        status: "success",
      });
    }
  });
});

app.get("/", (req, res) => res.send("welcome to a live server"));
app.listen(process.env.PORT || 5002, () => console.log("Server Running"));
