const dbConnection = require("../db-config").pool
let rowRecords = {}

const getAllDesignation = async () => {
  let response = { status: 409, msg: "Designation not found." }
  try{
    response = await dbConnection.query(`SELECT DISTINCT desig_id, desig_title, desig_desc, is_active FROM tbl_designation ORDER BY desig_id`)
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}

const getDesignationByID = async (req, res) => {
  let response = { status: 409, msg: "Designation not found." }
  try {
    response = await dbConnection.query(`SELECT DISTINCT desig_id, desig_title, desig_desc, is_active FROM tbl_designation where desig_id=${req.params.id}`)
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}


const addDesignation = async (req, res) => {
  let response = { status: 409, msg: "Designation Adding Failed." }
  let resp = await isExistsDB(req.body.desig_title)

  if (resp > 0) { 
    return (response = {
      status: 309,
      msg: `Designation <strong> ${req.body.desig_title} </strong> Already Exixts`,
    })
  } else {    
    let resp = await insertDB(req, res)
    console.log(resp)
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Designation <strong> ${req.body.desig_title}  </strong> Created Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Designation <strong> ${req.body.desig_title}  </strong> Creation Failed!!!`,
      })
    }
  }
}


const updateDesignation = async (req, res) => {    
    let resp = await updateDB(req, res)    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Designation <strong> ${req.body.desig_title} </strong> Updated Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Designation <strong> ${req.body.desig_title}  </strong> Updation Failed !!!`,
      })
    }
    
  
}


const deleteDesignation = async (req, res) => {        
    let row = await getDesignationByID(req, res) 
    let resp = await deleteDB(req, res)
    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Designation <strong>  </strong> Deleted Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Designation Deletion Failed!!!`,
      })
    }
}


const insertDB = async (req, res) => {  
  let resp = 0
  try{             
    await dbConnection.query(`
        INSERT INTO tbl_designation (desig_title, desig_desc, is_active)         
        VALUES ('${req.body.desig_title}', '${req.body.desig_desc}', '${1}')
    `)  
    resp = 1        
  } catch(e) { console.error(e.message)}
  
  return resp
}


const deleteDB = async (req, res) => {  
  let resp = 0  
  try {
    if(req.body.id == -1) {
      await dbConnection.query(`DELETE FROM tbl_designation`)          
    } else {
      await dbConnection.query(`DELETE FROM tbl_designation WHERE desig_id =${req.params.id}`)      
    }
    
    resp = 1
  } catch(e) { console.error(e.message)}

  return resp  
}


const updateDB = async (req, res) => {  
  let resp = 0
  try{             
    await dbConnection.query(`UPDATE tbl_designation SET desig_title='${req.body.desig_title}', desig_desc='${req.body.desig_desc}' WHERE desig_id=${req.body.id}`)
    resp = 1        
  } catch(e) { console.error(e.message)}
  
  return resp
}


const isExistsDB = async (title="") => {
  let resp = 0
  let res = []
  
  try {
    res = await dbConnection.query(`SELECT desig_title FROM tbl_designation WHERE desig_title ='${title}'`)    
    resp = res.rows.length    
  } catch(e) { console.error(e.message)}
  
  return resp  
}



module.exports = { 
  getAllDesignation, 
  getDesignationByID,
  addDesignation, 
  deleteDesignation,
  updateDesignation
}
