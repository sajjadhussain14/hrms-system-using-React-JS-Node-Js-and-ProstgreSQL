const dbConnection = require("../db-config").pool
let empRecords = {}

const getEmployees4CountMod = async (req, res) => {
  let response = { status: 409, msg: "Emaile not found." }
  
  let qeury = ""
  if(req.body.role_slug && req.body.role_slug != "super_admin") {
    qeury = " AND rol.role_slug<>'super_admin'"
  }

  try{
    response = await dbConnection.query(`
        SELECT DISTINCT * FROM tbl_employee emp
          INNER JOIN tbl_role rol ON emp.role_id=rol.role_id       
        WHERE resign_date='' ${qeury}
        ORDER BY desig_id, first_name              
    `)
    empRecords = response.rows
  } catch(e) { console.error(e.message)
    empRecords = []
  }
  return empRecords
}


const getAllEmployeeMod = async (req, res) => {
  let response = { status: 409, msg: "Employees not found." }
  try{
    let query = ""
    if(req.body.department) {
      query = " dep.dept_title='" + req.body.department + "'" 
    } else if(req.body.designation) {
      query = " des.desig_title='" + req.body.designation + "'" 
    } else if(req.body.name) {
      query = " lower(emp.first_name) LIKE '%" + req.body.name.toLowerCase() + "%'" 
      query += " OR lower(emp.last_name) LIKE '%" + req.body.name.toLowerCase() + "%'" 
    } else if(req.body.emp_number) {
      query = " lower(emp.emp_number) LIKE '" + req.body.emp_number.toLowerCase() + "%'"       
    }
    if(query.length){
      query = " WHERE length(emp.resign_date)=0  AND (" + query + ") "
    } else {
      query = " WHERE length(emp.resign_date)=0 "
    }
    
    if(req.body.role_slug != "super_admin") {
      query += " AND rol.role_slug<>'super_admin'"
    }  
    
    response = await dbConnection.query(`
        SELECT DISTINCT emp.*,
        lev.leaves_id, lev.leaves_total, lev.leaves_availed, lev.leaves_remaining, lev.leaves_alloted,
        dep.dept_title, dep.dept_desc,
        des.desig_id, des.desig_title, des.desig_desc, 
        rol.role_id, rol.role_title, rol.role_slug, rol.role_desc
        FROM tbl_employee emp
        FULL JOIN tbl_emp_leaves lev ON emp.emp_id=lev.emp_id
        FULL OUTER JOIN tbl_department dep ON emp.dept_id=dep.dept_id
        FULL OUTER JOIN tbl_designation des ON emp.desig_id=des.desig_id
        FULL OUTER JOIN tbl_role rol ON emp.role_id=rol.role_id
        ${query}
        ORDER BY des.desig_id, emp.first_name              
    `)
    
    empRecords = response.rows
  } catch(e) { console.error(e.message)
    empRecords = []
  }
  return empRecords
}

const getAllExEmployeeMod = async (req, res) => {
  let response = { status: 409, msg: "Employees not found." }
  try{
    let query = ""
    if(req.body.department) {
      query = " dep.dept_title='" + req.body.department + "'" 
    } else if(req.body.designation) {
      query = " des.desig_title='" + req.body.designation + "'" 
    } else if(req.body.name) {
      query = " lower(emp.first_name) LIKE '%" + req.body.name.toLowerCase() + "%'" 
      query += " OR lower(emp.last_name) LIKE '%" + req.body.name.toLowerCase() + "%'" 
    } else if(req.body.emp_number) {
      query = " lower(emp.emp_number) LIKE '" + req.body.emp_number.toLowerCase() + "%'"       
    }
    if(query.length){
      query = " WHERE length(emp.resign_date)>0 AND (" + query + ") "
    } else {
      query = " WHERE length(emp.resign_date)>0 "
    }
    

    response = await dbConnection.query(`
        SELECT DISTINCT emp.*,
        lev.leaves_id, lev.leaves_total, lev.leaves_availed, lev.leaves_remaining, lev.leaves_alloted,
        dep.dept_id, dep.dept_title, dep.dept_desc,
        des.desig_id, des.desig_title, des.desig_desc, 
        rol.role_id, rol.role_title, rol.role_slug, rol.role_desc
        FROM tbl_employee emp
        FULL JOIN tbl_emp_leaves lev ON emp.emp_id=lev.emp_id
        FULL OUTER JOIN tbl_department dep ON emp.dept_id=dep.dept_id
        FULL OUTER JOIN tbl_designation des ON emp.desig_id=des.desig_id
        FULL OUTER JOIN tbl_role rol ON emp.role_id=rol.role_id
        ${query}
        ORDER BY des.desig_id, emp.first_name              
    `)    
    empRecords = response.rows
  } catch(e) { console.error(e.message)
    empRecords = []
  }
  return empRecords
}

