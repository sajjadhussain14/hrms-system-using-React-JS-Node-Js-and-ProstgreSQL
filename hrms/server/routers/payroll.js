const express = require("express");
const router = express.Router();

const { 
    getPayrolls,
    getEmployeePayrollByID, 
    getPayrollByID,
    getEmployeePayrollByTeamLeadID,
    addEmployeePayroll,
    generateSalarySlip4All,
    releaseSalarySlip4All,
    isSalaryGeneratedReleased,
    editEmployeePayroll
} = require("../controllers/payroll");

router.post("/get", getPayrolls);

router.get("/", getEmployeePayrollByID);

router.get("/lead/:id", getEmployeePayrollByTeamLeadID);

router.post("/add", addEmployeePayroll);

router.post("/generate-salary-slip", generateSalarySlip4All);

router.post("/release-salary-slip", releaseSalarySlip4All);

router.post("/is-salary-generated-released", isSalaryGeneratedReleased);

router.post("/edit-emp-payroll", editEmployeePayroll);

router.post("/get-payroll-by-id", getPayrollByID);


module.exports = router;
