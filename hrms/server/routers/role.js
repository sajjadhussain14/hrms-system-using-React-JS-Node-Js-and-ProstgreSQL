const express = require("express");
const router = express.Router();

const { 
    getRoles, 
    getRole, 
    addRole,
    deleteRole,
    updateRole
} = require("../controllers/role");

router.post("/get", getRoles);

router.get("/:id", getRole);

router.post("/", addRole);

router.delete("/:id", deleteRole);

router.put("/", updateRole);


module.exports = router;
