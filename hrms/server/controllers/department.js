const { dataSource } = require("../data-source")

const {
  getAllDepartment,
  getDepartmentByID,
  addDepartment,
  deleteDepartment,
  updateDepartment
} = require("../models/department")

const getDepartments = async (req, res) => { 
  let employeeData = []

  if (dataSource == "pgSQL") {
    employeeData = await getAllDepartment(req, res)
    res.json(employeeData)  
  }
}


const getDepartment = async (req, res) => { 
  let employeeData = []

  if (dataSource == "pgSQL") {
    employeeData = await getDepartmentByID(req, res)
    res.json(employeeData)  
  }
}


const addDept = async (req, res) => {
  if (!req.body) {
    req.body = {}
  }

  let dept_title = ""
  try {
    dept_title = (!req.body.dept_title ? "" : req.body.dept_title)    
  } catch (e) {}
  
  if (!dept_title) {
    return res.json({ status: 309, msg: "Department requied fields should not be empty!" })
  } else {
    if (dataSource == "pgSQL") {
      let response = await addDepartment(req, res)
      res.json(response)
    } 
  }
}


const updateDept = async (req, res) => {
  if (!req.body) {
    req.body = {}
  }

  let emp_id = 0
  try {
    emp_id = (!req.body.id ? 0 : req.body.id)    
  } catch (e) {}
   
  if (!emp_id) {
    return res.json({ status: 309, msg: "Select Department to Update !!!" })
  } else {
    if (dataSource == "pgSQL") {
      let response = await updateDepartment(req, res)
      res.json(response)
    } 
  }
}


const deleteDept = async (req, res) => {
  if (!req.body) {
    req.body = {}
  }
  
  let id = 0
  try {    
    id = req.body.id        
  } catch (e) {}
  if (!id || id == 0) {    
    return res.json({ status: 309, msg: "Please Select an Department to Delete !" })
  } else {
    if (dataSource == "pgSQL") {      
      let resp = await deleteDepartment(req, res)      
      if(resp.status == 200) {
        return res.json({ status: 200, msg: "Department Deleted Successfully !" })
      } else {
        return res.json({ status: 309, msg: "Department could not Delete !!!" })
      }
    } 
    
  }
}


module.exports = { 
  getDepartments, 
  getDepartment, 
  addDept,
  deleteDept,
  updateDept
}
