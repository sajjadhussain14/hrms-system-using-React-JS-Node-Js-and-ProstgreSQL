const { getSettingMOD } = require("./settings")

const dbConnection = require("../db-config").pool
let rowRecords = []


const getAllEmployeePayrollMod = async (req, res) => {
  let response = { status: 409, msg: "Payroll not found." }
  
  let qry = ""
  if(req.body.role_slug != "super_admin"){
    qry = " WHERE is_released=1"
  }

  try {    
    response = await dbConnection.query(`
        SELECT DISTINCT emp.*, 
        pay.payroll_id, pay.bank_id, pay.bank_id, pay.pay_currency, pay.pay_gross, pay.pay_basic, pay.pay_increment, pay.pay_increment_notes, pay.pay_bonus, pay.pay_bonus_notes, pay.house_allowance, pay.conveyance_allowance, pay.utility_allowance, pay.medical_allowance, pay.overtime, pay.overtime_notes, pay.other_allowance, pay.tax_able, pay.tax_deducted, pay.eobi_contribution, pay.net_pay_transferred, pay.pay_day, pay.pay_month, pay.pay_year, pay.prepared_by,
        bnk.bank_name, bnk.bank_branch, bnk.bank_address,
        dep.dept_title, des.desig_title, 
        des.desig_title, des.desig_desc
        FROM tbl_employee emp
        FULL OUTER JOIN tbl_employee_payroll pay ON emp.emp_id=pay.emp_id
        INNER JOIN tbl_bank bnk ON pay.bank_id=bnk.bank_id
        INNER JOIN tbl_department dep ON emp.dept_id=dep.dept_id
        INNER JOIN tbl_designation des ON emp.desig_id=des.desig_id
        LEFT JOIN tbl_emp_teamlead led ON emp.emp_id=led.emp_id               
        ${qry}
      ORDER BY pay_year DESC, pay_month DESC
    `)    
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}


const getEmployeePayrollByIDMod = async (req, res) => {
  let response = { status: 409, msg: "Payroll not found." }
  
  let qry = ""
  if(req.body.role_slug != "super_admin"){
    qry = "and is_released=1"
  }

  try {      
    let query = ""
    if(req.body.search_year) {
      query = " AND pay.pay_year=" + req.body.search_year
    } else if(req.body.search_month) {
      query = " AND pay.pay_month=" + req.body.search_month
    } else if(req.body.search_from_date && req.body.search_to_date) {
      query = " AND CONCAT(pay.pay_year, '-', pay.pay_month, '-', pay.pay_day)>='" + req.body.search_from_date + "'"
      query += " AND CONCAT(pay.pay_year, '-', pay.pay_month, '-', pay.pay_day)<='" + req.body.search_to_date + "'"
    }        

    if(req.body.role_slug != "super_admin"){
      query += " AND is_released=1"
    }

    response = await dbConnection.query(`
        SELECT DISTINCT pay.payroll_id, pay.bank_id, pay.bank_id, pay.pay_currency, pay.pay_gross, pay.pay_basic, pay.pay_increment, pay.pay_increment_notes, pay.pay_bonus, pay.pay_bonus_notes, pay.house_allowance, pay.conveyance_allowance, pay.utility_allowance, pay.medical_allowance, pay.overtime, pay.overtime_notes, pay.other_allowance, pay.tax_able, pay.tax_deducted, pay.eobi_contribution, pay.net_pay_transferred, pay.pay_day, pay.pay_month, pay.pay_year, pay.prepared_by,
          bnk.bank_name, bnk.bank_branch, bnk.bank_address
          FROM tbl_employee_payroll pay
          INNER JOIN tbl_bank bnk ON pay.bank_id=bnk.bank_id          
          where pay.emp_id=${req.body.emp_id}
          ${query}
        ORDER BY pay_year DESC, pay_month DESC
    `)    
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}


const getPayrollByIDMod = async (req, res) => {
  let response = { status: 409, msg: "Payroll not found." }
  
  try {      
    response = await dbConnection.query(`
        SELECT DISTINCT 
          payroll_id, bank_id, pay_currency, pay_gross, pay_basic, pay_increment, pay_increment_notes, pay_bonus, house_allowance, conveyance_allowance, utility_allowance, medical_allowance, overtime, other_allowance, tax_able, tax_deducted, eobi_contribution, net_pay_transferred, pay_day, pay_month, pay_year, prepared_by, is_released
        FROM tbl_employee_payroll 
        WHERE payroll_id=${req.body.payroll_id}          
    `)    
    rowRecords = response.rows[0]
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}


const getEmployeePayrollByTeamLeadIDMod = async (req, res) => {
  let response = { status: 409, msg: "Payroll not found." }

  let qry = ""
  if(req.body.role_slug != "super_admin"){
    qry = " AND is_released=1"
  }

  try {
    response = await dbConnection.query(`
        SELECT DISTINCT emp.*, 
          pay.payroll_id, pay.bank_id, pay.bank_id, pay.pay_currency, pay.pay_gross, pay.pay_basic, pay.pay_increment, pay.pay_increment_notes, pay.pay_bonus, pay.pay_bonus_notes, pay.house_allowance, pay.conveyance_allowance, pay.utility_allowance, pay.medical_allowance, pay.overtime, pay.overtime_notes, pay.other_allowance, pay.tax_able, pay.tax_deducted, pay.eobi_contribution, pay.net_pay_transferred, pay.pay_day, pay.pay_month, pay.pay_year, pay.prepared_by,
          bnk.bank_name, bnk.bank_branch, bnk.bank_address,
          dep.dept_title, des.desig_title, 
          des.desig_title, des.desig_desc
          FROM tbl_employee emp
          FULL OUTER JOIN tbl_employee_payroll pay ON emp.emp_id=pay.emp_id
          INNER JOIN tbl_bank bnk ON pay.bank_id=bnk.bank_id
          INNER JOIN tbl_department dep ON emp.dept_id=dep.dept_id
          INNER JOIN tbl_designation des ON emp.desig_id=des.desig_id
          LEFT JOIN tbl_emp_teamlead led ON emp.emp_id=led.emp_id
        where led.teamlead_id=${req.body.id} ${qry}
        ORDER BY pay_year DESC, pay_month DESC
    `)
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}


const addEmployeePayrollMod = async (req, res) => {  
  let response = { status: 409, msg: "Payroll Adding Failed." } 
  const resp = await isExistsDB(req.body.emp_id)
  
  if (resp > 0) {
    return (response = {
      status: 309,
      msg: `Payroll for <strong> Employee </strong> Already Exists`,
    })
  } else {    
    let resp = await insertDB(req, res)    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Payroll for <strong> Employee  </strong> Created Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Payroll Creation Failed!!!`,
      })
    }
  }
}
 


const generateSalarySlip4AllMod = async (req, res) => {  
  let resp = 0  
  let response = { status: 409, msg: "Couldn't generate salary slip." }
  try{        
    
    let response_emp = await dbConnection.query(`SELECT * FROM tbl_employee WHERE emp_id>0`);  
    if(response_emp.rows.length > 0) {
      for(let i=0; i<response_emp.rows.length; i++){
        let response_payroll = await dbConnection.query(`
          SELECT * FROM tbl_employee_payroll WHERE emp_id=${response_emp.rows[i].emp_id}
            ORDER BY payroll_id desc
        `);
        if(response_payroll.rows.length > 0) {
          let emp_id = response_emp.rows[i].emp_id;
          await dbConnection.query(`
            INSERT INTO 
              tbl_employee_payroll(emp_id, bank_id, pay_currency, pay_gross, pay_basic, pay_increment, pay_bonus, 
              house_allowance, conveyance_allowance, utility_allowance, medical_allowance, overtime, other_allowance, tax_able, 
              tax_deducted, eobi_contribution, net_pay_transferred, pay_month, pay_year, prepared_by,is_released)
            VALUES (${emp_id}, ${response_payroll.rows[0].bank_id}, 'PKR', ${response_payroll.rows[0].pay_gross}, ${response_payroll.rows[0].pay_basic}, ${response_payroll.rows[0].pay_increment}, 
              ${response_payroll.rows[0].pay_bonus}, ${response_payroll.rows[0].house_allowance}, ${response_payroll.rows[0].conveyance_allowance}, ${response_payroll.rows[0].utility_allowance}, 
              ${response_payroll.rows[0].medical_allowance}, ${response_payroll.rows[0].overtime}, ${response_payroll.rows[0].other_allowance}, ${response_payroll.rows[0].tax_able}, 
              ${response_payroll.rows[0].tax_deducted}, ${response_payroll.rows[0].eobi_contribution}, ${response_payroll.rows[0].net_pay_transferred}, 
              ${req.body.month}, ${req.body.year}, '${req.body.prepared_by}', 0)
          `)          
          response = { status: 200, msg: "Salary generated successfully." }
        } else {
          let emp_id = response_emp.rows[i].emp_id;
          let setting = await getSettingMOD(req, res);          
          
          await dbConnection.query(`
            INSERT INTO 
              tbl_employee_payroll(emp_id, bank_id, pay_currency, pay_gross, pay_basic, pay_increment, pay_bonus, 
              house_allowance, conveyance_allowance, utility_allowance, medical_allowance, overtime, other_allowance, tax_able, 
              tax_deducted, eobi_contribution, net_pay_transferred, pay_month, pay_year, prepared_by,is_released)
            VALUES (${emp_id}, ${setting.bank_id}, 'PKR', 0, 0, 0, 
              0, 0, 0, 0, 
              0, 0, 0, 0, 
              0, 0, 0, 
              ${req.body.month}, ${req.body.year}, '${req.body.prepared_by}', 0)
          `)          
          response = { status: 200, msg: "Salary generated successfully." }
        }
      }
    }   
    
  } catch(e) { console.error(e.message)}
  
  return response
}


const releaseSalarySlip4AllMod = async (req, res) => {      
  let response = { status: 409, msg: "Couldn't release salary slip." }
  try{                 
    await dbConnection.query(`
      UPDATE tbl_employee_payroll
      SET is_released=1 WHERE pay_month=${req.body.month} AND pay_year=${req.body.year} AND is_released=0
    `)  
    response = { status: 200, msg: "Salary released successfully." }
  } catch(e) { console.error(e.message)}
  
  return response
}


const isSalaryGeneratedReleasedMod = async (req, res) => {   
  let is_released=0, is_generated=0;
  let resp = {is_released: is_released, is_generated: is_generated}

  try{                 
    response1 = await dbConnection.query(`
      SELECT * FROM tbl_employee_payroll
      WHERE pay_month=${req.body.month} AND pay_year=${req.body.year} AND is_released=0
    `)  
    if(response1.rows.length > 0) {
      is_generated=1
      is_released=0
    }

    response2 = await dbConnection.query(`
      SELECT * FROM tbl_employee_payroll
      WHERE pay_month=${req.body.month} AND pay_year=${req.body.year} AND is_released=1
    `)  
    if(response2.rows.length > 0) {
      is_generated=1
      is_released=1
    }
    resp = {is_released: is_released, is_generated: is_generated}
  } catch(e) { console.error(e.message)}
  
  return resp
}


const editEmployeePayrollMod = async (req, res) => {    
    let resp = await updateDB(req, res)    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Payroll updated successfully.`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Couldn't perform updation.`,
      })
    }
    
  
}


const insertDB = async (req, res) => {  
  let resp = 0  
  try{             
    await dbConnection.query(`
    INSERT INTO 
      tbl_employee_payroll(emp_id, bank_id, pay_currency, pay_gross, pay_basic, pay_increment, pay_increment_notes, pay_bonus, pay_bonus_notes, 
      house_allowance, conveyance_allowance, utility_allowance, medical_allowance, overtime, overtime_notes, other_allowance, tax_able, 
      tax_deducted, eobi_contribution, net_pay_transferred, pay_day, pay_month, pay_year, prepared_by)
    VALUES (${req.body.emp_id}, ${req.body.bank_id}, 'PKR', ${req.body.pay_gross}, ${req.body.pay_basic}, ${req.body.pay_increment}, 'None', 
      ${req.body.pay_bonus}, 'None', ${req.body.house_allowance}, ${req.body.conveyance_allowance}, ${req.body.utility_allowance}, ${req.body.medical_allowance}, 
      ${req.body.overtime}, 'None', ${req.body.other_allowance}, ${req.body.tax_able}, ${req.body.tax_deducted}, ${req.body.eobi_contribution}, ${req.body.net_pay_transferred}, 
      '${req.body.pay_day}', '${req.body.pay_month}', '${req.body.pay_year}', '${req.body.prepared_by}')
    `)  
    resp = 1        
  } catch(e) { console.error(e.message)}
  
  return resp
}


const updateDB = async (req, res) => {  
  let resp = 0
  try{        
    await dbConnection.query(`
      UPDATE tbl_employee_payroll SET 
        bank_id=${req.body.bank_id}, pay_gross=${req.body.pay_gross}, pay_basic=${req.body.pay_basic}, 
        pay_increment=${req.body.pay_increment}, pay_bonus=${req.body.pay_bonus}, house_allowance=${req.body.house_allowance}, 
        conveyance_allowance=${req.body.conveyance_allowance}, utility_allowance=${req.body.utility_allowance}, medical_allowance	=${req.body.medical_allowance	}, 
        overtime=${req.body.overtime}, other_allowance=${req.body.other_allowance}, tax_able=${req.body.tax_able}, tax_deducted=${req.body.tax_deducted}, 
        eobi_contribution=${req.body.eobi_contribution}, net_pay_transferred=${req.body.net_pay_transferred}  
      WHERE payroll_id=${req.body.payroll_id}
    `)
    resp = 1        
  } catch(e) { console.error(e.message)}
  
  return resp
}


const isExistsDB = async (id=0) => {
  let resp = 0
  let res = []
  
  try {
    res = await dbConnection.query(`SELECT * FROM tbl_employee_payroll WHERE emp_id =${id}`)    
    resp = res.rows.length    
  } catch(e) { console.error(e.message)}
  
  return resp  
}



module.exports = { 
  getAllEmployeePayrollMod,
  getEmployeePayrollByIDMod,
  getPayrollByIDMod,
  getEmployeePayrollByTeamLeadIDMod,
  addEmployeePayrollMod, 
  generateSalarySlip4AllMod,
  releaseSalarySlip4AllMod,
  isSalaryGeneratedReleasedMod,
  editEmployeePayrollMod
}
