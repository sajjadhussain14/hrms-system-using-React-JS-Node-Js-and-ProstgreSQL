const express = require("express");
const router = express.Router();

const { 
    getLeaveRequests,
    getThisYearLeavesByEmployeeID,
    responseLeaveRequest,
    getApprovedLeaveRequest,
    getPendingLeaveRequest,
    getLeaveReqByEmployeeId, 
    getLeaveReqByTeamLeadId,
    addLeaveRequest,
    deleteLeaveRequest,
    updateLeaveRequest
} = require("../controllers/leave-request");

router.post("/this-year-leaves", getThisYearLeavesByEmployeeID);

router.post("/get", getLeaveRequests);

router.post("/add", addLeaveRequest);

router.post("/response", responseLeaveRequest);

router.post("/approved", getApprovedLeaveRequest);

router.post("/pending", getPendingLeaveRequest);

router.get("/:id", getLeaveReqByEmployeeId); 

router.get("/lead/:id", getLeaveReqByTeamLeadId);
 
router.post("/delete", deleteLeaveRequest);

router.put("/", updateLeaveRequest);


module.exports = router;
