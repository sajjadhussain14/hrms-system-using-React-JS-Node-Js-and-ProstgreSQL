const express = require("express");
const router = express.Router();

const { 
    sendEmail
} = require("../controllers/mailer");

router.post("/send-email", sendEmail);


module.exports = router;
