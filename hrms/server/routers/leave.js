const express = require("express");
const router = express.Router();

const { 
    getLeaves,
    getLeaveByEmpId, 
    getLeaveByTeamLeadID,
    addLeave,
    deleteLeave,
    updateLeave
} = require("../controllers/leave");


router.post("/get", getLeaves);

router.get("/:id", getLeaveByEmpId);

router.get("/lead/:id", getLeaveByTeamLeadID);

router.post("/", addLeave);

router.post("/edit-leave", updateLeave);


module.exports = router;
