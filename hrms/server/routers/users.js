const express = require("express");
const router = express.Router();

const { 
    authenticateUser    
} = require("../controllers/users");

router.post("/auth", authenticateUser);


module.exports = router;
