const express = require("express");
const router = express.Router();

const { 
    getDepartments, 
    getDepartment, 
    addDept,
    deleteDept,
    updateDept
} = require("../controllers/department");

router.get("/", getDepartments);

router.get("/:id", getDepartment);

router.post("/", addDept);

router.delete("/:id", deleteDept);

router.put("/", updateDept);



module.exports = router;
