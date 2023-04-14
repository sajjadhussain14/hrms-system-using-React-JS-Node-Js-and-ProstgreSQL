const { dataSource } = require("../data-source")

const roleArray = ["super_admin", "administrator", "manager"]

const {
  getEmployees4CountMod,
  getAllEmployeeMod,
  getAllExEmployeeMod,
  getEmployeeByIDMod,
  getReportToByIDMod,
  getAllReportToMod,
  getEmployeeReportToMod ,
  getEmployeeByTeamLeadID,
  getAllExEmployeeTeamLeadIDMOD,
  getTeamLeadsOnly,
  getEmployeeByIDsMod,
  addEmployeeMod,
  addEmployeeCSVMod,
  deleteEmployeeMod,
  editEmployeeProfileMod,
  acceptEmployeeResignationMod
} = require("../models/employee")

const {
  getAllBankMod, getBankByIDMod
} = require("../models/bank")

const {
  getAllEmployeePayrollMod,
  getEmployeePayrollByIDMod,
  getEmployeePayrollByTeamLeadIDMod,
  addEmployeePayrollMod, 
  updateEmployeePayrollMod
} = require("../models/payroll")

const {
  getAllReqMod,
  getReqByEmpIdMod
} = require("../models/leave-request")

const {
  getAllLeaveMod,
  getLeaveByEmpIdMod
} = require("../models/leave")

const {
  getAllAttendanceMod,
  getAttendanceByEmpIdMod
} = require("../models/attendance")

const {
  getAllInventoryMod,
  getInventoryByEmpIdMod, 
  addInventoryMod, 
  deleteInventoryMod
} = require("../models/inventory")

const {
  getAllEobiMod,
  getEOBIByEmpIDMod
} = require("../models/eobi")

const {
  getAllAnnounceMod,
  getAnnounceByEmpIdMod
} = require("../models/announce")


const getEmployees = async (req, res) => { 
  let employeeData = {}
  let role_slug = ""
  
  try{
    role_slug = req.body.role_slug    
  } catch {}
  
  try{            
    if(role_slug && (role_slug == "super_admin" || role_slug == "administrator" || role_slug == "manager") )  {      
      if(req.body.emp_id) {        
        const {emp_id} = req.body
        req.body.id = emp_id
        profile = await getEmployeeByIDMod(req, res)
        payroll = await getEmployeePayrollByIDMod(req, res) 
        eobi = await getEOBIByEmpIDMod(req, res)         
        inventory = await getInventoryByEmpIdMod(req, res) 
        employeeData = {...profile, ...eobi}
        employeeData.inventory = await getInventoryByEmpIdMod(req, res) 
        employeeData.payroll = await getEmployeePayrollByIDMod(req, res)         
        
      } else {
        if(req.body.ex_employee && req.body.ex_employee === 'Yes') {
          employeeData.profile = await getAllExEmployeeMod(req, res)
        } else {
          employeeData.profile = await getAllEmployeeMod(req, res)
        }        
      }      
      return res.json(employeeData)      

    } else if(role_slug && role_slug == "administrator")  {      
      
          

    } else if(role_slug && role_slug == "manager")  {      
      
      if(req.body.emp_id) {
        const {emp_id} = req.body
        req.body.id = emp_id
        profile = await getEmployeeByIDMod(req, res)
        payroll = await getEmployeePayrollByIDMod(req, res) 
        eobi = await getEOBIByEmpIDMod(req, res)         
        inventory = await getInventoryByEmpIdMod(req, res) 
        employeeData = {...profile, ...eobi}
        employeeData.inventory = await getInventoryByEmpIdMod(req, res) 
        employeeData.payroll = await getEmployeePayrollByIDMod(req, res)         
                
      } else {
        if(req.body.ex_employee && req.body.ex_employee === 'Yes') {
          employeeData.profile = await getAllExEmployeeMod(req, res)
        } else {
          employeeData.profile = await getAllEmployeeMod(req, res)
        }        
      }  
    } else if(role_slug && role_slug == "team_lead")  {            
      if(req.body.emp_id) {        
        const {emp_id} = req.body
        req.body.id = emp_id
        profile = await getEmployeeByIDMod(req, res)
        payroll = await getEmployeePayrollByIDMod(req, res) 
        eobi = await getEOBIByEmpIDMod(req, res)         
        inventory = await getInventoryByEmpIdMod(req, res) 
        employeeData = {...profile, ...eobi}
        employeeData.inventory = await getInventoryByEmpIdMod(req, res) 
        employeeData.payroll = await getEmployeePayrollByIDMod(req, res)                     
      } else {
        if(req.body.ex_employee && req.body.ex_employee === 'Yes') {
          employeeData.profile = await getAllExEmployeeTeamLeadIDMOD(req, res)
        } else {
          employeeData.profile = await getEmployeeByTeamLeadID(req, res)
        }        
      }      
      return res.json(employeeData)

    } else if(role_slug && role_slug == "member")  {        
      const {emp_id} = req.body
      req.body.id = emp_id
      profile = await getEmployeeByIDMod(req, res)
      payroll = await getEmployeePayrollByIDMod(req, res) 
      eobi = await getEOBIByEmpIDMod(req, res)         
      bank = await getBankByIDMod(req, res)
      //inventory = await getInventoryByEmpIdMod(req, res) 
      employeeData = {...profile, ...eobi}
      employeeData.inventory = await getInventoryByEmpIdMod(req, res) 
      employeeData.payroll = await getEmployeePayrollByIDMod(req, res)         
      
      return res.json(employeeData)     

    } else {
      return { status: 309, msg: "Unauthorized access." }
    }
  } catch(e) { console.error(e.message)
    empRecords = { status: 309, msg: e.message }
  }
 
  return res.json(employeeData)  
}


