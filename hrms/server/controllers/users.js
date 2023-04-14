const { dataSource } = require("../data-source")

const {
  authenticateUserMod
} = require("../models/users")

const {
  getEmployeeByIDMod
} = require("../models/employee")


const authenticateUser = async (req, res) => { 
  let userData = {}
  if(!req.body.login_email || !req.body.login_pass) {
    userData = { status: 309, msg: "Access Denied." }
  }
  try {
    userData = await authenticateUserMod(req, res) 
               
    if(userData && userData.emp_id && userData.emp_id > 0) {
      req.body.emp_id = userData.emp_id
      userData = await getEmployeeByIDMod(req, res)      
    }

    if(!userData) {
      userData = { status: 309, msg: "No record found." }
    }
    return res.json(userData)  
  } catch{}
}



module.exports = { 
  authenticateUser
}
