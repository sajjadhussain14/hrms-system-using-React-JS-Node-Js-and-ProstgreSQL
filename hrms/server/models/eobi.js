const dbConnection = require("../db-config").pool
let rowRecords = {}

const getAllEobiMod = async () => {
  let response = { status: 409, msg: "EOBI not found." }
  try{
    response = await dbConnection.query(`SELECT eobi_id, emp_id, eobi_number, eobi_status, eobi_year, eobi_amount FROM tbl_emp_eobi`)
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}

const getEOBIByEmpIDMod = async (req, res) => {
  let response = { status: 409, msg: "EOBI not found." }
  try {
    response = await dbConnection.query(`SELECT eobi_id, emp_id, eobi_number, eobi_status, eobi_year, eobi_amount FROM tbl_emp_eobi where emp_id=${req.body.id}`)
    rowRecords = response.rows[0]
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}


const addRoleMod = async (req, res) => {
  let response = { status: 409, msg: "EOBI Adding Failed." }
  let resp = await isExistsDB(req.body.role_title)

  if (resp > 0) { 
    return (response = {
      status: 309,
      msg: `EOBI <strong> ${req.body.role_title} </strong> Already Exixts`,
    })
  } else {    
    let resp = await insertDB(req, res)
    console.log(resp)
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `EOBI <strong> ${req.body.role_title}  </strong> Created Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `EOBI <strong> ${req.body.role_title}  </strong> Creation Failed!!!`,
      })
    }
  }
}


const updateRoleMod = async (req, res) => {    
    let resp = await updateDB(req, res)    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `EOBI <strong> ${req.body.role_title} </strong> Updated Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `EOBI <strong> ${req.body.role_title}  </strong> Updation Failed !!!`,
      })
    }
    
  
}


const deleteRoleMod = async (req, res) => {        
    let row = await getEOBIByEmpIDMod(req, res) 
    let resp = await deleteDB(req, res)
    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `EOBI <strong>  </strong> Deleted Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `EOBI Deletion Failed!!!`,
      })
    }
}


const insertDB = async (req, res) => {  
  let resp = 0
  const slug = req.body.role_title.toLowerCase().replace(/ /g,"_")
  try{             
    await dbConnection.query(`
        INSERT INTO tbl_emp_eobi (role_title, role_slug, role_desc, is_active)         
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
      await dbConnection.query(`DELETE FROM tbl_emp_eobi`)          
    } else {
      await dbConnection.query(`DELETE FROM tbl_emp_eobi WHERE role_id =${req.params.id}`)      
    }
    
    resp = 1
  } catch(e) { console.error(e.message)}

  return resp  
}


const updateDB = async (req, res) => {  
  let resp = 0
  try{        
    const slug = req.body.role_title.toLowerCase().replace(/ /g,"_")     
    await dbConnection.query(`UPDATE tbl_emp_eobi SET role_title='${req.body.role_title}', role_desc='${req.body.role_desc}', role_slug='${slug}' WHERE role_id=${req.body.id}`)
    resp = 1        
  } catch(e) { console.error(e.message)}
  
  return resp
}


const isExistsDB = async (title="") => {
  let resp = 0
  let res = []
  
  try {
    res = await dbConnection.query(`SELECT role_title FROM tbl_emp_eobi WHERE role_title ='${title}'`)    
    resp = res.rows.length    
  } catch(e) { console.error(e.message)}
  
  return resp  
}



module.exports = { 
  getAllEobiMod, 
  getEOBIByEmpIDMod,
  addRoleMod, 
  deleteRoleMod,
  updateRoleMod
}