const getEmployeeByIDMod = async (req, res) => {
  let response = { status: 409, msg: "Employee not found." }
  try {
    
    response = await dbConnection.query(`
    SELECT DISTINCT emp.*, emp.report_to as emp_report_to,
    dep.dept_title, dep.dept_desc,
    des.desig_title, des.desig_desc, 
    rol.role_title, rol.role_slug, rol.role_desc,
    bnk.bank_name, bnk.bank_branch, bnk.bank_address,
    lev.leaves_id, lev.leaves_total, lev.leaves_availed, lev.leaves_remaining, lev.leaves_alloted,
    led.teamlead_id
    FROM tbl_employee emp
      INNER JOIN tbl_department dep ON emp.dept_id=dep.dept_id
      INNER JOIN tbl_designation des ON emp.desig_id=des.desig_id
      INNER JOIN tbl_role rol ON emp.role_id=rol.role_id
      INNER JOIN tbl_bank bnk ON emp.bank_id=bnk.bank_id                     
      INNER JOIN tbl_emp_leaves lev ON emp.emp_id=lev.emp_id 
      FULL OUTER JOIN tbl_emp_teamlead led ON emp.emp_id=led.emp_id
    where emp.emp_id=${req.body.emp_id}
    `) 
    
    empRecords = response.rows[0]    
  } catch(e) { 
    console.error(e)
    empRecords = []
  }
  return empRecords
}


const getReportToByIDMod = async (req, res) => {
  let response = { status: 409, msg: "Employee not found." }
  try {
    response = await dbConnection.query(`
      SELECT DISTINCT emp.emp_id, emp.first_name, emp.last_name, emp.emp_pic, emp.gender, emp.emp_email,
      dep.dept_title, dep.dept_desc,
      des.desig_title, des.desig_desc, 
      rol.role_title, rol.role_slug, rol.role_desc
      FROM tbl_employee emp
      INNER JOIN tbl_department dep ON emp.dept_id=dep.dept_id
      INNER JOIN tbl_designation des ON emp.desig_id=des.desig_id
      INNER JOIN tbl_role rol ON emp.role_id=rol.role_id
        where emp.emp_id=${req.body.id}
    `) 
    
    empRecords = response.rows[0]    
  } catch(e) { 
    console.error(e)
    empRecords = []
  }
  return empRecords
}


const getAllReportToMod = async (req, res) => {
  let response = { status: 409, msg: "Employee not found." }
  empRecords= []
  
  try {
    response = await dbConnection.query(`
      SELECT DISTINCT emp.emp_id, emp.first_name, emp.last_name,
      dep.dept_id, dep.dept_title, dep.dept_desc,
      des.desig_id, des.desig_title, des.desig_desc, 
      rol.role_id, rol.role_title, rol.role_slug, rol.role_desc
      FROM tbl_employee emp
      INNER JOIN tbl_department dep ON emp.dept_id=dep.dept_id
      INNER JOIN tbl_designation des ON emp.desig_id=des.desig_id
      INNER JOIN tbl_role rol ON emp.role_id=rol.role_id
        WHERE des.desig_title in('Director','CEO','Team Lead','Sr. Manager','Manager','Administrator')
      ORDER BY des.desig_id, emp.first_name
    `) 
    
    empRecords = response.rows    
  } catch(e) { 
    console.error(e)
    empRecords = []
  }
  return empRecords
}


const getEmployeeReportToMod = async (req, res) => {
  let response = { status: 409, msg: "Record not found." }
  empRecords= []
  
  try {    
    response = await dbConnection.query(`
      SELECT DISTINCT emp.emp_id, emp.first_name, emp.last_name,
      dep.dept_id, dep.dept_title, dep.dept_desc,
      des.desig_id, des.desig_title, des.desig_desc, 
      rol.role_id, rol.role_title, rol.role_slug, rol.role_desc
      FROM tbl_employee emp
      INNER JOIN tbl_department dep ON emp.dept_id=dep.dept_id
      INNER JOIN tbl_designation des ON emp.desig_id=des.desig_id
      INNER JOIN tbl_role rol ON emp.role_id=rol.role_id
        WHERE emp.emp_id in(${req.body.ids})
      ORDER BY des.desig_id, emp.first_name
    `) 

    empRecords = response.rows    
  } catch(e) {  
    console.error(e)
    empRecords = []
  }
  return empRecords
}


const getEmployeeByIDsMod = async (req, res) => {
  let response = { status: 409, msg: "Record not found." }
  empRecords= []
  
  try {    
    response = await dbConnection.query(`
      SELECT DISTINCT emp.*,
      dep.dept_id, dep.dept_title, dep.dept_desc,
      des.desig_id, des.desig_title, des.desig_desc, 
      rol.role_id, rol.role_title, rol.role_slug, rol.role_desc
      FROM tbl_employee emp
      INNER JOIN tbl_department dep ON emp.dept_id=dep.dept_id
      INNER JOIN tbl_designation des ON emp.desig_id=des.desig_id
      INNER JOIN tbl_role rol ON emp.role_id=rol.role_id
        WHERE emp.emp_id in(${req.body.ids})
      ORDER BY des.desig_id, emp.first_name
    `) 

    empRecords = response.rows    
  } catch(e) {  
    console.error(e)
    empRecords = []
  }
  return empRecords
}