const getEmployeeByID = async (req, res) => { 
  let employeeData = []
  if(!req.body.role_slug || !req.body.id) {
    return
  }

  try {
    employeeData = await getEmployeeByIDMod(req, res)
    return res.json(employeeData)
  } catch(e) {
    return res.json(e.message)
  }
}

const getEmployees4Count = async (req, res) => { 
  let employeeData = []
  if(!req.body || !req.body.role_slug) {
    return
  }

  if(req.body.emp_id)  {      
    req.body.id = req.body.emp_id
    employeeData = await getEmployeeByIDMod(req, res)
    return res.json(employeeData)                    
  } else if(req.body.role_slug == "super_admin" || req.body.role_slug == "administrator")  { 
    employeeData = await getAllEmployeeMod(req, res)          
    return res.json(employeeData)                    
  } else if(req.body.role_slug == "team_lead")  {      
    employeeData = await getEmployeeByTeamLead(req, res)
      return res.json(employeeData)                    
  } else {
    return res.json({ status: 309, msg: "Couldn't get data." })
  }
  
}


const getReportToByID = async (req, res) => { 
  let employeeData = []
  
  try {
    employeeData = await getReportToByIDMod(req, res)
    return res.json(employeeData)
  } catch(e) {
    return res.json(e.message)
  }
}


const getAllReportTo = async (req, res) => { 
  let employeeData = []
  
  if(!req.body || !req.body.role_slug || !req.body.emp_id) {
    return
  }

  try {
    employeeData = await getAllReportToMod(req, res)
    return res.json(employeeData)
  } catch(e) {
    return res.json(e.message)
  }
}


const getEmployeeReportTo = async (req, res) => { 
  let employeeData = []
  
  if(!req.body || !req.body.role_slug || !req.body.ids) {
    return
  }
  
  try {
    employeeData = await getEmployeeReportToMod(req, res)
    return res.json(employeeData)
  } catch(e) {
    return res.json(e.message)
  }
}



const getEmployeeByIDs = async (req, res) => { 
  let employeeData = []
  
  if(!req.body || !req.body.role_slug || !req.body.ids) {
    return
  }
  
  try {
    employeeData = await getEmployeeByIDsMod(req, res)
    return res.json(employeeData)
  } catch(e) {
    return res.json(e.message)
  }
}

const getEmployeeByTeamLead = async (req, res) => { 
  let employeeData = []

  if (dataSource == "pgSQL") {
    employeeData = await getEmployeeByTeamLeadID(req, res)
    res.json(employeeData)  
  }
}


const getTeamLeads = async (req, res) => { 
  let employeeData = []

  if (dataSource == "pgSQL") {
    employeeData = await getTeamLeadsOnly(req, res)
    res.json(employeeData)  
  }
}


