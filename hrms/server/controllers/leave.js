const { dataSource } = require("../data-source")

const {
  getLeaveByEmpIdMod,
  getLeaveByTeamLeadIDMod,
  getAllLeaveMod,
  addLeaveMod,
  deleteLeaveMod,
  updateLeaveMod  
} = require("../models/leave")


const getLeaves = async (req, res) => { 
  let leavesData = {}
  let role_slug = ""
  let id = ""
  try{
    role_slug = req.body.role_slug    
    id = req.body.id    
  } catch {}
  
  if(!id && ! role_slug){
    leavesData = { status: 309, msg: "ID and Role are required!" }
  }

  try{
    if(role_slug && role_slug == "super_admin")  {      
      leavesData.employee_leaves = await getAllLeaveMod(req, res)       
      return res.json(leavesData)      

    } else if(role_slug && role_slug == "administrator")  {      
      leavesData.employee_leaves = await getAllLeaveMod(req, res)       
      return res.json(leavesData)

    } else if(role_slug && role_slug == "manager")  {      
      leavesData.employee_leaves = await getAllLeaveMod(req, res)       
      return res.json(leavesData)
    
    } else if(role_slug && role_slug == "team_lead")  {      
      leavesData.employee_leaves = await getLeaveByTeamLeadID(req, res)       
      return res.json(leavesData)

    } else if(role_slug && role_slug == "member")  {      
      leavesData.employee_leaves = await getLeaveByEmpId(req, res)       
      return res.json(leavesData)
    } else {
      return { status: 309, msg: "Access is Denied!!!" }
    }
  } catch(e) { console.error(e.message)
    leavesData = { status: 309, msg: e.message }
  }
 
  return res.json(leavesData)  
}


const getLeaveByEmpId = async (req, res) => { 
  let employeeData = []

  if (dataSource == "pgSQL") {
    employeeData = await getLeaveByEmpIdMod(req, res)
    res.json(employeeData)  
  }
}


const getLeaveByTeamLeadID = async (req, res) => { 
  let employeeData = []

  if (dataSource == "pgSQL") {
    employeeData = await getLeaveByTeamLeadIDMod(req, res)
    res.json(employeeData)  
  }
}


const addLeave = async (req, res) => {
  if (!req.body) {
    req.body = {}
  }

  let emp_id = 0
  try {
    emp_id = (!req.body.emp_id ? 0 : req.body.emp_id)    
  } catch (e) {}
  
  if (!emp_id) {
    return res.json({ status: 309, msg: "Leave requied fields should not be empty!" })
  } else {
    if (dataSource == "pgSQL") {
      let response = await addLeaveMod(req, res)
      res.json(response)
    } 
  }
}


const updateLeave = async (req, res) => {
  if (!req.body) {
    return
  }
   
  if (!req.body.role_slug || !req.body.role_slug || !req.body.emp_id) {
    return res.json({ status: 309, msg: "Couldn't process update." })
  } else {
    let response = await updateLeaveMod(req, res)
    res.json(response)    
  }
}


const deleteLeave = async (req, res) => {
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
      let resp = await deleteLeaveMod(req, res)      
      if(resp.status == 200) {
        return res.json({ status: 200, msg: "Role Deleted Successfully !" })
      } else {
        return res.json({ status: 309, msg: "Role could not Delete !!!" })
      }
    } 
    
  }
}


module.exports = { 
  getLeaves,
  getLeaveByEmpId, 
  getLeaveByTeamLeadID,
  addLeave,
  deleteLeave,
  updateLeave
}
