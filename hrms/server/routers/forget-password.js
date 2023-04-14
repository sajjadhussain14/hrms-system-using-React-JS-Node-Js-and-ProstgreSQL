const express = require("express");
const router = express.Router();

const { 
    findEmail,
    createSalt,
    validateSalt,
    updatePassword
} = require("../controllers/forget-password");

router.post("/find-email", findEmail);

router.post("/create-salt", createSalt);

router.post("/validate-salt", validateSalt);

router.post("/update-password", updatePassword);


module.exports = router;
