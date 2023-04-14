const dbConnection = require("../db-config").pool
let rowRecords = {}

const getAllRole = async () => {
  let response = { status: 409, msg: "Role not found." }
  try{
    response = await dbConnection.query(`SELECT DISTINCT role_id, role_title, role_slug, role_desc, is_active FROM tbl_role ORDER BY role_ID`)
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}

const getRoleByID = async (req, res) => {
  let response = { status: 409, msg: "Role not found." }
  try {
    response = await dbConnection.query(`SELECT DISTINCT role_id, role_title, role_slug, role_desc, is_active FROM tbl_role where role_id=${req.params.id}`)
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}


const addRoleMod = async (req, res) => {
  let response = { status: 409, msg: "Role Adding Failed." }
  let resp = await isExistsDB(req.body.role_title)

  if (resp > 0) { 
    return (response = {
      status: 309,
      msg: `Role <strong> ${req.body.role_title} </strong> Already Exixts`,
    })
  } else {    
    let resp = await insertDB(req, res)
    console.log(resp)
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Role <strong> ${req.body.role_title}  </strong> Created Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Role <strong> ${req.body.role_title}  </strong> Creation Failed!!!`,
      })
    }
  }
}


const updateRoleMod = async (req, res) => {    
    let resp = await updateDB(req, res)    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Role <strong> ${req.body.role_title} </strong> Updated Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Role <strong> ${req.body.role_title}  </strong> Updation Failed !!!`,
      })
    }
    
  
}


const deleteRoleMod = async (req, res) => {        
    let row = await getRoleByID(req, res) 
    let resp = await deleteDB(req, res)
    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Role <strong>  </strong> Deleted Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Role Deletion Failed!!!`,
      })
    }
}


const insertDB = async (req, res) => {  
  let resp = 0
  const slug = req.body.role_title.toLowerCase().replace(/ /g,"_")
  try{             
    await dbConnection.query(`
        INSERT INTO tbl_role (role_title, role_slug, role_desc, is_active)         
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
      await dbConnection.query(`DELETE FROM tbl_role`)          
    } else {
      await dbConnection.query(`DELETE FROM tbl_role WHERE role_id =${req.params.id}`)      
    }
    
    resp = 1
  } catch(e) { console.error(e.message)}

  return resp  
}


const updateDB = async (req, res) => {  
  let resp = 0
  try{        
    const slug = req.body.role_title.toLowerCase().replace(/ /g,"_")     
    await dbConnection.query(`UPDATE tbl_role SET role_title='${req.body.role_title}', role_desc='${req.body.role_desc}', role_slug='${slug}' WHERE role_id=${req.body.id}`)
    resp = 1        
  } catch(e) { console.error(e.message)}
  
  return resp
}


const isExistsDB = async (title="") => {
  let resp = 0
  let res = []
  
  try {
    res = await dbConnection.query(`SELECT role_title FROM tbl_role WHERE role_title ='${title}'`)    
    resp = res.rows.length    
  } catch(e) { console.error(e.message)}
  
  return resp  
}



module.exports = { 
  getAllRole, 
  getRoleByID,
  addRoleMod, 
  deleteRoleMod,
  updateRoleMod
}
