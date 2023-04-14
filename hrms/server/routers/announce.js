const express = require("express");
const router = express.Router();

const { 
    getAllAnnounce, 
    getAnnounceByEmpId, 
    getAnnounceUpcoming,
    addAnnounce,
    deleteAnnounce,
    updateAnnounce
} = require("../controllers/announce");

router.get("/", getAllAnnounce);

router.get("/employee/:id", getAnnounceByEmpId);

router.get("/upcoming", getAnnounceUpcoming);

router.post("/", addAnnounce);

router.delete("/:id", deleteAnnounce);

router.put("/", updateAnnounce);


module.exports = router;