const addEmployee = async (req, res) => {
  if (!req.body) {
    req.body = {}
  }
  
  let emp_number = first_name = last_name = father_name = emp_email =  emp_cnic = ""
  try {   
    const {emp_number, first_name, last_name, father_name, emp_email, emp_cnic} = req.body[0]
  } catch (e) {}
  
  if(!req.body.role_slug || req.body.role_slug != "super_admin") {
    return res.json({ status: 309, msg: "User not allowed to Add records!!!" })
  } else {  
    
    let isValidData = false;
    try {        
        const {emp_number, first_name, last_name, father_name, emp_email, emp_cnic} = req.body
        if(emp_number && first_name && last_name && father_name && emp_email && emp_cnic) {
          isValidData = true;
        } else {
          isValidData = false;          
        }
    } catch (e) {console.error(e.message)}
    
    if(isValidData) {
      if (dataSource == "pgSQL") {
        let response = await addEmployeeMod(req, res)
        res.json(response)
      }    
    }
  } 
}


const addEmployeeCSV = async (req, res) => {
  if (!req.body) {
    req.body = {}
  }  
  
  if(!req.body.user_role.role_slug || req.body.user_role.role_slug != "super_admin") {    
    return res.json({ status: 309, msg: "User not allowed to Add records!!!" })
  } else {      
      let isValidData = false;
      try {        
        for(let i=0; i<req.body.records.length; i++) {
          const {emp_number, first_name, last_name, emp_email, emp_cnic} = req.body.records[i]
          if(emp_number && first_name && last_name && emp_email && emp_cnic) {
            isValidData = true;
          } else {
            isValidData = true;
            //break;
          }         
        }        
      } catch (e) {console.error(e.message)}
         
      if(isValidData) {
        if (dataSource == "pgSQL") {
          let response = await addEmployeeCSVMod(req, res)
          res.json(response)
        }    
      } else {
        return res.json({ status: 309, msg: "Employee requied fields should not be empty!" })
      }
  }
  
}



const deleteEmployee = async (req, res) => {
  if (!req.body) {
    req.body = {}
  }
    
  if (!req.body.role_slug || req.body.role_slug != "super_admin") {    
    return res.json({ status: 309, msg: "User not allowed to Delete Record!!" })
  } else {  
    if (!req.body.id) {    
      return res.json({ status: 309, msg: "Please Select an Employee to Delete !" })
    } else {
      if (dataSource == "pgSQL") {
        let resp = await deleteEmployeeMod(req, res)
        if(resp.status == 200) {
          return res.json({ status: 200, msg: "Employee Deleted Successfully !" })
        } else {
          return res.json({ status: 309, msg: "Employee could not Delete !!!" })
        }
      }     
    }
  }  
}


const editEmployeeProfile = async (req, res) => {    
  if (!req.body) {
    return
  }
      
  if (!req.body.id || !req.body.user_role || !roleArray.includes(req.body.user_role)) {    
    return res.json({ status: 309, msg: "Couldn't update profile." })
  } else {
    let resp = await editEmployeeProfileMod(req, res)
    
    if(resp == 1) {      
      return res.json({ status: 200, msg: "Employee Updated Successfully." })
    } else {      
      return res.json({ status: 309, msg: "Couldn't update profile." })
    }    
  }  
}


const acceptEmployeeResignation = async (req, res) => {  
  let retData = {}
  if(!req.body || !req.body.emp_id || !req.body.role_slug) {
    return;
  }
  
  try {
    if(req.body.role_slug == "super_admin" || req.body.role_slug == "administrator") {
      retData = await acceptEmployeeResignationMod(req, res)    
      return res.json(retData)  
    } else {
      return res.json({})
    }
    
  } catch(e){console.log(e.message)} 
}


module.exports = { 
  getEmployees4Count,
  getEmployees, 
  getEmployeeByID,
  getReportToByID,
  getAllReportTo,
  getEmployeeReportTo,
  getEmployeeByTeamLead,
  getTeamLeads,
  getEmployeeByIDs,
  addEmployee, 
  addEmployeeCSV,
  deleteEmployee,
  editEmployeeProfile,
  acceptEmployeeResignation
}
