
const nodemailer = require("nodemailer");


// async..await is not allowed in global scope, must use a wrapper
const sendEmailMod = async (req, res) => {  
     
  try {    
        let testAccount = await nodemailer.createTestAccount(); // testAccount.user, testAccount.pass

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "asterisksolutions.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
            user: 'raza@asterisksolutions.com',
            pass: 'I(%Qb&tgkY}q'
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"' + req.body.from_name + '" <' + req.body.from_email + '>', // sender address
            to: req.body.to_email, // list of receivers
            subject: req.body.subject_email, // Subject line
            //text: "Hello world?", // plain text body
            html: req.body.body_email, // html body
        });

        return {status:200, message: "Email sent successfully.", details: info}   
    
  } catch (error) {
    return {status:309, message: error.message}   
  }  
  
}


module.exports = {
    sendEmailMod
}
