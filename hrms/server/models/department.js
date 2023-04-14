const dbConnection = require("../db-config").pool
let rowRecords = {}

const getAllDepartment = async () => {
  let response = { status: 409, msg: "Department not found." }
  try{
    response = await dbConnection.query(`SELECT DISTINCT dept_id, dept_title, dept_desc, is_active FROM tbl_department ORDER BY dept_id`)
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}

const getDepartmentByID = async (req, res) => {
  let response = { status: 409, msg: "Department not found." }
  try {
    response = await dbConnection.query(`SELECT DISTINCT dept_id, dept_title, dept_desc, is_active FROM tbl_department where dept_id=${req.params.id}`)
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}


const addDepartment = async (req, res) => {
  let response = { status: 409, msg: "Department Adding Failed." }
  let resp = await isExistsDB(req.body.dept_title)

  if (resp > 0) { 
    return (response = {
      status: 309,
      msg: `Department <strong> ${req.body.dept_title} </strong> Already Exixts`,
    })
  } else {    
    let resp = await insertDB(req, res)
    console.log(resp)
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Department <strong> ${req.body.dept_title}  </strong> Created Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Department <strong> ${req.body.dept_title}  </strong> Creation Failed!!!`,
      })
    }
  }
}


const updateDepartment = async (req, res) => {    
    let resp = await updateDB(req, res)    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Department <strong> ${req.body.dept_title} </strong> Updated Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Department <strong> ${req.body.dept_title}  </strong> Updation Failed !!!`,
      })
    }
    
  
}


const deleteDepartment = async (req, res) => {    
    let resp = await deleteDB(req, res)    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Department <strong> ${req.body.dept_title} </strong> Deleted Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Department Deletion Failed!!!`,
      })
    }
}


const insertDB = async (req, res) => {  
  let resp = 0
  try{             
    await dbConnection.query(`
        INSERT INTO tbl_department (dept_title, dept_desc, is_active)         
        VALUES ('${req.body.dept_title}', '${req.body.dept_desc}', '${1}')
    `)  
    resp = 1        
  } catch(e) { console.error(e.message)}
  
  return resp
}


const deleteDB = async (req, res) => {  
  let resp = 0  
  try {
    if(req.body.id == -1) {
      await dbConnection.query(`DELETE FROM tbl_department`)          
    } else {
      await dbConnection.query(`DELETE FROM tbl_department WHERE dept_id =${req.body.id}`)      
    }
    
    resp = 1
  } catch(e) { console.error(e.message)}

  return resp  
}


const updateDB = async (req, res) => {  
  let resp = 0
  try{             
    await dbConnection.query(`UPDATE tbl_department SET dept_title='${req.body.dept_title}', dept_desc='${req.body.dept_desc}' WHERE dept_id=${req.body.id}`)
    resp = 1        
  } catch(e) { console.error(e.message)}
  
  return resp
}


const isExistsDB = async (title="") => {
  let resp = 0
  let res = []
  
  try {
    res = await dbConnection.query(`SELECT dept_title FROM tbl_department WHERE dept_title ='${title}'`)    
    resp = res.rows.length    
  } catch(e) { console.error(e.message)}
  
  return resp  
}



module.exports = { 
  getAllDepartment, 
  getDepartmentByID,
  addDepartment, 
  deleteDepartment,
  updateDepartment
}
