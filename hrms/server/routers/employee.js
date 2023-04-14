const express = require("express");
//const { default: EditProfile } = require("../../src/pages/edit-employee-profile");
const router = express.Router();

const { 
    getEmployees4Count,
    getEmployees, 
    getEmployeeByID, 
    getReportToByID,
    getAllReportTo,
    getEmployeeReportTo,
    getEmployeeByTeamLead, 
    getTeamLeads,
    getEmployeeByIDs,
    addEmployee,
    addEmployeeCSV,
    deleteEmployee,
    editEmployeeProfile,
    acceptEmployeeResignation
} = require("../controllers/employee");

router.post("/get", getEmployees); 

router.post("/get-report-to", getReportToByID); 

router.post("/get-employees-count", getEmployees4Count); 

router.post("/get-all-report-to", getAllReportTo);

router.post("/get-emp-report-to", getEmployeeReportTo);

router.post("/edit-profile", editEmployeeProfile); 

router.post("/accept-resignation", acceptEmployeeResignation); 

router.post("/get-employee-by-ids", getEmployeeByIDs);




router.get("/:id", getEmployees);


router.get("/member/:id", getEmployeeByTeamLead);

router.get("/lead", getTeamLeads);

router.post("/add", addEmployee);

router.post("/add-csv", addEmployeeCSV);

router.post("/delete", deleteEmployee);

  
module.exports = router;
