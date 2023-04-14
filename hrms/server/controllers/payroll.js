const { dataSource } = require("../data-source")

const {
  getAllEmployeePayrollMod,
  getEmployeePayrollByIDMod,
  getPayrollByIDMod,
  getEmployeePayrollByTeamLeadIDMod,
  addEmployeePayrollMod, 
  generateSalarySlip4AllMod,
  releaseSalarySlip4AllMod,
  isSalaryGeneratedReleasedMod,
  editEmployeePayrollMod
} = require("../models/payroll")

const {
  getEmployeeByIDMod
} = require("../models/employee")


const getPayrolls = async (req, res) => { 
  let employeeData = {}
  let role_slug = ""
  let emp_id = ""
  let payroll_id = ""
  
  try{
    if(req.body.role_slug) role_slug = req.body.role_slug    
    if(req.body.emp_id) emp_id = req.body.emp_id    
    if(req.body.payroll_id) payroll_id = req.body.payroll_id
  } catch {}
  
  if(!emp_id || !role_slug){
    employeeData = { status: 309, msg: "ID and Role are required!" }
  }
  
  try{    
    if(role_slug && role_slug == "super_admin")  {      
      if(payroll_id) {
        employeeData = await getEmployeeByIDMod(req, res) 
        employeeData.payroll = await getEmployeePayrollByIDMod(req, res)      
        return res.json(employeeData)   

      } else {
        employeeData = await getEmployeeByIDMod(req, res) 
        employeeData.payroll = await getEmployeePayrollByIDMod(req, res)      
        return res.json(employeeData)   

      }

    } else if(role_slug && role_slug == "administrator")  {      
      
      if(payroll_id) {
        employeeData = await getEmployeeByIDMod(req, res) 
        employeeData.payroll = await getEmployeePayrollByIDMod(req, res)      
        return res.json(employeeData)   

      } else {
        employeeData = await getEmployeeByIDMod(req, res) 
        employeeData.payroll = await getEmployeePayrollByIDMod(req, res)      
        return res.json(employeeData)   

      }
      
      return res.json(employeeData)

    } else if(role_slug && role_slug == "manager")  {      
      if(payroll_id) {
        employeeData = await getEmployeeByIDMod(req, res) 
        employeeData.payroll = await getEmployeePayrollByIDMod(req, res)      
        return res.json(employeeData)   

      } else {
        employeeData = await getEmployeeByIDMod(req, res) 
        employeeData.payroll = await getEmployeePayrollByIDMod(req, res)      
        return res.json(employeeData)   

      }
      
      return res.json(employeeData)
    
    } else if(role_slug && role_slug == "team_lead")  {      
      //employeeData.employee_leaves = await getEmployeePayrollByTeamLeadID(req, res)       
      employeeData.payroll = await getEmployeePayrollByIDMod(req, res)
      return res.json(employeeData)

    } else if(role_slug && role_slug == "member")  {      
      employeeData.payroll = await getEmployeePayrollByIDMod(req, res)
      return res.json(employeeData)
    } else {
      return { status: 309, msg: "Access is Denied!!!" }
    }
  } catch(e) { console.error(e.message)
    employeeData = { status: 309, msg: e.message }
    return res.json(employeeData)
  }
 
  return res.json(employeeData)  
}



const getEmployeePayrollByID = async (req, res) => { 
  let employeeData = []

  if (dataSource == "pgSQL") {
    employeeData = await getEmployeePayrollByIDMod(req, res)
    res.json(employeeData)  
  }
}


const getPayrollByID = async (req, res) => { 
  let response = {}
  if(!req.body) {
    return;
  }

  if (!req.body.role_slug || !req.body.role_slug || !req.body.payroll_id) {    
    return res.json({ status: 309, msg: "Couldn't perform Database operation." })
  } else {
    let response = await getPayrollByIDMod(req, res)
    return res.json(response)    
  }
}



const getEmployeePayrollByTeamLeadID = async (req, res) => { 
  let employeeData = []

  if (dataSource == "pgSQL") {
    employeeData = await getEmployeePayrollByTeamLeadIDMod(req, res)
    res.json(employeeData)  
  }
}


const addEmployeePayroll = async (req, res) => {
  if (!req.body) {
    req.body = {}
  }

  let emp_id = 0
  try {
    emp_id = (!req.body.emp_id ? 0 : req.body.emp_id)    
  } catch (e) {}
  
  if (!emp_id) {
    return res.json({ status: 309, msg: "Holiday requied fields should not be empty!" })
  } else {
    if (dataSource == "pgSQL") {
      let response = await addEmployeePayrollMod(req, res)
      res.json(response)
    } 
  }
}


const generateSalarySlip4All = async (req, res) => {
  if (!req.body) {
    return;
  }

    
  if (!req.body.id || !req.body.role_slug ||  req.body.role_slug != "super_admin") {
    return res.json({ status: 309, msg: "Couldn't perform Database operation." })
  } else {
    if (dataSource == "pgSQL") {
      let response = await generateSalarySlip4AllMod(req, res)
      return res.json(response)
    } 
  }
}



const releaseSalarySlip4All = async (req, res) => {
  if (!req.body) {
    return;
  }
  
  if (!req.body.id || !req.body.role_slug ||  req.body.role_slug != "super_admin") {
    return res.json({ status: 309, msg: "Couldn't perform Database operation." })
  } else {
    if (dataSource == "pgSQL") {
      let response = await releaseSalarySlip4AllMod(req, res)
      return res.json(response)
    } 
  }
}


const isSalaryGeneratedReleased = async (req, res) => {
  if (!req.body) {
    return;
  }
  
  if (!req.body.id || !req.body.month || !req.body.year || !req.body.role_slug ||  req.body.role_slug != "super_admin") {
    return res.json({ status: 309, msg: "Couldn't perform Database operation." })
  } else {
    let response = await isSalaryGeneratedReleasedMod(req, res)
    return res.json(response)    
  }
}

const editEmployeePayroll = async (req, res) => {
  if (!req.body) {
    return;
  }

  if (!req.body.payroll_id || !req.body.role_slug ||  req.body.role_slug != "super_admin") {
    return res.json({ status: 309, msg: "Couldn't perform Database operation." })
  } else {
    let response = await editEmployeePayrollMod(req, res)
    return res.json(response)    
  }
}





module.exports = { 
  getPayrolls,
  getEmployeePayrollByID, 
  getPayrollByID,
  getEmployeePayrollByTeamLeadID,
  addEmployeePayroll,
  generateSalarySlip4All,
  releaseSalarySlip4All,
  isSalaryGeneratedReleased,
  editEmployeePayroll
}
