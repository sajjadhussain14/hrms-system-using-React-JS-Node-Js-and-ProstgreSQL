const express = require("express");
const router = express.Router();

const { 
    getAllHoliday,
    addHoliday,
    deleteHoliday
} = require("../controllers/holiday");


router.get("/", getAllHoliday);

router.post("/add-holiday", addHoliday);

router.post("/delete-holiday", deleteHoliday);



module.exports = router;
