const dbConnection = require("../db-config").pool
let rowRecords = {}


const getAllLeaveRequestMod = async (req, res) => {
  let response = { status: 409, msg: "Leave Request not found." }
  
  try{
    response = await dbConnection.query(`
        SELECT DISTINCT emp.*,
          req.request_id, req.request_from_day, req.request_from_month, req.request_from_year, req.request_to_day, req.request_to_month, req.request_to_year, req.request_reason, req.leaves_type, req.status, req.approved_by, req.no_of_days, leaves_start_time, leaves_end_time,
          dep.dept_title, dep.dept_desc,
          des.desig_title, des.desig_desc
          FROM tbl_employee emp 
          FULL OUTER JOIN tbl_emp_leaves_request req ON emp.emp_id=req.emp_id
          INNER JOIN tbl_department dep ON emp.dept_id=dep.dept_id
          INNER JOIN tbl_designation des ON emp.desig_id=des.desig_id        
        WHERE (req.request_from_year=${req.body.year} OR req.request_to_year=${req.body.year}) AND req.status='${req.body.status}'
        `)        
    rowRecords = response.rows    
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}


const getLeaveRequestByTeamleadMod = async (req, res) => {
  let response = { status: 409, msg: "Leave Request not found." }
  
  try{
    response = await dbConnection.query(`
        SELECT DISTINCT emp.*,
          req.request_id, req.request_from_day, req.request_from_month, req.request_from_year, req.request_to_day, req.request_to_month, req.request_to_year, req.request_reason, req.leaves_type, req.status, req.approved_by, req.no_of_days, leaves_start_time, leaves_end_time,
          dep.dept_title, dep.dept_desc,
          des.desig_title, des.desig_desc
          FROM tbl_employee emp 
          FULL OUTER JOIN tbl_emp_leaves_request req ON emp.emp_id=req.emp_id
          INNER JOIN tbl_department dep ON emp.dept_id=dep.dept_id
          INNER JOIN tbl_designation des ON emp.desig_id=des.desig_id   
          INNER JOIN tbl_emp_teamlead led ON emp.emp_id=led.emp_id OR emp.emp_id=led.teamlead_id     
        WHERE (req.request_from_year=${req.body.year} OR req.request_to_year=${req.body.year}) AND req.status='${req.body.status}' AND led.teamlead_id=${req.body.id}
        `)        
    rowRecords = response.rows    
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}


const getLeaveRequestByEmpIdMod = async (req, res) => {
  let response = { status: 409, msg: "Leave Request not found." }
  
  try{    
    response = await dbConnection.query(`
        SELECT DISTINCT emp.*,
          req.request_id, req.request_from_day, req.request_from_month, req.request_from_year, req.request_to_day, req.request_to_month, req.request_to_year, req.request_reason, req.leaves_type, req.status, req.approved_by, req.no_of_days, leaves_start_time, leaves_end_time,
          dep.dept_title, dep.dept_desc,
          des.desig_title, des.desig_desc
          FROM tbl_employee emp 
          FULL OUTER JOIN tbl_emp_leaves_request req ON emp.emp_id=req.emp_id
          INNER JOIN tbl_department dep ON emp.dept_id=dep.dept_id
          INNER JOIN tbl_designation des ON emp.desig_id=des.desig_id             
        WHERE (req.request_from_year=${req.body.year} OR req.request_to_year=${req.body.year}) AND req.status='${req.body.status}' AND emp.emp_id=${req.body.id}
          ORDER BY req.request_id
        `)        
        
    rowRecords = response.rows    
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}



const getThisYearLeavesByEmployeeIDMod = async (req, res) => {
  let response = { status: 409, msg: "Leave Request not found." }
  const dat = new Date();  
  const month = dat.getMonth() + 1
  const day = dat.getDate()
  const year = dat.getFullYear() 
    
  try{
    response = await dbConnection.query(`
        SELECT * FROM tbl_emp_leaves_request          
        where emp_id=${req.body.emp_id} AND (request_from_year=${year} OR request_from_year=${year+1} OR request_to_year=${year} OR request_to_year=${year+1}) 
        ORDER BY request_from_year,request_from_month DESC
    `)
    rowRecords = response.rows
  } catch(e) { 
    console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}


const getApprovedLeaveRequestMod = async (req, res) => {
  let response = { status: 409, msg: "Leaves not found." }
  const dat = new Date();  
  const month = dat.getMonth() + 1
  const day = dat.getDate()
  const year = dat.getFullYear() 
  const todayDate = year + "-" + month + "-" + day
  
  try{
    response = await dbConnection.query(`
        SELECT * FROM tbl_emp_leaves_request          
        WHERE CONCAT(request_to_year, '-', request_to_month, '-', request_to_day)>='${todayDate}' AND status='Approved'
    `)
    rowRecords = response.rows
  } catch(e) { 
    console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}


const getPendingLeaveRequestMod = async (req, res) => {
  let response = { status: 409, msg: "Leaves not found." }
  const dat = new Date();  
  const month = dat.getMonth() + 1
  const day = dat.getDate()
  const year = dat.getFullYear() 
  
  try{
    response = await dbConnection.query(`
        SELECT * FROM tbl_emp_leaves_request          
        where (request_from_year>=${year} AND request_to_year<=${year+1}) AND (request_from_month>=${month} AND request_to_month<=${month+1}) AND status='Pending'
    `)
    rowRecords = response.rows
  } catch(e) { 
    console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}


const addLeaveRequestMod = async (req, res) => {
    let response = { status: 409, msg: "Leaves Request Adding Failed." }
    
    let resp = await insertDB(req, res)   
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Leaves Request Created Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Leaves Request Creation Failed!!!`,
      })
    }  
}


const responseLeaveRequestMod = async (req, res) => {  
  let rowRecords = []
  try{        
    
    await dbConnection.query(`
      UPDATE tbl_emp_leaves_request SET
        approved_by='${req.body.approved_by}', status='${req.body.status}'
      WHERE request_id=${req.body.request_id}
    `)
    if(req.body.status == "Approved") {
      // get leaves record
      response = await dbConnection.query(`
        SELECT * FROM tbl_emp_leaves WHERE emp_id=${req.body.emp_id}
      `)
      rowRecords = response.rows[0]
      // set leaves record
      let availed = rowRecords.leaves_availed + req.body.no_of_days
      let remaining = rowRecords.leaves_remaining - req.body.no_of_days
      if(remaining < 0) remaining = 0
      // update leaves record
      await dbConnection.query(`
        UPDATE tbl_emp_leaves SET
        leaves_availed=${availed}, leaves_remaining=${remaining}, leaves_total=${remaining}
        WHERE emp_id=${req.body.emp_id}
      `)
    }
    return { status: 200, msg: "Leave Request Updated Successfully !" }
  } catch(e) { console.error(e.message)}
  
  return { status: 309, msg: "Leave Request cann't Update!" }
}


const updateLeaveRequestMod = async (req, res) => {    
    let resp = await updateDB(req, res)    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Leaves Request From <strong> ${req.body.request_from_day}/${req.body.request_from_month}/${req.body.request_from_year} to ${req.body.request_to_day}/${req.body.request_to_month}/${req.body.request_to_year}  </strong> Updated Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Leaves Request Updation Failed !!!`,
      })
    }
    
  
}


const deleteLeaveRequestMod = async (req, res) => {        
    let resp = await deleteDB(req, res)
    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Leave Request Deleted Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Leave Request Deletion Failed!!!`,
      })
    }
}


const insertDB = async (req, res) => {  
  let resp = 0  
  
  try{             
    await dbConnection.query(`
      INSERT INTO tbl_emp_leaves_request(emp_id, request_from_day, request_from_month, request_from_year, request_to_day, 
        request_to_month, request_to_year, request_reason, leaves_type, status, approved_by, no_of_days, leaves_start_time, leaves_end_time) 

      VALUES (${req.body.emp_id}, ${req.body.request_from_day}, ${req.body.request_from_month}, ${req.body.request_from_year}, 
        ${req.body.request_to_day}, ${req.body.request_to_month}, ${req.body.request_to_year}, '${req.body.request_reason}',
        '${req.body.leaves_type}', '${req.body.status}', '', ${req.body.no_of_days}, '${req.body.leaves_start_time}', '${req.body.leaves_end_time}')
    `)  
    resp = 1        
  } catch(e) { 
    console.error(e.message)
  }
  
  return resp
}


const deleteDB = async (req, res) => {  
  let resp = 0  
  try {
    if(req.params.id == -123) {
      await dbConnection.query(`DELETE FROM tbl_emp_leaves_request`)          
    } else {
      await dbConnection.query(`DELETE FROM tbl_emp_leaves_request WHERE request_id =${req.params.id}`)      
    }
    
    resp = 1
  } catch(e) { console.error(e.message)}

  return resp  
}


const updateDB = async (req, res) => {  
  let resp = 0
  try{        
    await dbConnection.query(`
      UPDATE tbl_emp_leaves_request SET
        emp_id=${req.body.emp_id}, request_from_day='${req.body.request_from_day}', request_from_month='${req.body.request_from_month}', 
        request_from_year='${req.body.request_from_year}', request_to_day='${req.body.request_to_day}', request_to_month='${req.body.request_to_month}', 
        request_to_year='${req.body.request_to_year}', request_type='${req.body.request_type}', request_notes='${req.body.request_notes}', 
        reason='${req.body.reason}', leaves_type='${req.body.leaves_type}', status='${req.body.status}', report_to='${req.body.report_to}', 
        approved_by='${req.body.approved_by}', no_of_days=${req.body.no_of_days}
      WHERE request_id=${req.body.request_id}
    `)
    resp = 1        
  } catch(e) { console.error(e.message)}
  
  return resp
}


const isExists = async (req, res, rows) => {   
  let response = { status: 309, msg: "Sorry! You cannot Put Leaves Request" }
  try{
    for(let key in rows) {
      let emp_id = 0
      let day = day2 = month = month1 = year = year1 = pending = availed = false
        for (let key1 in rows[key]) {          
          if(key1 == "request_from_day" && parseInt(req.body.request_from_day) <= parseInt(rows[key][key1])) day = true
          if(key1 == "request_from_month" && rows[key][key1] == req.body.request_from_month) month = true
          if(key1 == "request_from_year" && rows[key][key1] == req.body.request_from_year) year = true
          if(key1 == "status" && rows[key][key1] == "Pending") pending = true
          
          if(key1 == "request_to_day" && parseInt(req.body.request_to_day) <= parseInt(rows[key][key1])) day1 = true
          if(key1 == "request_to_month" && rows[key][key1] == req.body.request_to_month) month1 = true
          if(key1 == "request_to_year" && rows[key][key1] == req.body.request_to_year) year1 = true
          if(key1 == "status" && rows[key][key1] == "Availed") availed = true                    
          
        }
        if(day && month && year && pending) {
          response = { status: 309, msg: "You have already Pending Leaves Request." }
          console.log(emp_id + " > Has pending requsted")
        } else if(day1 && month1 && year1 && availed) {
          response = { status: 309, msg: "You have Availed Leaves on these Days." }
          console.log(emp_id + " > Has availed")
        } else {
          response = { status: 200, msg: "You have Availed Leaves on these Days." }
        }         
    }
  } catch(e) {console.error(e.message)}
  
  return response 
}



module.exports = { 
  getAllLeaveRequestMod,
  getLeaveRequestByTeamleadMod,
  getLeaveRequestByEmpIdMod,
  getThisYearLeavesByEmployeeIDMod,
  addLeaveRequestMod, 
  responseLeaveRequestMod,
  getApprovedLeaveRequestMod,
  getPendingLeaveRequestMod,
  deleteLeaveRequestMod,
  updateLeaveRequestMod
}
