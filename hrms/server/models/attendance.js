const { request } = require("express")

const dbConnection = require("../db-config").pool
let rowRecords = {}


const getAttendanceByIdMod = async (req, res) => {
  let response = { status: 409, msg: "Attendance not found." }
    
  try{
    response = await dbConnection.query(`
      SELECT * FROM tbl_employee_attendance
        where attendance_id=${req.body.attendance_id} 
    `)    
    rowRecords = response.rows[0]    
  } catch(e) { console.error(e.message)
    rowRecords = {}
  }
  return rowRecords
}


const getThisMonthAttendanceMod = async (req, res) => {
  let response = { status: 409, msg: "Attendance not found." }
  
  try{   
    response = await dbConnection.query(`
      SELECT DISTINCT * FROM tbl_employee_attendance
        where in_year=${req.body.year} AND in_month=${req.body.month} 
      ORDER BY in_day DESC, in_month DESC, in_year DESC 
    `)    
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}


const getTodayAttendanceMod = async (req, res) => {
  let response = { status: 409, msg: "Attendance not found." }  
  
  try{
    let query = " AND rol.role_slug<>'super_admin'"
    if(req.body.emp_id) {
      query = ` AND emp.emp_id=${req.body.emp_id}`
    }
    
    //AND emp_status='${req.body.status}'
    response = await dbConnection.query(`
      SELECT DISTINCT * FROM tbl_employee_attendance att
        INNER JOIN tbl_employee emp ON emp.emp_id=att.emp_id
        INNER JOIN tbl_role rol ON emp.role_id=rol.role_id
        where in_year=${req.body.year} AND in_month=${req.body.month} AND in_day=${req.body.date} ${query}
      ORDER BY in_day DESC, in_month DESC, in_year DESC
    `)
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}

const punchInMod = async (req, res) => {
  let responseRet = { status: 409, msg: "Could not punch in attendance." }  
  if(!req.body){
    return;
  }

  let pak_date_string = new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" });
  let date_pak = new Date(pak_date_string);

  //let am_pm = date_pak.toLocaleTimeString().slice(-2)
  //let time = date_pak.toLocaleTimeString().slice(0,5) + ' ' + am_pm
  let time = date_pak.toLocaleTimeString()
    
  try{    
    response = await dbConnection.query(`
      SELECT attendance_id, in_day,in_month,in_year,in_time,in_notes,is_present,emp_status,emp_id FROM tbl_employee_attendance
      WHERE in_day=${req.body.date} and in_month=${req.body.month} and in_year=${req.body.year} and emp_id=${req.body.emp_id}        
    `)       
    let status = "Present"
    if(response.rows.length) {
      status = response.rows[0].emp_status
    }

    let reason = ""
    if(req.body.reason) {
      reason = req.body.reason
    }
    
    if(req.body.allow_punch) {
      if(response.rows.length == 0) { 
        response = await dbConnection.query(`
          INSERT INTO tbl_employee_attendance(in_day,in_month,in_year,in_time,is_present,emp_status,emp_id,in_notes)
          VALUES(${req.body.date},${req.body.month},${req.body.year},'${time}',1,'${req.body.status}',${req.body.emp_id},'${reason}')        
        `)                 
      } else {
        response = await dbConnection.query(`
          UPDATE tbl_employee_attendance 
          SET in_day=${req.body.date}, in_month=${req.body.month}, in_year=${req.body.year}, in_time='${req.body.time}', is_present=1, emp_status='${req.body.status}', in_notes='${reason}'        
          WHERE attendance_id=${response.rows[0].attendance_id}
        `)    
        status = req.body.status
      }      
    }
    responseRet = {status : status, time : time}    
    
  } catch(e) { console.error(e.message)
    responseRet = {status:'Fail', message: e.message}
  }
  return responseRet
}

const getAttendanceByEmpIdMod = async (req, res) => {
  let response = { status: 409, msg: "Attendance not found." }
  try {
    let d = new Date()
    let year = d.getFullYear()
    let month = d.getMonth() + 1
    response = await dbConnection.query(`
      SELECT DISTINCT * FROM tbl_employee_attendance
        where in_year=${year} AND in_month=${month} AND emp_id=${req.body.emp_id}
      ORDER BY in_day DESC, in_month DESC, in_year DESC
    `)    
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}


const getAttendanceByLeadIdMod = async (req, res) => {
  let response = { status: 409, msg: "Attendance not found." }
  try {
    response = await dbConnection.query(`SELECT DISTINCT attendance_id, emp_id, is_present, in_day, in_month, in_year, in_time, in_by, in_notes, out_day, out_month, out_year, out_time, out_by, out_notes, emp_status FROM tbl_employee_attendance where emp_id=${req.params.id}`)
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
} 


const addAttendanceArrayMod = async (req, res) => {
  let response = { status: 200, msg: "Successfully added attendance records." }
  try{            
    for(let i=0; i<req.body.leavesAttendanceRecs.length; i++) { 
      let resp = await dbConnection.query(`
        SELECT * FROM tbl_employee_attendance
        WHERE emp_id=${req.body.emp_id} AND in_day=${req.body.leavesAttendanceRecs[i].in_day} AND in_month=${req.body.leavesAttendanceRecs[i].in_month} AND in_year=${req.body.leavesAttendanceRecs[i].in_year}
      `)  
      if(resp.rows.length > 0) {
        await dbConnection.query(`
          UPDATE tbl_employee_attendance SET is_present=0, emp_status='${req.body.leavesAttendanceRecs[i].emp_status}', in_time=''
          WHERE emp_id=${req.body.emp_id} AND in_day=${req.body.leavesAttendanceRecs[i].in_day} AND in_month=${req.body.leavesAttendanceRecs[i].in_month} AND in_year=${req.body.leavesAttendanceRecs[i].in_year}
        `) 
      } else {
        await dbConnection.query(`
          INSERT INTO tbl_employee_attendance(in_day,in_month,in_year,in_time,is_present,emp_status,emp_id)
          VALUES(${req.body.leavesAttendanceRecs[i].in_day}, ${req.body.leavesAttendanceRecs[i].in_month}, ${req.body.leavesAttendanceRecs[i].in_year},'',0,'${req.body.leavesAttendanceRecs[i].emp_status}',${req.body.emp_id})        
        `)  
      }
    } 
  } catch(e) { console.error(e.message)
    response = { status: 409, msg: "Fail: " + e.message }
  }

  return response;  
}


const updateDB = async (req, res) => {  
  let resp = 0
  try{        
    const slug = req.body.role_title.toLowerCase().replace(/ /g,"_")     
    await dbConnection.query(`UPDATE tbl_employee_attendance SET role_title='${req.body.role_title}', role_desc='${req.body.role_desc}', role_slug='${slug}' WHERE role_id=${req.body.id}`)
    resp = 1        
  } catch(e) { console.error(e.message)}
  
  return resp
}


const isExistsDB = async (title="") => {
  let resp = 0
  let res = []
  
  try {
    res = await dbConnection.query(`SELECT role_title FROM tbl_employee_attendance WHERE role_title ='${title}'`)    
    resp = res.rows.length    
  } catch(e) { console.error(e.message)}
  
  return resp  
}



module.exports = { 
  getThisMonthAttendanceMod, 
  getAttendanceByIdMod,
  punchInMod,
  getTodayAttendanceMod,
  getAttendanceByEmpIdMod,
  getAttendanceByLeadIdMod,
  addAttendanceArrayMod 
}