const getEmployeeByTeamLeadID = async (req, res) => {
  let response = { status: 409, msg: "Employees not found." }
  try {
    let query = ""
    if(req.body.department) {
      query = " dep.dept_title='" + req.body.department + "'" 
    } else if(req.body.designation) {
      query = " des.desig_title='" + req.body.designation + "'" 
    } else if(req.body.name) {
      query = " lower(emp.first_name) LIKE '%" + req.body.name.toLowerCase() + "%'" 
      query += " OR lower(emp.last_name) LIKE '%" + req.body.name.toLowerCase() + "%'" 
    } else if(req.body.emp_number) {
      query = " lower(emp.emp_number) LIKE '" + req.body.emp_number.toLowerCase() + "%'"       
    }
    if(query.length){
      query = " AND length(emp.resign_date)=0 AND (" + query + ") "
    } else {
      query = " AND length(emp.resign_date)=0 "
    }

    response = await dbConnection.query(`
      SELECT DISTINCT emp.*,
        lev.leaves_id, lev.leaves_total, lev.leaves_availed, lev.leaves_remaining, lev.leaves_alloted,
        dep.dept_id, dep.dept_title, dep.dept_desc,
        des.desig_id, des.desig_title, des.desig_desc, 
        rol.role_id, rol.role_title, rol.role_slug, rol.role_desc      
        FROM tbl_employee emp
        FULL JOIN tbl_emp_leaves lev ON emp.emp_id=lev.emp_id
        FULL OUTER JOIN tbl_department dep ON emp.dept_id=dep.dept_id
        FULL OUTER JOIN tbl_designation des ON emp.desig_id=des.desig_id
        FULL OUTER JOIN tbl_role rol ON emp.role_id=rol.role_id      
        INNER JOIN tbl_emp_teamlead led ON emp.emp_id=led.emp_id OR emp.emp_id=led.teamlead_id
      where led.teamlead_id=${req.body.id} ${query}
      ORDER BY des.desig_id, emp.first_name 
    `)
    empRecords = response.rows
    let arr = [];

  } catch(e) { console.error(e.message)
    empRecords = []
  }
  return empRecords
}


const getAllExEmployeeTeamLeadIDMOD = async (req, res) => {
  let response = { status: 409, msg: "Employees not found." }
  try{

    let query = ""
    if(req.body.department) {
      query = " dep.dept_title='" + req.body.department + "'" 
    } else if(req.body.designation) {
      query = " des.desig_title='" + req.body.designation + "'" 
    } else if(req.body.name) {
      query = " lower(emp.first_name) LIKE '" + req.body.name.toLowerCase() + "%'" 
      query += " OR lower(emp.last_name) LIKE '%" + req.body.name.toLowerCase() + "%'" 
    } else if(req.body.emp_number) {
      query = " lower(emp.emp_number) LIKE '" + req.body.emp_number.toLowerCase() + "%'"       
    }
    if(query.length){
      query = " AND length(emp.resign_date)>0 AND (" + query + ")"
    } else {
      query = " AND length(emp.resign_date)>0 "
    }

    console.log(query)
    
    response = await dbConnection.query(`
      SELECT DISTINCT emp.*,
        lev.leaves_id, lev.leaves_total, lev.leaves_availed, lev.leaves_remaining, lev.leaves_alloted,
        dep.dept_id, dep.dept_title, dep.dept_desc,
        des.desig_id, des.desig_title, des.desig_desc, 
        rol.role_id, rol.role_title, rol.role_slug, rol.role_desc
        FROM tbl_employee emp
        FULL JOIN tbl_emp_leaves lev ON emp.emp_id=lev.emp_id
        FULL OUTER JOIN tbl_department dep ON emp.dept_id=dep.dept_id
        FULL OUTER JOIN tbl_designation des ON emp.desig_id=des.desig_id
        FULL OUTER JOIN tbl_role rol ON emp.role_id=rol.role_id
        INNER JOIN tbl_emp_teamlead led ON emp.emp_id=led.emp_id OR emp.emp_id=led.teamlead_id
      WHERE led.teamlead_id=${req.body.id} ${query}
      ORDER BY des.desig_id, emp.first_name              
    `)    
    empRecords = response.rows
  } catch(e) { console.error(e.message)
    empRecords = []
  }
  return empRecords
}


const getTeamLeadsOnly = async (req, res) => {
  let response = { status: 409, msg: "Employees not found." }
  try {
    response = await dbConnection.query(`
      SELECT DISTINCT emp.*, 
      dep.dept_title, des.desig_title, rol.role_title, rol.role_slug, eob.eobi_number, eob.eobi_amount
      FROM tbl_employee emp
      INNER JOIN tbl_department dep ON emp.dept_id=dep.dept_id
      INNER JOIN tbl_designation des ON emp.desig_id=des.desig_id
      INNER JOIN tbl_role rol ON emp.role_id=rol.role_id
      FULL OUTER JOIN tbl_emp_eobi eob ON emp.emp_id=eob.emp_id
      INNER JOIN tbl_emp_teamlead led ON emp.emp_id=led.teamlead_id
    `)
    empRecords = response.rows    
  } catch(e) { console.error(e.message)
    empRecords = []
  }
  return empRecords
}
 

