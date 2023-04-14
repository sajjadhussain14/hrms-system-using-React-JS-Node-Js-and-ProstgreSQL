const express = require("express");
const router = express.Router();

const { 
    getThisMonthAttendance,
    getAttendanceById,
    punchIn,
    getTodayAttendance,
    getAttendanceByEmpID,
    addAttendanceArray
} = require("../controllers/attendance");

router.post("/get-by-id", getAttendanceById);

router.post("/get-this-month", getThisMonthAttendance);

router.post("/punchin", punchIn);

router.post("/get-today-attendance", getTodayAttendance);

router.post("/get-by-emp", getAttendanceByEmpID);

router.post("/add-attendance-array", addAttendanceArray);


module.exports = router;
