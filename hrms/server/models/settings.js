const dbConnection = require("../db-config").pool;

const { sendEmailMod } = require("../models/mailer")


const getSettingMOD = async (req, res) => {
    let response = { status: 409, msg: "Couldn't found record." }

    try{
       const resp = await dbConnection.query(`
          SELECT setting_id, whitelist_ips, notify_emails, bank_id FROM tbl_setting          
      `)
      if(resp && resp.rows.length > 0) {
        response = {}
        response = resp.rows[0]
      }  else {
        // insert first record
        await dbConnection.query(`
            INSERT INTO tbl_setting(whitelist_ips,notify_emails) VALUES('','')
        `)
        // get record
        const resp = await dbConnection.query(`
          SELECT setting_id, whitelist_ips, notify_emails, bank_id FROM tbl_setting          
        `)
        response = {}
        response = resp.rows[0]
      }    
    } catch(e) { console.error(e.message)
        response = {}
    }
    return response
}


const updateSettingMOD = async (req, res) => {  
    let response = { status: 409, msg: "Couldn't update record." }
    
    try{             
        await dbConnection.query(`
            UPDATE tbl_setting SET        
            whitelist_ips='${req.body.whitelist_ips}', notify_emails='${req.body.notify_emails}', bank_id=${req.body.bank_id}
            WHERE setting_id=${req.body.setting_id}   
        `)
        response = {}
        response = { status: 200, msg: "Updated successfully." }

    } catch(e) {console.log(e.message)} 
    return response;
}   



const deleteAllLeavesMOD = async (req, res) => {  
    let response = { status: 409, msg: "Couldn't delete records." }
    
    try{             
        await dbConnection.query(`
            UPDATE tbl_emp_leaves SET leaves_total=5, leaves_availed=0, leaves_remaining=0, leaves_type=''
        `)
        await dbConnection.query(`
            DELETE FROM tbl_emp_leaves_request
        `)
        response = {}
        response = { status: 200, msg: "Records deleted successfully." }

    } catch(e) {console.log(e.message)} 
    return response;
}


const deleteAllAttendanceMOD = async (req, res) => {  
    let response = { status: 409, msg: "Couldn't delete records." }
    
    try{             
        await dbConnection.query(`
            DELETE FROM tbl_employee_attendance
        `)
        response = {}
        response = { status: 200, msg: "Records deleted successfully." }

    } catch(e) {console.log(e.message)} 
    return response;
}


const deleteAllPayslipMOD = async (req, res) => {  
    let response = { status: 409, msg: "Couldn't delete records." }
    
    try{             
        await dbConnection.query(`
            DELETE FROM tbl_employee_payroll
        `)
        response = {}
        response = { status: 200, msg: "Records deleted successfully." }

    } catch(e) {console.log(e.message)} 
    return response;
}


const deleteEmployeeByIdMOD = async (req, res) => {  
    let response = { status: 409, msg: "Couldn't delete User record." }    
      
    try{                     
        await dbConnection.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        /* QUERY START */
        await dbConnection.query('BEGIN')            
        await dbConnection.query(`DELETE FROM tbl_inventory WHERE emp_id=${req.body.emp_id}`)
        await dbConnection.query(`DELETE FROM tbl_emp_eobi WHERE emp_id=${req.body.emp_id}`)
        await dbConnection.query(`DELETE FROM tbl_users WHERE emp_id=${req.body.emp_id}`)
        await dbConnection.query(`DELETE FROM tbl_emp_teamlead WHERE emp_id=${req.body.emp_id}`)        
        await dbConnection.query(`DELETE FROM tbl_employee_payroll WHERE emp_id=${req.body.emp_id}`)        
        await dbConnection.query(`DELETE FROM tbl_employee_attendance WHERE emp_id=${req.body.emp_id}`)
        await dbConnection.query(`DELETE FROM tbl_emp_leaves_request WHERE emp_id=${req.body.emp_id}`)
        await dbConnection.query(`DELETE FROM tbl_emp_leaves WHERE emp_id=${req.body.emp_id}`)
        await dbConnection.query(`DELETE FROM tbl_employee WHERE emp_id=${req.body.emp_id}`)
        await dbConnection.query('COMMIT'); 
        /* QUERY END */
        response = {}
        response = { status: 200, msg: "User record deleted successfully." }

    } catch(e) {
        await dbConnection.query('ROLLBACK');
        console.log(e.message)
    } 
    return response;
}



const resetAllUsersPasswordMod = async (req, res) => {  
    let response = { status: 409, msg: "Couldn't reset passwords." }
    
    try{    
        
        // Email data
        let maildata = {
            to_email: "", 
            from_email: "no-reply@asterisksolutions.com", 
            from_name: "[HRMS] Password Alert", 
            subject_email: "Password Alert", 
            body_email: ""
        }
        
        // get Users 
        let responseUsers = []
        responseUsers = await dbConnection.query(`
          SELECT emp_id,email1 FROM tbl_users
        `)
        
        for(var i=0; i<responseUsers.rows.length; i++) {
            // generated random passwords
            let passwd = Math.floor(Math.random() * (100000000 - 100000) ) + 100000        
            // update password
            await dbConnection.query(`            
                UPDATE tbl_users SET passwd='${passwd}'                
                WHERE emp_id=${responseUsers.rows[i].emp_id}
            `)
            
            // Email body
            maildata.to_email = responseUsers.rows[i].email1
            maildata.body_email = ("<div>Dear User, <br></br><br></br>" +
                                    "You can sign in the HRMS application using the below detials for daily attendance onwards according to company rule.<br></br><br></br>" +                  
                                    "<b>App URL:</b> http://52.45.50.201/hrms<br></br>" +
                                    "<b>Username:</b> " + responseUsers.rows[i].email1 + "<br></br>" +
                                    "<b>Password:</b> " + passwd + "<br></br><br></br>" +
                                    "Thank you,<br></br>" +
                                    "Asterisk Solutions" +
                                    "<br></br><br></br><br></br><p style='color:#1a0dab; font-size:11px; font-style: italic;'>*It is system generated email. Don't reply to this email.</p>");  
            req.body = maildata
            let emailStatus = await sendEmailMod(req, res)               
        }                
        response = { status: 200, msg: "Passwords updated and Users notified successfully." }

    } catch(e) {console.log(e.message)} 
    return response;
}

module.exports = {
    getSettingMOD,
    updateSettingMOD,
    deleteAllLeavesMOD,
    deleteAllAttendanceMOD,
    deleteAllPayslipMOD,
    deleteEmployeeByIdMOD,
    resetAllUsersPasswordMod 
}