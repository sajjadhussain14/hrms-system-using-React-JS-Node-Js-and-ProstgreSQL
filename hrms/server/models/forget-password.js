const { request } = require("express")
const dbConnection = require("../db-config").pool
let rowRecords = []


const {
    getHashSalt, 
    comparePasswordAndSalt
} = require("../models/hashing")

const findEmailMod = async (req, res) => {
  let response = { status: 409, msg: "Email not found." }
  
  try{
    response = await dbConnection.query(`
      SELECT 
        emp.first_name,
        usr.emp_id, usr.email1
      FROM tbl_employee emp
      INNER JOIN tbl_users usr ON emp.emp_id=usr.emp_id      
      WHERE lower(email1)='${req.body.email.toLowerCase()}'        
    `)    
    
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = e.message
  }
  return rowRecords
}


const createSaltMod = async (req, res) => {
  let response = { status: 409, msg: "Couldn't create salt." }  
  if(!req.body || !req.body.emp_id || !req.body.email){
    return;
  }

  try{        
    // get pass
    response = await dbConnection.query(`
        SELECT passwd FROM tbl_users WHERE emp_id=${req.body.emp_id}
    `)    
    
    // create user salt
    const user_hash = getHashSalt(response.rows[0].passwd) 
    
    // create url salt
    const url_hash = getHashSalt(req.body.emp_id + req.body.email) 
    
    // update user salt and reset link
    response = await dbConnection.query(`
        UPDATE tbl_users 
        SET passwd_salt='${user_hash.salt}', reset_link='${url_hash.hash}' WHERE emp_id=${req.body.emp_id}
    `)    
    response = { url: url_hash.hash}  
  } catch(e) { console.error(e.message) 
    response = {}
  }

  return response
}



const validateSaltMod = async (req, res) => {
    let response = { status: 409, msg: "Email not found." }
  
    try{
        response = await dbConnection.query(`
            SELECT emp_id, email1, reset_link FROM tbl_users       
            WHERE reset_link='${req.body.url}'        
        `)   
        rowRecords = response.rows
        console.log(rowRecords)
    } catch(e) { console.error(e.message)
        rowRecords = {}
    }
  
  return rowRecords  
} 


const updatePasswordMod = async (req, res) => {  
  let response = { status: 409, msg: "Error in submitting." }
 
  try{       
    let resp = await dbConnection.query(`
        SELECT emp_id, email1, reset_link FROM tbl_users       
        WHERE reset_link='${req.body.url}' AND email1='${req.body.email}'        
    `) 
    
    if(resp.rows.length > 0) {
      await dbConnection.query(`UPDATE tbl_users SET passwd='${req.body.password}', reset_link='' WHERE email1='${req.body.email}' AND reset_link='${req.body.url}'`)
      response = { status: 200, msg: "Password updated successfully." }            
    } else if(req.body.url == "reset_password_no_url"){
      await dbConnection.query(`UPDATE tbl_users SET passwd='${req.body.password}', reset_link='' WHERE email1='${req.body.email}'`)
      response = { status: 200, msg: "Password updated successfully." }            
    } else {
      response = { status: 409, msg: "Invalid User or URL." }
    }
  } catch(e) { console.error(e.message)}
  
  return response
}




module.exports = { 
    findEmailMod,
    createSaltMod,
    validateSaltMod,
    updatePasswordMod
}
