const dbConnection = require("../db-config").pool
let rowRecords = {}

const getAllBankMod = async () => {
  
  try{
    response = await dbConnection.query(`SELECT bank_id, bank_name, bank_branch, bank_address, is_active FROM tbl_bank`)
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  
  return rowRecords
}

const getBankByIDMod = async (req, res) => {
  let response = { status: 409, msg: "Bank not found." }
  try {
    console.log(req.body)
    response = await dbConnection.query(`SELECT bank_id, bank_name, bank_branch, bank_address, is_active FROM tbl_bank where bank_id=${req.body.bank_id}`)
    rowRecords = response.rows[0]
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  
  return rowRecords
}


const addBankMod = async (req, res) => {
  let response = { status: 409, msg: "Bank Adding Failed." }
  let resp = await isExistsDB(req.body.bank_name)

  if (resp > 0) { 
    return (response = {
      status: 309,
      msg: `Bank <strong> ${req.body.bank_name} </strong> Already Exixts`,
    })
  } else {    
    let resp = await insertDB(req, res)
    console.log(resp)
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Bank <strong> ${req.body.bank_name}  </strong> Created Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Bank <strong> ${req.body.bank_name}  </strong> Creation Failed!!!`,
      })
    }
  }
}


const updateBankMod = async (req, res) => {    
    let resp = await updateDB(req, res)    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Bank <strong> ${req.body.bank_name} </strong> Updated Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Bank <strong> ${req.body.bank_name}  </strong> Updation Failed !!!`,
      })
    }
    
  
}


const deleteBankMod = async (req, res) => {        
    let resp = await deleteDB(req, res)
    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Bank <strong>  </strong> Deleted Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Bank Deletion Failed!!!`,
      })
    }
}


const insertDB = async (req, res) => {  
  let resp = 0
  try{             
    await dbConnection.query(`
        INSERT INTO tbl_bank(bank_name, bank_branch, bank_address, is_active)
        VALUES ('${req.body.bank_name}', '${req.body.bank_branch}', '${req.body.bank_address}', '${1}')
    `)  
    resp = 1        
  } catch(e) { console.error(e.message)}
  
  return resp
}


const deleteDB = async (req, res) => {  
  let resp = 0  
  try {
    if(req.body.id == -123) {
      await dbConnection.query(`DELETE FROM tbl_bank`)          
    } else {
      await dbConnection.query(`DELETE FROM tbl_bank WHERE bank_id =${req.params.id}`)      
    }
    
    resp = 1
  } catch(e) { console.error(e.message)}

  return resp  
}


const updateDB = async (req, res) => {  
  let resp = 0
  try{        
    await dbConnection.query(`UPDATE tbl_bank SET bank_name='${req.body.bank_name}', bank_branch='${req.body.bank_branch}', bank_address='${req.body.bank_address	}' WHERE bank_id=${req.body.id}`)
    resp = 1        
  } catch(e) { console.error(e.message)}
  
  return resp
}


const isExistsDB = async (title="") => {
  let resp = 0
  let res = []
  
  try {
    res = await dbConnection.query(`SELECT bank_name FROM tbl_bank WHERE lower(bank_name) ='${title.toLowerCase()}'`)    
    resp = res.rows.length    
  } catch(e) { console.error(e.message)}
  
  return resp  
}



module.exports = { 
  getAllBankMod, 
  getBankByIDMod,
  addBankMod, 
  deleteBankMod,
  updateBankMod
}