const addEmployeeMod = async (req, res) => {
  let response = { status: 409, msg: "Employee Adding Failed!" }
  let resp = await isExistsDB(id=0, req)

  if (resp > 0) { 
    return (response = {
      status: 309,
      msg: `Page <strong> ${req.body.first_name} ${req.body.last_name} </strong> Already Exixts`,
    })
  } else {    
    let resp = await insertDB(req, res)
    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Employee <strong> ${req.body.first_name} ${req.body.last_name} </strong> Created Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Employee <strong> ${req.body.first_name} ${req.body.last_name}  </strong> Creation Failed!!!`,
      })
    }
  }
}


const addEmployeeCSVMod = async (req, res) => {
  let response = { status: 409, msg: "Employee Adding Failed." }
  let resp = 0 //await isExistsDB(id=0, req)

  if (resp > 0) { 
    return (response = {
      status: 309,
      msg: `Page <strong> ${req.body.first_name} ${req.body.last_name} </strong> Already Exixts`,
    })
  } else {    
    let resp = await insertCSV2DB(req, res)    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Employee Records Created Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Employee Records Creation Failed!!!`,
      })
    }
  }
}


const updateEmployeeMod = async (req, res) => {    
    let resp = await updateDB(req, res)    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Employee <strong> ${req.body.first_name} ${req.body.last_name} </strong> Updated Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Employee <strong> ${req.body.first_name} ${req.body.last_name}  </strong> Updation Failed !!!`,
      })
    }
    
  
}


const deleteEmployeeMod = async (req, res) => {
  let count = await isExistsDB(req.body.id, req)  
  if(count > 0 || req.body.id == -123) {
    let resp = await deleteDB(req, res)    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Employee <strong> ${req.body.first_name} ${req.body.last_name} </strong> Deleted Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Employee Deletion Failed!!!`,
      })
    }  
  } else {
    return (response = {
      status: 309,
      msg: `Employee does not Exists!!!`,
    })
  }  
}


const insertDB = async (req, res) => {  
  let resp = 0
  let led_id = 0
  try{             
    await dbConnection.query(`
        INSERT INTO tbl_employee (dept_id, desig_id, role_id, first_name, last_name, father_name, gender, marital_status, emp_number, emp_cnic, 
          account_number, emp_ntn, emp_dob, emp_email, emp_mobile, emp_phone, emp_country, emp_city, zip_code, emp_address1, emp_address2, emp_photo, 	
          qualification, joining_date, resign_date, report_to, primary_name, primary_relation,	primary_phone, secondary_name, secondary_relation, 
          secondary_phone, employment_of_spouse) 
        
        VALUES ('${req.body.dept_id}', '${req.body.desig_id}', '${req.body.role_id}', '${req.body.first_name}', '${req.body.last_name}', '${req.body.father_name}', '${req.body.gender}', '${req.body.marital_status}', '${req.body.emp_number}', '${req.body.emp_cnic}', 
          '${req.body.account_number}', '${req.body.emp_ntn}', '${req.body.emp_dob}', '${req.body.emp_email}', '${req.body.emp_mobile}', '${req.body.emp_phone}', '${req.body.emp_country}', '${req.body.emp_city}', '${req.body.zip_code}', '${req.body.emp_address1}', '${req.body.emp_address2}', '${req.body.emp_photo}', 
          '${req.body.qualification}', '${req.body.joining_date}', '${req.body.resign_date}', '${req.body.report_to}', '${req.body.primary_name}', '${req.body.primary_relation}',	'${req.body.primary_phone}', '${req.body.secondary_name}', '${req.body.secondary_relation}', 
          '${req.body.secondary_phone}', '${req.body.employment_of_spouse}')      
    `)

    if(req.body.teamlead_id > 0) {
      const inserted_id = await getLastIdDB('tbl_employee')
      await dbConnection.query(`INSERT INTO tbl_emp_teamlead (teamlead_id, emp_id) VALUES (${req.body.teamlead_id}, ${inserted_id})`)
    }
    resp = 1        
  } catch(e) { console.error(e.message)}
  
  return resp
}


