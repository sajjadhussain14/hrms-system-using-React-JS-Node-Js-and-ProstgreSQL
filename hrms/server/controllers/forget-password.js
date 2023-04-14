const { dataSource } = require("../data-source")

const {
    findEmailMod,
    createSaltMod,
    validateSaltMod,
    updatePasswordMod
} = require("../models/forget-password")


const findEmail = async (req, res) => { 
  let retData = {}
  if(!req.body || !req.body.email) {
    return;
  }

  try {
    retData = await findEmailMod(req, res)
    return res.json(retData)  
  } catch{}
  return retData;
}


const createSalt = async (req, res) => { 
  let retData = []  
  if(!req.body.emp_id || !req.body.email){
    return;
  }
  
  try {
    retData = await createSaltMod(req, res)   
    return res.json(retData)  
  } catch{}
  
  return retData;
}


const validateSalt = async (req, res) => { 
  let retData = {}  
  if(!req.body || !req.body.url){
    return;
  }
  
  try {
    retData = await validateSaltMod(req, res)       
    return res.json(retData)  
  } catch(e){console.log(e.message)}
  return retData;
}


const updatePassword = async (req, res) => { 
  let retData = []
  if(!req.body || !req.body.password || !req.body.email || !req.body.url) {
    return;
  }

  try {
    retData = await updatePasswordMod(req, res)    
    return res.json(retData)  
  } catch(e){console.log(e.message)}
}




module.exports = { 
    findEmail,
    createSalt,
    validateSalt,
    updatePassword
}
