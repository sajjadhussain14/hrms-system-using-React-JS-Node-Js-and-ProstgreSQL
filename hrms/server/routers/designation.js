const express = require("express");
const router = express.Router();

const { 
    getDesignations, 
    getDesignation, 
    addDesig,
    deleteDesig,
    updateDesig
} = require("../controllers/designation");

router.get("/", getDesignations);

router.get("/:id", getDesignation);

router.post("/", addDesig);

router.delete("/:id", deleteDesig);

router.put("/", updateDesig);



module.exports = router;