const insertCSV2DB = async (req, res) => {  
  let resp = 0
  try{                 
    for(let i=0; i<req.body.records.length; i++) {
      //console.log("counter "+i)
            
      if(req.body.records[i].emp_cnic && req.body.records[i].first_name && req.body.records[i].last_name) {
          // get employee if exists
          let responseEmp = []
          responseEmp = await dbConnection.query(`
            SELECT * FROM tbl_employee       
              WHERE emp_cnic='${req.body.records[i].emp_cnic}' AND lower(first_name)='${req.body.records[i].first_name.toLowerCase()}' AND lower(last_name)='${req.body.records[i].last_name.toLowerCase()}'
          `)
          
          // insert employee if not exists
          if(responseEmp.rows.length == 0) {
            await dbConnection.query(`
                INSERT INTO tbl_employee (dept_id, desig_id, role_id, first_name, last_name, father_name, gender, marital_status, emp_number, emp_cnic, 
                  account_number, emp_ntn, emp_dob, emp_email, emp_mobile, emp_phone, emp_country, emp_city, zip_code, emp_address1, emp_address2, emp_photo, 	
                  qualification, joining_date, resign_date, report_to, primary_name, primary_relation,	primary_phone, secondary_name, secondary_relation, 
                  secondary_phone, employment_of_spouse, duty_start_time, duty_end_time) 
                
                VALUES (${req.body.records[i].dept_id}, ${req.body.records[i].desig_id}, ${req.body.records[i].role_id}, '${req.body.records[i].first_name}', '${req.body.records[i].last_name}', '${req.body.records[i].father_name}', '${req.body.records[i].gender}', '${req.body.records[i].marital_status}', '${req.body.records[i].emp_number}', '${req.body.records[i].emp_cnic}', 
                  '${req.body.records[i].account_number}', '${req.body.records[i].emp_ntn}', '${req.body.records[i].emp_dob}', '${req.body.records[i].emp_email}', '${req.body.records[i].emp_mobile}', '${req.body.records[i].emp_phone}', '${req.body.records[i].emp_country}', '${req.body.records[i].emp_city}', '${req.body.records[i].zip_code}', '${req.body.records[i].emp_address1}', '${req.body.records[i].emp_address2}', '${req.body.records[i].emp_photo}', 
                  '${req.body.records[i].qualification}', '${req.body.records[i].joining_date}', '${req.body.records[i].resign_date}', '${req.body.records[i].report_to}', '${req.body.records[i].primary_name}', '${req.body.records[i].primary_relation}',	'${req.body.records[i].primary_phone}', '${req.body.records[i].secondary_name}', '${req.body.records[i].secondary_relation}', 
                  '${req.body.records[i].secondary_phone}', ${req.body.records[i].employment_of_spouse}, '${req.body.records[i].duty_start_time}', '${req.body.records[i].duty_end_time}')      
            `)
            
          } else { // update employee if exists
            await dbConnection.query(`            
              UPDATE tbl_employee SET dept_id=${req.body.records[i].dept_id}, desig_id=${req.body.records[i].desig_id}, role_id=${req.body.records[i].role_id}, first_name='${req.body.records[i].first_name}', last_name='${req.body.records[i].last_name}', father_name='${req.body.records[i].father_name}', gender='${req.body.records[i].gender}', marital_status='${req.body.records[i].marital_status}', emp_number='${req.body.records[i].emp_number}', emp_cnic='${req.body.records[i].emp_cnic}', 
                account_number='${req.body.records[i].account_number}', emp_ntn='${req.body.records[i].emp_ntn}', emp_dob='${req.body.records[i].emp_dob}', emp_email='${req.body.records[i].emp_email}', emp_mobile='${req.body.records[i].emp_mobile}', emp_phone='${req.body.records[i].emp_phone}', emp_country='${req.body.records[i].emp_country}', emp_city='${req.body.records[i].emp_city}', zip_code='${req.body.records[i].zip_code}', emp_address1='${req.body.records[i].emp_address1}', emp_address2='${req.body.records[i].emp_address2}', emp_photo='${req.body.records[i].emp_photo}', 
                qualification='${req.body.records[i].qualification}', joining_date='${req.body.records[i].joining_date}', resign_date='${req.body.records[i].resign_date}', report_to='${req.body.records[i].report_to}', primary_name='${req.body.records[i].primary_name}', primary_relation='${req.body.records[i].primary_relation}',	primary_phone='${req.body.records[i].primary_phone}', secondary_name='${req.body.records[i].secondary_name}', secondary_relation='${req.body.records[i].secondary_relation}', 
                secondary_phone='${req.body.records[i].secondary_phone}', employment_of_spouse=${req.body.records[i].employment_of_spouse}, duty_start_time='${req.body.records[i].duty_start_time}', duty_end_time='${req.body.records[i].duty_end_time}'
              WHERE emp_cnic='${req.body.records[i].emp_cnic}' AND first_name='${req.body.records[i].first_name}' AND last_name='${req.body.records[i].last_name}'
            `)
          }
          
          // get emp_id
          let emp_id = await getLastIdDB('tbl_employee')
          if(responseEmp.rows.length > 0) {
            emp_id = responseEmp.rows[0].emp_id
          }           
          
          // get leaves if exists
          let responseLeaves = []
          responseLeaves = await dbConnection.query(`
            SELECT * FROM tbl_emp_leaves WHERE emp_id=${emp_id}
          `)
          // insert leaves if not exists
          if(responseLeaves.rows.length === 0) {
            await dbConnection.query(`
                INSERT INTO tbl_emp_leaves (emp_id, leaves_total, leaves_availed, leaves_remaining, leaves_alloted)
                VALUES (${emp_id}, ${req.body.records[i].leaves_total}, ${req.body.records[i].leaves_availed}, ${req.body.records[i].leaves_remaining}, ${req.body.records[i].leaves_alloted})
            `)
          } else { // update leaves if exists
            await dbConnection.query(`            
              UPDATE tbl_emp_leaves SET leaves_total=${req.body.records[i].leaves_total}, leaves_availed=${req.body.records[i].leaves_availed}, leaves_remaining=${req.body.records[i].leaves_remaining}, leaves_alloted=${req.body.records[i].leaves_alloted}                
              WHERE emp_id=${emp_id}
            `)
          }
          
          // get inventory if exists
          if(req.body.records[i].computer) {
              let responseInventory = []
              responseInventory = await dbConnection.query(`
                SELECT * FROM tbl_inventory WHERE emp_id=${emp_id}
              `)
              // insert inventory if not exists
              if(responseInventory.rows.length === 0) {
                await dbConnection.query(`
                    INSERT INTO tbl_inventory (emp_id, computer, brand, spec, serial_no, hdd, keyboard, mouse, laptopbag, screen, accessories)
                    VALUES (${emp_id}, '${req.body.records[i].computer}', '${req.body.records[i].brand}', '${req.body.records[i].spec}', '${req.body.records[i].serial_no}', 
                          '${req.body.records[i].hdd}', '${req.body.records[i].keyboard}', '${req.body.records[i].mouse}', '${req.body.records[i].laptopbag}',
                          '${req.body.records[i].screen}', '${req.body.records[i].accessories}')
                `)
              } else { // update inventory if exists
                await dbConnection.query(`            
                  UPDATE tbl_inventory SET computer='${req.body.records[i].computer}', brand='${req.body.records[i].brand}', spec='${req.body.records[i].spec}', serial_no='${req.body.records[i].serial_no}', hdd='${req.body.records[i].hdd}',
                  keyboard='${req.body.records[i].keyboard}', mouse='${req.body.records[i].mouse}', laptopbag='${req.body.records[i].laptopbag}', screen='${req.body.records[i].screen}', accessories='${req.body.records[i].accessories}'
                  WHERE emp_id=${emp_id}
                `)
              }
          }
          
          // get EOBI if exists
          if(req.body.records[i].eobi_number) {
              let responseEOBI = []
              responseEOBI = await dbConnection.query(`
                SELECT * FROM tbl_emp_eobi WHERE emp_id=${emp_id}
              `)
              // insert EOBI if not exists
              if(responseEOBI.rows.length === 0) {
                await dbConnection.query(`
                    INSERT INTO tbl_emp_eobi (emp_id, eobi_number, eobi_status, eobi_year)
                    VALUES (${emp_id}, '${req.body.records[i].eobi_number}', '${req.body.records[i].eobi_status}', ${req.body.records[i].eobi_year})
                `)
              } else { // update EOBI if exists
                await dbConnection.query(`            
                  UPDATE tbl_emp_eobi SET eobi_number='${req.body.records[i].eobi_number}', eobi_status='${req.body.records[i].eobi_status}', eobi_year=${req.body.records[i].eobi_year}                
                  WHERE emp_id=${emp_id}
                `)
              }
          }

          // get Bank if exists
          let responseBank = []
          responseBank = await dbConnection.query(`
            SELECT * FROM tbl_bank WHERE bank_name='${req.body.records[i].bank_name}'
          `)
          // insert Bank if not exists
          if(responseBank.rows.length === 0) {
            await dbConnection.query(`
                INSERT INTO tbl_bank (bank_name, bank_address)
                VALUES ('${req.body.records[i].bank_name}', '${req.body.records[i].bank_address}')
            `)
          } else { // update Bank if exists
            await dbConnection.query(`            
              UPDATE tbl_bank SET bank_name='${req.body.records[i].bank_name}', bank_address='${req.body.records[i].bank_address}'                
              WHERE bank_name='${req.body.records[i].bank_name}'
            `)
          }
          responseBank = await dbConnection.query(`
            SELECT * FROM tbl_bank WHERE bank_name='${req.body.records[i].bank_name}'
          `)
           
          // bank ID
          let bank_id = responseBank.rows[0].bank_id
          
          // get Payroll if exists
          if(req.body.records[i].pay_month && req.body.records[i].pay_year) {
              let responsePayroll = []
              responsePayroll = await dbConnection.query(`
                SELECT * FROM tbl_employee_payroll WHERE emp_id=${emp_id} AND pay_month=${req.body.records[i].pay_month} AND pay_year=${req.body.records[i].pay_year}
              `)
              // insert Payroll if not exists
              if(responsePayroll.rows.length == 0) { 
                await dbConnection.query(`
                    INSERT INTO tbl_employee_payroll (emp_id, bank_id, pay_gross, pay_basic, pay_increment, pay_bonus, house_allowance, conveyance_allowance, utility_allowance, medical_allowance, overtime, other_allowance, tax_able, tax_deducted, eobi_contribution, net_pay_transferred, pay_month, pay_year)
                    VALUES (${emp_id}, ${bank_id}, ${req.body.records[i].pay_gross}, ${req.body.records[i].pay_basic}, ${req.body.records[i].pay_increment}, ${req.body.records[i].pay_bonus}, ${req.body.records[i].house_allowance}, ${req.body.records[i].conveyance_allowance}, ${req.body.records[i].utility_allowance}, 
                            ${req.body.records[i].medical_allowance}, ${req.body.records[i].overtime}, ${req.body.records[i].other_allowance}, ${req.body.records[i].tax_able}, ${req.body.records[i].tax_deducted}, ${req.body.records[i].eobi_contribution}, ${req.body.records[i].net_pay_transferred}, 
                            ${req.body.records[i].pay_month}, ${req.body.records[i].pay_year} )
                `)
              } /*else { // update Payroll if exists
                await dbConnection.query(`            
                  UPDATE tbl_employee_payroll SET 
                    bank_id=${bank_id}, pay_gross=${req.body.records[i].pay_gross}, pay_basic=${req.body.records[i].pay_basic}, pay_increment=${req.body.records[i].pay_increment}, pay_bonus=${req.body.records[i].pay_bonus}, house_allowance=${req.body.records[i].house_allowance}, 
                    conveyance_allowance=${req.body.records[i].conveyance_allowance}, utility_allowance=${req.body.records[i].utility_allowance}, medical_allowance=${req.body.records[i].medical_allowance}, overtime=${req.body.records[i].overtime}, 
                    other_allowance=${req.body.records[i].other_allowance}, tax_able=${req.body.records[i].tax_able}, tax_deducted=${req.body.records[i].tax_deducted}, eobi_contribution=${req.body.records[i].eobi_contribution}, 
                    net_pay_transferred=${req.body.records[i].net_pay_transferred}, pay_month=${req.body.records[i].pay_month}, pay_year=${req.body.records[i].pay_year}
                  WHERE emp_id=${emp_id}
                `)          
              }*/
            }
          
          // get Users if exists
          let responseUsers = []
          let email = req.body.records[i].emp_email.toLowerCase().replace(" ","").replace(" ","").replace(" ","")
          responseUsers = await dbConnection.query(`
            SELECT * FROM tbl_users WHERE emp_id=${emp_id}
          `)
          // insert Users if not exists
          let passwd = Math.floor(Math.random() * (100000000 - 100000) ) + 100000          
          if(responseUsers.rows.length == 0) {
            await dbConnection.query(`
                INSERT INTO tbl_users (emp_id, email1, passwd)
                VALUES (${emp_id}, '${email}', '${passwd}')
            `)
          } else { // update Users if exists
            await dbConnection.query(`            
              UPDATE tbl_users SET passwd='${passwd}', email1='${email}'                
              WHERE emp_id=${emp_id}
            `)
          }

          // Team Lead
          if(req.body.records[i].teamlead_id && req.body.records[i].teamlead_id > 0) {            
            let responseTeamLead = await dbConnection.query(`
              SELECT * FROM tbl_emp_teamlead WHERE emp_id=${emp_id}
            `)            
            if(responseTeamLead.rows.length == 0) {
              /*await dbConnection.query(`
                  INSERT INTO tbl_emp_teamlead (teamlead_id, emp_id) VALUES (${req.body.records[i].teamlead_id}, ${emp_id})
              `)*/    
            } else {
              /*await dbConnection.query(`
                  UPDATE tbl_emp_teamlead SET teamlead_id=${req.body.records[i].teamlead_id} WHERE emp_id=${emp_id})
              `)*/
            }
            
          }
        }
    }
    resp = 1        
  } catch(e) { 
    resp = 0
    console.error(e.message)
  }
  
  return resp
}


