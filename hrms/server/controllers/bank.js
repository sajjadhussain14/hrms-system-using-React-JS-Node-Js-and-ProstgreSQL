const e = require("cors");
const { dataSource } = require("../data-source")

const {
  getAllBankMod,
  getBankByIDMod,
  addBankMod,
  deleteBankMod,
  updateBankMod  
} = require("../models/bank")



const getAllBank = async (req, res) => { 
  let bankData = []
  if(!req.body){
    return;
  }
    
  try {
    if(req.body.id && req.body.role_slug) {
      attendanceData = await getAllBankMod(req, res)
      bankData = res.json(attendanceData)  
    } else {
      bankData = res.json({ status: 309, msg: "Couldn't get data." })  
    }
  } catch(e){
    bankData = res.json({ status: 309, msg: e.message })
  }

  return bankData;
}


const getBankById = async (req, res) => { 
  let bankData = []
  if(!req.body){
    return;
  }
    
  try {
    if(req.body.id && req.body.role_slug) {
      attendanceData = await getBankByIDMod(req, res)
      bankData = res.json(attendanceData)  
    } else {
      bankData = res.json({ status: 309, msg: "Couldn't get data." })  
    }
  } catch(e){
    bankData = res.json({ status: 309, msg: e.message })
  }

  return bankData;
}



const addBank = async (req, res) => {
  if (!req.body) {
    req.body = {}
  }

  let bank_name = ""
  try {
    bank_name = (!req.body.bank_name ? "" : req.body.bank_name)    
  } catch (e) {}
  
  if (!bank_name) {
    return res.json({ status: 309, msg: "Role requied fields should not be empty!" })
  } else {
    if (dataSource == "pgSQL") {
      let response = await addBankMod(req, res)
      res.json(response)
    } 
  }
}


const updateBank= async (req, res) => {
  if (!req.body) {
    req.body = {}
  }

  let bank_id = 0
  try {
    bank_id = (!req.body.id ? 0 : req.body.id)    
  } catch (e) {}
   
  if (!bank_id) {
    return res.json({ status: 309, msg: "Select Bank to Update !!!" })
  } else {
    if (dataSource == "pgSQL") {
      let response = await updateBankMod(req, res)
      res.json(response)
    } 
  }
}


const deleteBank = async (req, res) => {
  if (!req.params) {
    req.params = {}
  }
  
  let id = 0
  try {    
    id = req.params.id        
  } catch (e) {}
  
  if (!id || id == 0) {    
    return res.json({ status: 309, msg: "Please Select an Role to Delete !" })
  } else {
    if (dataSource == "pgSQL") {      
      let resp = await deleteBankMod(req, res)      
      if(resp.status == 200) {
        return res.json({ status: 200, msg: "Role Deleted Successfully !" })
      } else {
        return res.json({ status: 309, msg: "Role could not Delete !!!" })
      }
    } 
    
  }
}


module.exports = { 
  getAllBank,
  getBankById, 
  addBank,
  deleteBank,
  updateBank
}
