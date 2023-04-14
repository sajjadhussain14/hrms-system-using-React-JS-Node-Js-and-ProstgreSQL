const dbConnection = require("../db-config").pool
let rowRecords = {}

const getAllAnnounceMod = async () => {
  let response = { status: 409, msg: "Announcement not found." }
  const dat = new Date()
  const year = dat.getFullYear()  

  try{
    response = await dbConnection.query(`SELECT announce_id, emp_id, announce_title, announce_desc, announce_day, announce_month, announce_year FROM tbl_announcement WHERE CAST(announce_year AS INT)>=${year}`)
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}


const getAnnounceByEmpIdMod = async (req, res) => {
  let response = { status: 409, msg: "Announcement not found." }
  const dat = new Date()
  const day = dat.getDate()
  const month = dat.getMonth() + 1
  const year = dat.getFullYear()  
  try {
    response = await dbConnection.query(`
      SELECT announce_id, emp_id, announce_title, announce_desc, announce_day, announce_month, announce_year FROM tbl_announcement 
      WHERE emp_id=${req.params.id} CAST(CONCAT(CAST(announce_year AS VARCHAR(4)), '-',CAST(announce_month AS VARCHAR(2)), '-',CAST(announce_day AS VARCHAR(2))) AS DATE)>='${year}-${month}-${day}'
    `)
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}


const getAnnounceUpcomingMod = async (req, res) => {
  let response = { status: 409, msg: "Announcement not found." }
  const dat = new Date()
  const day = dat.getDate()
  const month = dat.getMonth() + 1
  const year = dat.getFullYear()

  try {
    response = await dbConnection.query(`
      SELECT announce_id, emp_id, announce_title, announce_desc, announce_day, announce_month, announce_year FROM tbl_announcement 
      WHERE CAST(CONCAT(CAST(announce_year AS VARCHAR(4)), '-',CAST(announce_month AS VARCHAR(2)), '-',CAST(announce_day AS VARCHAR(2))) AS DATE)>='${year}-${month}-${day}'
    `)
    rowRecords = response.rows        
  } catch(e) { console.error(e.message)
    rowRecords = []
  }  
  return rowRecords
}


const addAnnounceMod = async (req, res) => {
  let response = { status: 409, msg: "Announcement Adding Failed." }
  let resp = await isExistsDB(req.body.announce_title)

  if (resp > 0) { 
    return (response = {
      status: 309,
      msg: `Announcement <strong> ${req.body.announce_title} </strong> Already Exixts`,
    })
  } else {    
    let resp = await insertDB(req, res)
    console.log(resp)
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Announcement <strong> ${req.body.announce_title}  </strong> Created Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Announcement <strong> ${req.body.announce_title}  </strong> Creation Failed!!!`,
      })
    }
  }
}


const updateAnnounceMod = async (req, res) => {    
    let resp = await updateDB(req, res)    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Announcement <strong> ${req.body.announce_title} </strong> Updated Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Announcement <strong> ${req.body.announce_title}  </strong> Updation Failed !!!`,
      })
    }
}


const deleteAnnounceMod = async (req, res) => {        
    let resp = await deleteDB(req, res)
    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Announcement <strong>  </strong> Deleted Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Announcement Deletion Failed!!!`,
      })
    }
}


const insertDB = async (req, res) => {  
  let resp = 0
  try{             
    await dbConnection.query(`
        INSERT INTO tbl_announcement (emp_id, announce_title, announce_desc, announce_day, announce_month, announce_year)         
        VALUES (${req.body.emp_id}, '${req.body.announce_title}', '${req.body.announce_desc}', '${req.body.announce_day}', '${req.body.announce_month}', '${req.body.announce_year}')
    `)  
    resp = 1        
  } catch(e) { console.error(e.message)}
  
  return resp
}


const deleteDB = async (req, res) => {  
  let resp = 0  
  try {
    if(req.body.id == -123) {
      await dbConnection.query(`DELETE FROM tbl_announcement`)          
    } else {
      await dbConnection.query(`DELETE FROM tbl_announcement WHERE announce_id =${req.params.id}`)      
    }
    
    resp = 1
  } catch(e) { console.error(e.message)}

  return resp  
}


const updateDB = async (req, res) => {  
  let resp = 0
  try{        
    await dbConnection.query(`UPDATE tbl_announcement SET announce_title='${req.body.announce_title}', announce_desc='${req.body.announce_desc}', announce_day='${req.body.announce_day}', announce_month='${req.body.announce_month}', announce_year='${req.body.announce_year}' WHERE announce_id=${req.body.announce_id}`)
    resp = 1        
  } catch(e) { console.error(e.message)}
  
  return resp
}


const isExistsDB = async (title="") => {
  let resp = 0
  let res = []
  
  try {
    //res = await dbConnection.query(`SELECT emp_id, announce_title, announce_desc, announce_day, announce_month, announce_year FROM tbl_announcement WHERE lower(announce_title) ='${title.toLowerCase()}'`)    
    //resp = res.rows.length    
  } catch(e) { console.error(e.message)}
  
  return resp  
}



module.exports = { 
  getAllAnnounceMod, 
  getAnnounceByEmpIdMod,
  getAnnounceUpcomingMod,
  addAnnounceMod, 
  deleteAnnounceMod,
  updateAnnounceMod
}