const updateDB = async (req, res) => {  
  let resp = 0
  let led_id = 0
  try{             
    await dbConnection.query(`
        UPDATE tbl_employee SET        
        dept_id=${req.body.dept_id}, desig_id=${req.body.desig_id}, role_id=${req.body.role_id}, bank_id=${req.body.bank_id}, first_name='${req.body.first_name}', last_name='${req.body.last_name}', father_name='${req.body.father_name}', gender='${req.body.gender}', marital_status='${req.body.marital_status}', emp_number='${req.body.emp_number}', emp_cnic='${req.body.emp_cnic}', 
        account_number='${req.body.account_number}', emp_ntn='${req.body.emp_ntn}', emp_dob='${req.body.emp_dob}', emp_email='${req.body.emp_email}', emp_mobile='${req.body.emp_mobile}', emp_phone='${req.body.emp_phone}', emp_country='${req.body.emp_country}', emp_city='${req.body.emp_city}', zip_code='${req.body.zip_code}', emp_address1='${req.body.emp_address1}', emp_address2='${req.body.emp_address2}', emp_photo='${req.body.emp_photo}', 
        qualification='${req.body.qualification}', joining_date='${req.body.joining_date}', resign_date='${req.body.resign_date}', report_to='${req.body.report_to}', primary_name='${req.body.primary_name}', primary_relation='${req.body.primary_relation}',	primary_phone='${req.body.primary_phone}', secondary_name='${req.body.secondary_name}', secondary_relation='${req.body.secondary_relation}', 
        secondary_phone='${req.body.secondary_phone}', employment_of_spouse=${req.body.employment_of_spouse}   
        WHERE emp_id=${req.body.id}   
    `)

    // update team lead
    if(req.body.teamlead_id && req.body.teamlead_id > 0) {      
      let tRes = await dbConnection.query(`
        SELECT * FROM tbl_emp_teamlead WHERE emp_id=${req.body.id}
      `)
      if(tRes && tRes.rows.length > 0) {
        await dbConnection.query(`
          UPDATE tbl_emp_teamlead SET teamlead_id=${req.body.teamlead_id} 
          WHERE emp_id=${req.body.id}
        `)
      } else {
        await dbConnection.query(`
          INSERT INTO tbl_emp_teamlead(emp_id, teamlead_id) VALUES(${req.body.id}, ${req.body.teamlead_id})
        `)
      }
      
    }

    // update inventory
    if(req.body.inventory) {
      await dbConnection.query(`
        UPDATE tbl_inventory SET        
        computer='${req.body.inventory.computer}', brand='${req.body.inventory.brand}', spec='${req.body.inventory.spec}', serial_no='${req.body.inventory.serial_no}',
        hdd='${req.body.inventory.hdd}', keyboard='${req.body.inventory.keyboard}', mouse='${req.body.inventory.mouse}', laptopbag='${req.body.inventory.laptopbag}',
        screen='${req.body.inventory.screen}', accessories='${req.body.inventory.accessories}'
        WHERE inventory_id=${req.body.inventory.inventory_id}   
      `)
    }
    
    resp = 1        
  } catch(e) { console.log(e.message)}
  
  return resp
}


