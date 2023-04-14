const { dataSource } = require("../data-source")

const {
  getSettingMOD,
  updateSettingMOD,
  deleteAllLeavesMOD,
  deleteAllAttendanceMOD,
  deleteAllPayslipMOD,
  deleteEmployeeByIdMOD,
  resetAllUsersPasswordMod 
} = require("../models/settings")

const roleArray = ["super_admin", "administrator", "manager"]


const getSetting = async (req, res) => { 
  let settingData = {}
  if(!req.body || !req.body.role_slug || !roleArray.includes(req.body.role_slug)) {
    return;
  }
      
  try {
    settingData = await getSettingMOD(req, res)
    return res.json(settingData)  
  } catch(e){}
}


const updateSetting = async (req, res) => { 
  let settingData = {}
  if(!req.body || !req.body.role_slug || !roleArray.includes(req.body.role_slug)) {
    return;
  }

  try {
    settingData = await updateSettingMOD(req, res)
    return res.json(settingData)  
  } catch(e){}
}



const deleteAllLeaves = async (req, res) => { 
  let levData = {}
  if(!req.body || !req.body.role_slug || !roleArray.includes(req.body.role_slug)) {
    return;
  }

  try {
    levData = await deleteAllLeavesMOD(req, res)
    return res.json(levData)  
  } catch(e){}
}



const deleteAllAttendance = async (req, res) => { 
  let attData = {}
  if(!req.body || !req.body.role_slug || !roleArray.includes(req.body.role_slug)) {
    return;
  }

  try {
    attData = await deleteAllAttendanceMOD(req, res)
    return res.json(attData)  
  } catch(e){}
}


const deleteAllPayslip = async (req, res) => { 
  let attData = {}
  
  if(!req.body || !req.body.role_slug || !roleArray.includes(req.body.role_slug)) {
    return;
  }
  
  try {
    attData = await deleteAllPayslipMOD(req, res)
    return res.json(attData)  
  } catch(e){}
}



const deleteEmployeeById = async (req, res) => { 
  let empData = {}
  if(!req.body) {
    return;
  }

  try {
    if(!req.body.emp_id || !req.body.role_slug || !roleArray.includes(req.body.role_slug)) {
      return;
    } else {
      empData = await deleteEmployeeByIdMOD(req, res)
      return res.json(empData)  
    }
    
  } catch(e){}
}


const resetAllUsersPassword = async (req, res) => { 
  let empData = {}
  if(!req.body) {
    return;
  }

  try {
    if(!req.body.role_slug || !roleArray.includes(req.body.role_slug)) {      
      return;
    } else {
      empData = await resetAllUsersPasswordMod(req, res)
      return res.json(empData)  
    }
    
  } catch(e){}
}


module.exports = { 
    getSetting,
    updateSetting,
    deleteAllLeaves,
    deleteAllAttendance,
    deleteAllPayslip,
    deleteEmployeeById,
    resetAllUsersPassword
}
