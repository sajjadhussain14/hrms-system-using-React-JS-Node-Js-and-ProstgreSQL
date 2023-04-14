const { dataSource } = require("../data-source")

const {
  getInventoryByEmpIdMod, 
  addInventoryMod, 
  deleteInventoryMod,
} = require("../models/inventory")




const getInventoryByEmpId = async (req, res) => { 
  let inventoryData = {}
  if(!req.body){
    return;
  }
    
  try {
    if(req.body.id && req.body.role_slug) {
      inventoryData = await getInventoryByEmpIdMod(req, res)
      inventoryData = res.json(inventoryData)        
    } else {
      inventoryData = res.json({ status: 309, msg: "Couldn't get data." })  
    }
  } catch(e){
    inventoryData = res.json({ status: 309, msg: e.message })
  }

  return inventoryData;
}


const addInventory = async (req, res) => {
  if (!req.body) {
    req.body = {}
  }

  let emp_id = ""
  try {
    emp_id = (!req.body.emp_id ? "" : req.body.emp_id)    
  } catch (e) {}
  
  if (!emp_id) {
    return res.json({ status: 309, msg: "Inventory requied fields should not be empty!" })
  } else {
    if (dataSource == "pgSQL") {
      let response = await addInventoryMod(req, res)
      res.json(response)
    } 
  }
}


const updateInventory = async (req, res) => {
  if (!req.body) {
    req.body = {}
  }

  let emp_id = 0
  try {
    desig_id = (!req.body.id ? 0 : req.body.id)    
  } catch (e) {}
   
  if (!desig_id) {
    return res.json({ status: 309, msg: "Select Designation to Update !!!" })
  } else {
    if (dataSource == "pgSQL") {
      let response = await updateRoleMod(req, res)
      res.json(response)
    } 
  }
}


const deleteInventory = async (req, res) => {
  if (!req.params) {
    req.params = {}
  }
  
  let id = 0
  try {    
    id = req.params.id        
  } catch (e) {}
  
  if (!id || id == 0) {    
    return res.json({ status: 309, msg: "Please Select an Inventory to Delete !" })
  } else {
    if (dataSource == "pgSQL") {      
      let resp = await deleteInventoryMod(req, res)      
      if(resp.status == 200) {
        return res.json({ status: 200, msg: "Inventory Deleted Successfully !" })
      } else {
        return res.json({ status: 309, msg: "Inventory could not Delete !!!" })
      }
    } 
    
  }
}


module.exports = { 
  getInventoryByEmpId, 
  addInventory,  
  updateInventory,
  deleteInventory,
}
