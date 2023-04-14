const { dataSource } = require("../data-source")

const {
  getAllHolidayMod,
  getHolidayByIDMod,
  addHolidayMod,
  deleteHolidayMod,
  updateHolidayMod  
} = require("../models/holiday")

const roles = ["super_admin", "manager", "administrator"];


const getAllHoliday = async (req, res) => { 
  let holidayData = []

  try {
    holidayData = await getAllHolidayMod(req, res)
    return res.json(holidayData)  
  } catch{}
}


const getHolidayByID = async (req, res) => { 
  let holidayData = []

  try {
    holidayData = await getHolidayByIDMod(req, res)
    console.log("aaa")
    return res.json(holidayData)  
  } catch {}
}


const addHoliday = async (req, res) => {
  if (!req.body) {
    req.body = {}
  }

  if (!req.body.role_slug || !roles.includes(req.body.role_slug) || !req.body.holiday_title || !req.body.no_of_days) {
    return res.json({ status: 309, msg: "Couldn't perform operation!" })
  } else {
      let response = await addHolidayMod(req, res)
      res.json(response)   
  }
}


const updateHoliday = async (req, res) => {
  if (!req.body) {
    req.body = {}
  }

  let holiday_id = 0
  try {
    holiday_id = (!req.body.id ? 0 : req.body.id)    
  } catch (e) {}
   
  if (!holiday_id) {
    return res.json({ status: 309, msg: "Select Holiday to Update !!!" })
  } else {
    if (dataSource == "pgSQL") {
      let response = await updateHolidayMod(req, res)
      res.json(response)
    } 
  }
}


const deleteHoliday = async (req, res) => {
  if (!req.body) {
    return;
  }  
  
  if (!req.body.role_slug || !roles.includes(req.body.role_slug) || !req.body.holiday_id) {
    return res.json({ status: 309, msg: "Couldn't perform operation!" })
  } else {
    let resp = await deleteHolidayMod(req, res)      
    if(resp.status == 200) {
      return res.json({ status: 200, msg: "Record Deleted Successfully." })
    } else {
      return res.json({ status: 309, msg: "Record could not Delete." })
    }    
  }
}


module.exports = { 
  getAllHoliday, 
  getHolidayByID, 
  addHoliday,
  deleteHoliday,
  updateHoliday
}
