const { dataSource } = require("../data-source")

const {
  getAllRole,
  getRoleByID,
  addRoleMod,
  deleteRoleMod,
  updateRoleMod  
} = require("../models/role")

const getRoles = async (req, res) => { 
  let employeeData = []

  if (dataSource == "pgSQL") {
    employeeData = await getAllRole(req, res)
    res.json(employeeData)  
  }
}


const getRole = async (req, res) => { 
  let employeeData = []

  if (dataSource == "pgSQL") {
    employeeData = await getRoleByID(req, res)
    res.json(employeeData)  
  }
}


const addRole = async (req, res) => {
  if (!req.body) {
    req.body = {}
  }

  let dept_title = ""
  try {
    role_title = (!req.body.role_title ? "" : req.body.role_title)    
  } catch (e) {}
  
  if (!role_title) {
    return res.json({ status: 309, msg: "Role requied fields should not be empty!" })
  } else {
    if (dataSource == "pgSQL") {
      let response = await addRoleMod(req, res)
      res.json(response)
    } 
  }
}


const updateRole = async (req, res) => {
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


const deleteRole = async (req, res) => {
  if (!req.params) {
    req.params = {}
  }
  
  let id = 0
  try {    
    id = req.params.id        
  } catch (e) {}
  
  if (!id || id == 0) {    
    return res.json({ status: 309, msg: "Please Select an Role to Delete !" })
  } else {
    if (dataSource == "pgSQL") {      
      let resp = await deleteRoleMod(req, res)      
      if(resp.status == 200) {
        return res.json({ status: 200, msg: "Role Deleted Successfully !" })
      } else {
        return res.json({ status: 309, msg: "Role could not Delete !!!" })
      }
    } 
    
  }
}


module.exports = { 
  getRoles, 
  getRole, 
  addRole,
  deleteRole,
  updateRole
}
