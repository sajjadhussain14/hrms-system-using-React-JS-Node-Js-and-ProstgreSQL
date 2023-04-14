const nodemailer = require("nodemailer");

const {
  sendEmailMod
} = require("../models/mailer")



const sendEmail = async (req, res) => { 
  
  if(!req.body || !req.body.to_email || !req.body.from_email || !req.body.body_email) {
    return;
  }
  
  try {
    let emailStatus = await sendEmailMod(req, res)    
    return res.json(emailStatus)  
  } catch(error){ }
}



module.exports = { 
    sendEmail  
}
