const { dataSource } = require("../data-source")

const {
  getAllAnnounceMod,
  getAnnounceByEmpIdMod,
  getAnnounceUpcomingMod,
  addAnnounceMod,
  deleteAnnounceMod,
  updateAnnounceMod  
} = require("../models/announce")

const getAllAnnounce = async (req, res) => { 
  let employeeData = []

  if (dataSource == "pgSQL") {
    employeeData = await getAllAnnounceMod(req, res)
    res.json(employeeData)  
  }
}


const getAnnounceByEmpId = async (req, res) => { 
  let employeeData = []

  if (dataSource == "pgSQL") {
    employeeData = await getAnnounceByEmpIdMod(req, res)
    res.json(employeeData)  
  }
}


const getAnnounceUpcoming = async (req, res) => { 
  let employeeData = []

  if (dataSource == "pgSQL") {
    employeeData = await getAnnounceUpcomingMod(req, res)
    res.json(employeeData)  
  }
}


const addAnnounce = async (req, res) => {
  if (!req.body) {
    req.body = {}
  }

  let annoucnce_title = ""
  let emp_id = 0
  try {
    annoucnce_title = (!req.body.announce_title ? "" : req.body.announce_title)    
    emp_id = (!req.body.emp_id ? 0 : req.body.emp_id)    
  } catch (e) {}
  
  if (!annoucnce_title || !emp_id) {
    return res.json({ status: 309, msg: "Announcement requied fields should not be empty!" })
  } else {
    if (dataSource == "pgSQL") {
      let response = await addAnnounceMod(req, res)
      res.json(response)
    } 
  }
}


const updateAnnounce = async (req, res) => {
  if (!req.body) {
    req.body = {}
  }

  let announce_id = 0
  try {
    announce_id = (!req.body.announce_id ? 0 : req.body.announce_id)    
  } catch (e) {}
   
  if (!announce_id) {
    return res.json({ status: 309, msg: "Select Announcement to Update !!!" })
  } else {
    if (dataSource == "pgSQL") {
      let response = await updateAnnounceMod(req, res)
      res.json(response)
    } 
  }
}


const deleteAnnounce = async (req, res) => {
  if (!req.params) {
    req.params = {}
  }
  
  let id = 0
  try {    
    id = req.params.id        
  } catch (e) {}
  
  if (!id || id == 0) {    
    return res.json({ status: 309, msg: "Please Select an Announcement to Delete !" })
  } else {
    if (dataSource == "pgSQL") {      
      let resp = await deleteAnnounceMod(req, res)      
      if(resp.status == 200) {
        return res.json({ status: 200, msg: "Role Deleted Successfully !" })
      } else {
        return res.json({ status: 309, msg: "Role could not Delete !!!" })
      }
    } 
    
  }
}


module.exports = { 
  getAllAnnounce, 
  getAnnounceByEmpId, 
  getAnnounceUpcoming,
  addAnnounce,
  deleteAnnounce,
  updateAnnounce
}