const editEmployeeProfileMod = async (req, res) => {  
  let resp = 0
  
  try{             
    resp = updateDB(req, res)        
  } catch(e) { console.error(e.message)}
  
  return resp
}


const deleteDB = async (req, res) => {  
  let resp = 0
  
  try {
    if(req.body.id == -123) {
      await dbConnection.query(`DELETE FROM tbl_employee`)
      await dbConnection.query(`DELETE FROM tbl_emp_teamlead`)      
    } else {
      await dbConnection.query(`DELETE FROM tbl_employee WHERE emp_id =${req.body.id}`)      
      await dbConnection.query(`DELETE FROM tbl_emp_teamlead WHERE emp_id =${req.body.id}`)      
    }
    
    resp = 1
  } catch(e) { console.error(e.message)}

  return resp  
}


const isExistsDB = async (id=0, req=[]) => {
  let resp = 0
  let res = []
  
  try {
    if(id > 0) {
      res = await dbConnection.query(`SELECT first_name, last_name, emp_cnic  FROM tbl_employee WHERE emp_id =${id}`)
    } else {
      res = await dbConnection.query(`
        SELECT first_name, last_name, emp_cnic  FROM tbl_employee 
        WHERE lower(first_name) ='${req.body.first_name.toLowerCase()}' AND lower(last_name) ='${req.body.last_name.toLowerCase()}' AND emp_cnic ='${req.body.emp_cnic}'
    `)
    }    
    resp = res.rows.length    
  } catch(e) { console.error(e.message)}
  
  return resp  
}


