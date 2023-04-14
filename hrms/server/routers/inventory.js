const express = require("express");
const router = express.Router();

const { 
  getInventoryByEmpId, 
  addInventory,  
  updateInventory,
  deleteInventory,   
} = require("../controllers/inventory");


router.post("/get-by-emp-id", getInventoryByEmpId);



router.post("/add", addInventory);

router.put("/", updateInventory);

router.post("/delete", deleteInventory);


module.exports = router;
