const express = require("express");
const router = express.Router();

const { 
    updateSetting, 
    getSetting,
    deleteAllLeaves,
    deleteAllAttendance,
    deleteAllPayslip,
    deleteEmployeeById,
    resetAllUsersPassword
} = require("../controllers/settings");


router.post("/get-setting", getSetting);
router.post("/update-setting", updateSetting);

router.post("/delete-all-leaves", deleteAllLeaves);
router.post("/delete-all-attendance", deleteAllAttendance);
router.post("/delete-all-payslip", deleteAllPayslip);

router.post("/delete-employee", deleteEmployeeById);

router.post("/reset-all-password", resetAllUsersPassword);







module.exports = router;
