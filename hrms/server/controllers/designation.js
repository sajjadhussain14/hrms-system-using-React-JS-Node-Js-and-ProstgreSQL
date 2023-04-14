const { dataSource } = require("../data-source")

const {
  getAllDesignation,
  getDesignationByID,
  addDesignation,
  deleteDesignation,
  updateDesignation  
} = require("../models/designation")

const getDesignations = async (req, res) => { 
  let employeeData = []

  if (dataSource == "pgSQL") {
    employeeData = await getAllDesignation(req, res)
    res.json(employeeData)  
  }
}


const getDesignation = async (req, res) => { 
  let employeeData = []

  if (dataSource == "pgSQL") {
    employeeData = await getDesignationByID(req, res)
    res.json(employeeData)  
  }
}


const addDesig = async (req, res) => {
  if (!req.body) {
    req.body = {}
  }

  let dept_title = ""
  try {
    desig_title = (!req.body.desig_title ? "" : req.body.desig_title)    
  } catch (e) {}
  
  if (!desig_title) {
    return res.json({ status: 309, msg: "Designation requied fields should not be empty!" })
  } else {
    if (dataSource == "pgSQL") {
      let response = await addDesignation(req, res)
      res.json(response)
    } 
  }
}


const updateDesig = async (req, res) => {
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
      let response = await updateDesignation(req, res)
      res.json(response)
    } 
  }
}


const deleteDesig = async (req, res) => {
  if (!req.params) {
    req.params = {}
  }
  
  let id = 0
  try {    
    id = req.params.id        
  } catch (e) {}
  if (!id || id == 0) {    
    return res.json({ status: 309, msg: "Please Select an Designation to Delete !" })
  } else {
    if (dataSource == "pgSQL") {      
      let resp = await deleteDesignation(req, res)      
      if(resp.status == 200) {
        return res.json({ status: 200, msg: "Designation Deleted Successfully !" })
      } else {
        return res.json({ status: 309, msg: "Designation could not Delete !!!" })
      }
    } 
    
  }
}


module.exports = { 
  getDesignations, 
  getDesignation, 
  addDesig,
  deleteDesig,
  updateDesig
}
