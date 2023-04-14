const { dataSource } = require("../data-source")

const {
  getThisMonthAttendanceMod,
  getAttendanceByIdMod,
  punchInMod,
  getTodayAttendanceMod,
  getAttendanceByEmpIdMod,
  addAttendanceArrayMod
} = require("../models/attendance")


const getAttendanceById = async (req, res) => { 
  let attendanceData = {}
  if(!req.body || !req.body.attendance_id) {
    return;
  }

  try {
    attendanceData = await getAttendanceByIdMod(req, res)
    return res.json(attendanceData)  
  } catch{}
}

const getThisMonthAttendance = async (req, res) => { 
  let attendanceData = []

  try {
    attendanceData = await getThisMonthAttendanceMod(req, res)
    return res.json(attendanceData)  
  } catch{}
}

const punchIn = async (req, res) => { 
  let attendanceData = []  
  if(!req.body.emp_id || !req.body.role_slug){
    return;
  }
  
  try {
    attendanceData = await punchInMod(req, res)   
    return res.json(attendanceData)  
  } catch{}
}


const getTodayAttendance = async (req, res) => { 
  let attendanceData = []  
  
  if(!req.body || !req.body.role_slug){
    return;
  }
  
  try {
    attendanceData = await getTodayAttendanceMod(req, res)       
    return res.json(attendanceData)  
  } catch(e){console.log(e.message)}
}


const getAttendanceByEmpID = async (req, res) => { 
  let attendanceData = []

  try {
    attendanceData = await getAttendanceByEmpIdMod(req, res)
    return res.json(attendanceData)  
  } catch{}
}


const addAttendanceArray = async (req, res) => { 
  let attendanceData = []
  if(!req.body) {
    return;
  }

  try {
    attendanceData = await addAttendanceArrayMod(req, res)
    return res.json(attendanceData)  
  } catch{}
}




module.exports = { 
  getThisMonthAttendance,
  getAttendanceById,
  punchIn,
  getTodayAttendance,
  getAttendanceByEmpID,
  addAttendanceArray
}
