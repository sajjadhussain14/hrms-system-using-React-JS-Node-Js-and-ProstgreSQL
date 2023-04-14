const express = require("express");
const router = express.Router();

const { 
    getAllBank,
    getBankById
} = require("../controllers/bank");

router.post("/get-all", getAllBank);

router.post("/get-by-id", getBankById);

module.exports = router;
