const dbConnection = require("../db-config").pool
let rowRecords = {}


const getAllLeaveMod = async (req, res) => {
  let response = { status: 409, msg: "Leaves not found." }
  try {
    response = await dbConnection.query(`
      SELECT DISTINCT emp.*, 
        lev.leaves_id, lev.total_leaves, lev.availed_leaves, lev.remaining_leaves, lev.leaves_alloted,
        dep.dept_title, dep.dept_desc,
        des.desig_title, des.desig_desc
        FROM tbl_employee emp 
        FULL OUTER JOIN tbl_emp_leaves lev ON emp.emp_id=lev.emp_id
        INNER JOIN tbl_department dep ON emp.dept_id=dep.dept_id
        INNER JOIN tbl_designation des ON emp.desig_id=des.desig_id        
      `)
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}


const getLeaveByEmpIdMod = async (req, res) => {
  let response = { status: 409, msg: "Leaves not found." }
  try {
    response = await dbConnection.query(`
      SELECT DISTINCT emp.*, 
        lev.leaves_id, lev.total_leaves, lev.availed_leaves, lev.remaining_leaves, lev.leaves_alloted,
        dep.dept_title, dep.dept_desc,
        des.desig_title, des.desig_desc
        FROM tbl_employee emp
        INNER JOIN tbl_emp_leaves lev ON emp.emp_id=lev.emp_id
        INNER JOIN tbl_department dep ON emp.dept_id=dep.dept_id
        INNER JOIN tbl_designation des ON emp.desig_id=des.desig_id
        WHERE lev.emp_id=${req.body.id}      
      `)
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}


const getLeaveByTeamLeadIDMod = async (req, res) => {
  let response = { status: 409, msg: "Leaves not found." }
  try {
    response = await dbConnection.query(`
        SELECT DISTINCT emp.*, 
        lev.leaves_id, lev.total_leaves, lev.availed_leaves, lev.remaining_leaves, lev.leaves_alloted,
        dep.dept_title, des.desig_title, 
        des.desig_title, des.desig_desc
        FROM tbl_employee emp
        FULL OUTER JOIN tbl_emp_leaves lev ON emp.emp_id=lev.emp_id
        INNER JOIN tbl_department dep ON emp.dept_id=dep.dept_id
        INNER JOIN tbl_designation des ON emp.desig_id=des.desig_id
        LEFT JOIN tbl_emp_teamlead led ON emp.emp_id=led.emp_id
        where led.teamlead_id=${req.body.id} 
      `)
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}


const addLeaveMod = async (req, res) => {
  let response = { status: 409, msg: "Leave Adding Failed." }
  let resp = await isExistsDB(req.body.emp_id)

  if (resp > 0) { 
    return (response = {
      status: 309,
      msg: `Leave for Employee Already Exists`,
    })
  } else {    
    let resp = await insertDB(req, res)    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Leave for Employee Created Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Leave Creation Failed!!!`,
      })
    }
  }
}


const updateLeaveMod = async (req, res) => {    
    let resp = await updateDB(req, res)    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Leave Updated Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Leave Updation Failed !!!`,
      })
    }
}


const deleteLeaveMod = async (req, res) => {        
    let resp = await deleteDB(req, res)
    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Leave Deleted Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Leave Deletion Failed!!!`,
      })
    }
}


const insertDB = async (req, res) => {  
  let resp = 0
  try{             
    await dbConnection.query(`
        INSERT INTO tbl_emp_leaves (emp_id, total_leaves, availed_leaves, remaining_leaves, leaves_alloted)         
        VALUES (${req.body.emp_id}, ${req.body.total_leaves}, ${req.body.availed_leaves}, ${req.body.remaining_leaves}, ${req.body.leaves_alloted})
    `)  
    resp = 1        
  } catch(e) { console.error(e.message)}
  
  return resp
}


const deleteDB = async (req, res) => {  
  let resp = 0  
  try {
    if(req.body.id == -123) {
      await dbConnection.query(`DELETE FROM tbl_emp_leaves`)          
    } else {
      await dbConnection.query(`DELETE FROM tbl_emp_leaves WHERE leaves_id =${req.params.id}`)      
    }
    
    resp = 1
  } catch(e) { console.error(e.message)}

  return resp  
}


const updateDB = async (req, res) => {  
  let resp = 0
  try{        
    await dbConnection.query(`UPDATE tbl_emp_leaves SET leaves_total=${req.body.leaves_total}, leaves_availed=${req.body.leaves_availed}, leaves_remaining=${req.body.leaves_remaining}, leaves_alloted=${req.body.leaves_alloted} WHERE emp_id=${req.body.emp_id}`)
    resp = 1        
  } catch(e) { console.error(e.message)}
  
  return resp
}


const isExistsDB = async (id=0) => {
  let resp = 0
  
  try {
    res = await dbConnection.query(`SELECT leaves_id, emp_id, total_leaves, availed_leaves, remaining_leaves, leaves_alloted FROM tbl_emp_leaves WHERE emp_id=${id}`)    
    resp = res.rows.length    
    rowRecords = res.rows
  } catch(e) { console.error(e.message)}
  
  return resp  
}



module.exports = { 
  getAllLeaveMod,
  getLeaveByEmpIdMod,
  getLeaveByTeamLeadIDMod,
  addLeaveMod, 
  deleteLeaveMod,
  updateLeaveMod
}
