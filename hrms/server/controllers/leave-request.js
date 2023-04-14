const { dataSource } = require("../data-source")
const { getLeaveByTeamLeadIDMod } = require("../models/leave")

const {
  getAllLeaveRequestMod,
  getLeaveRequestByTeamleadMod,
  getLeaveRequestByEmpIdMod,  
  getThisYearLeavesByEmployeeIDMod,
  responseLeaveRequestMod,
  getApprovedLeaveRequestMod,
  getPendingLeaveRequestMod,
  addLeaveRequestMod, 
  deleteLeaveRequestMod,
  updateLeaveRequestMod
} = require("../models/leave-request")

const {
  getEmployeeByIDMod,
} = require("../models/employee")


const getLeaveRequests = async (req, res) => { 
  let leavesData = []
  if(!req.body || !req.body.role_slug || !req.body.id) {
    return;
  }  
  
  try{    
    if(req.body.emp_id)  {      
      req.body.id = req.body.emp_id
      leavesData = await getLeaveRequestByEmpIdMod(req, res)
      return res.json(leavesData)                    
    } else if(req.body.role_slug == "super_admin" || req.body.role_slug == "administrator")  { 
      leavesData = await getAllLeaveRequestMod(req, res)      
      return res.json(leavesData)                    
    } else if(req.body.role_slug == "team_lead")  {      
        leavesData = await getLeaveRequestByTeamleadMod(req, res)
        return res.json(leavesData)                    
    } else {
      return res.json({ status: 309, msg: "Couldn't get data." })
    }
  } catch(e) { 
    console.error(e.message)
    leavesData = { status: 309, msg: e.message }
  }
 
  return res.json(leavesData)  
}


const getThisYearLeavesByEmployeeID = async (req, res) => { 
  let leavesData = []
  if(!req.body.role_slug || !req.body.emp_id || !req.body.id) {
    return;
  }  
  
  try{    
    if(req.body.emp_id != "" && req.body.role_slug != "" )  {                    
      leavesData = await getThisYearLeavesByEmployeeIDMod(req, res)        
      return res.json(leavesData)                    
    } else {
      return { status: 309, msg: "Access is Denied!!!" }
    }
  } catch(e) { 
    console.error(e.message)
    leavesData = { status: 309, msg: e.message }
  }
 
  return res.json(leavesData)  
}


const getApprovedLeaveRequest = async (req, res) => { 
  let leavesData = []
  if(!req.body || !req.body.role_slug) {
    return;
  }  
  
  try{    
    if(req.body.role_slug === "super_admin" )  {                    
      leavesData = await getApprovedLeaveRequestMod(req, res)        
      return res.json(leavesData)                    
    } else {
      return { status: 309, msg: "Access is Denied!!!" }
    }
  } catch(e) { 
    console.error(e.message)
    leavesData = { status: 309, msg: e.message }
  } 
  return res.json(leavesData)  
}


const getPendingLeaveRequest = async (req, res) => { 
  let leavesData = []
  if(!req.body || !req.body.role_slug) {
    return;
  }  
  
  try{    
    if(req.body.role_slug === "super_admin" )  {                    
      leavesData = await getPendingLeaveRequestMod(req, res)        
      return res.json(leavesData)                    
    } else {
      return { status: 309, msg: "Access is Denied!!!" }
    }
  } catch(e) { 
    console.error(e.message)
    leavesData = { status: 309, msg: e.message }
  } 
  return res.json(leavesData)  
}


const getLeaveReqByEmployeeId = async (req, res) => { 
  let rowData = []

  if (dataSource == "pgSQL") {
    rowData = await getLeaveReqByEmployeeIdMod(req, res)
    res.json(rowData)  
  }
}


const getLeaveReqByTeamLeadId = async (req, res) => { 
  let rowData = []

  if (dataSource == "pgSQL") {
    rowData = await getLeaveReqByTeamLeadIdMod(req, res)
    res.json(rowData)  
  }
}



const addLeaveRequest = async (req, res) => {
  
  if (!req.body || !req.body.id || !req.body.role_slug || !req.body.emp_id) {
    return {}
  }
  
  if (!req.body.emp_id || !req.body.role_slug) {
    return res.json({ status: 309, msg: "Invalid request!" })
  } else {
    let response = await addLeaveRequestMod(req, res)
    res.json(response)    
  }
}

const responseLeaveRequest = async (req, res) => {
  
  if (!req.body || !req.body.id || !req.body.role_slug || !req.body.request_id) {
    return {}
  }
  
  if (req.body.role_slug == "super_admin" || req.body.role_slug == "manager" || req.body.role_slug == "team_lead" || req.body.role_slug == "administrator" || req.body.role_slug == "member") {
    let response = await responseLeaveRequestMod(req, res)
    res.json(response)    
  } else {    
    return res.json({ status: 309, msg: "Access denied!" })
  }
}


const updateLeaveRequest = async (req, res) => {
  if (!req.body) {
    req.body = {}
  }

  let request_id = 0
  try {
    request_id = (!req.body.request_id ? 0 : req.body.request_id)    
  } catch (e) {}
   
  if (!request_id) {
    return res.json({ status: 309, msg: "Select Employee/Leaves to Update !!!" })
  } else {
    if (dataSource == "pgSQL") {
      let response = await updateLeaveRequestMod(req, res)
      res.json(response)
    } 
  }
}


const deleteLeaveRequest = async (req, res) => {
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
      let resp = await deleteLeaveRequestMod(req, res)      
      if(resp.status == 200) {
        return res.json({ status: 200, msg: "Role Deleted Successfully !" })
      } else {
        return res.json({ status: 309, msg: "Role could not Delete !!!" })
      }
    } 
    
  }
}


module.exports = { 
  getLeaveRequests,
  getThisYearLeavesByEmployeeID,
  responseLeaveRequest,
  getApprovedLeaveRequest,
  getPendingLeaveRequest,
  getLeaveReqByEmployeeId, 
  getLeaveReqByTeamLeadId,
  addLeaveRequest,
  deleteLeaveRequest,
  updateLeaveRequest
}
