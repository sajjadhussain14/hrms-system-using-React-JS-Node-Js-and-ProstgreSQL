const dbConnection = require("../db-config").pool
let rowRecords = {}

const authenticateUserMod = async (req, res) => {
  let response = { status: 409, msg: "Attendance not found." }
  try{            
    response = await dbConnection.query(`
      SELECT DISTINCT emp_id,email1 FROM tbl_users
        where email1='${req.body.login_email}' AND passwd='${req.body.login_pass}'        
    `)    
    rowRecords = response.rows[0]    
  } catch(e) { console.error(e.message)
    rowRecords = {}
  }
  return rowRecords
}




module.exports = { 
  authenticateUserMod
}
