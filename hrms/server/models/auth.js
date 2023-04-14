const dbConnection = require("../db-config").pool
let rowRecords = {}

const getThisMonthAttendanceMod = async () => {
  let response = { status: 409, msg: "Attendance not found." }
  try{
    let d = new Date()
    let year = d.getFullYear()
    let month = d.getMonth() + 1
    response = await dbConnection.query(`
      SELECT DISTINCT * FROM tbl_employee_attendance
        where in_year=${year} AND in_month=${month}
        ORDER BY emp_id,in_day
    `)    
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
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
        ORDER BY in_year,in_day
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


const addRoleMod = async (req, res) => {
  let response = { status: 409, msg: "Attendance Adding Failed." }
  let resp = await isExistsDB(req.body.role_title)

  if (resp > 0) { 
    return (response = {
      status: 309,
      msg: `Attendance <strong> ${req.body.role_title} </strong> Already Exixts`,
    })
  } else {    
    let resp = await insertDB(req, res)
    console.log(resp)
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Attendance <strong> ${req.body.role_title}  </strong> Created Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Attendance <strong> ${req.body.role_title}  </strong> Creation Failed!!!`,
      })
    }
  }
}


const updateRoleMod = async (req, res) => {    
    let resp = await updateDB(req, res)    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Attendance <strong> ${req.body.role_title} </strong> Updated Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Attendance <strong> ${req.body.role_title}  </strong> Updation Failed !!!`,
      })
    }
    
  
}


const deleteRoleMod = async (req, res) => {        
    let row = await getAttendanceByEmpIdMod(req, res) 
    let resp = await deleteDB(req, res)
    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Attendance <strong>  </strong> Deleted Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Attendance Deletion Failed!!!`,
      })
    }
}


const insertDB = async (req, res) => {  
  let resp = 0
  const slug = req.body.role_title.toLowerCase().replace(/ /g,"_")
  try{             
    await dbConnection.query(`
        INSERT INTO tbl_employee_attendance (role_title, role_slug, role_desc, is_active)         
        VALUES ('${req.body.role_title}', '${slug}', '${req.body.role_desc}', '${1}')
    `)  
    resp = 1        
  } catch(e) { console.error(e.message)}
  
  return resp
}


const deleteDB = async (req, res) => {  
  let resp = 0  
  try {
    if(req.body.id == -1) {
      await dbConnection.query(`DELETE FROM tbl_employee_attendance`)          
    } else {
      await dbConnection.query(`DELETE FROM tbl_employee_attendance WHERE role_id =${req.params.id}`)      
    }
    
    resp = 1
  } catch(e) { console.error(e.message)}

  return resp  
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
  getAttendanceByEmpIdMod,
  getAttendanceByLeadIdMod,
  addRoleMod, 
  deleteRoleMod,
  updateRoleMod
}