const getLastIdDB = async (table) => {
  let last_id = 0
  try {
    last_id = await (await dbConnection.query(`select max(emp_id) from ${table}`)).rows[0].max    
  } catch(e) { console.error(e.message)}
  
  return last_id
}


const acceptEmployeeResignationMod = async (req, res) => {  
  let response = { status: 409, msg: "Error in processing resignation status." }
  
  try{             
    await dbConnection.query(`
        UPDATE tbl_employee SET resign_date='${req.body.resign_date}' WHERE emp_id=${req.body.emp_id}   
    `)
    response = { status: 200, msg: "Resignation status in processed successfully." }    
  } catch(e) { console.error(e.message)}
  
  return response
}


module.exports = { 
  getEmployees4CountMod,
  getAllEmployeeMod, 
  getAllExEmployeeMod,
  getEmployeeByIDMod,
  getReportToByIDMod,
  getAllReportToMod,
  getEmployeeReportToMod,
  getEmployeeByTeamLeadID,
  getAllExEmployeeTeamLeadIDMOD,
  getTeamLeadsOnly,
  getEmployeeByIDsMod,
  addEmployeeMod, 
  addEmployeeCSVMod,
  deleteEmployeeMod,
  updateEmployeeMod,
  editEmployeeProfileMod,
  acceptEmployeeResignationMod
}
