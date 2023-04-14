const dbConnection = require("../db-config").pool
let rowRecords = {}

const getAllHolidayMod = async () => {
  let response = { status: 409, msg: "Holiday not found." }
  try{
    response = await dbConnection.query(`SELECT DISTINCT holiday_id, holiday_title, holiday_desc, holiday_day, holiday_month, holiday_year, no_of_days, is_active FROM tbl_holiday ORDER BY holiday_month,holiday_day DESC`)
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}

const getHolidayByIDMod = async (req, res) => {
  let response = { status: 409, msg: "Holiday not found." }
  try {
    response = await dbConnection.query(`SELECT DISTINCT holiday_id, holiday_title, holiday_desc, holiday_day, holiday_month, holiday_year, no_of_days, is_active FROM tbl_holiday where holiday_id=${req.params.id}`)
    rowRecords = response.rows
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}


const addHolidayMod = async (req, res) => {
  let response = { status: 409, msg: "Holiday Adding Failed." }
  let resp = await isExistsDB(req.body.holiday_title)

  if (resp > 0) { 
    return (response = {
      status: 309,
      msg: `Holiday already exists`,
    })
  } else {    
    let resp = await insertDB(req, res)
    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Holiday added successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Couldn't perform operation!`,
      })
    }
  }
}


const updateHolidayMod = async (req, res) => {    
    let resp = await updateDB(req, res)    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Holiday <strong> ${req.body.holiday_title} </strong> Updated Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Holiday <strong> ${req.body.holiday_title}  </strong> Updation Failed !!!`,
      })
    }
    
  
}


const deleteHolidayMod = async (req, res) => {        
    let resp = await deleteDB(req, res)
    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Holiday deleted successfully.`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Holiday deletion failed.`,
      })
    }
}


const insertDB = async (req, res) => {  
  let resp = 0  
  try{             
    await dbConnection.query(`
        INSERT INTO tbl_holiday (holiday_title, holiday_day, holiday_month, no_of_days, is_active)         
        VALUES ('${req.body.holiday_title}', ${req.body.holiday_day}, ${req.body.holiday_month}, ${req.body.no_of_days}, '${1}')
    `)  
    resp = 1        
  } catch(e) { console.error(e.message)}
  
  return resp
}


const deleteDB = async (req, res) => {  
  let resp = 0  
  try {    
    await dbConnection.query(`DELETE FROM tbl_holiday WHERE holiday_id =${req.body.holiday_id}`)          
    resp = 1
  } catch(e) { console.error(e.message)}

  return resp  
}


const updateDB = async (req, res) => {  
  let resp = 0
  try{        
    await dbConnection.query(`UPDATE tbl_holiday SET holiday_title='${req.body.holiday_title}', holiday_desc='${req.body.holiday_desc}', holiday_day='${req.body.holiday_day}', holiday_month='${req.body.holiday_month}', no_of_days=${req.body.no_of_days} WHERE holiday_id=${req.body.id}`)
    resp = 1        
  } catch(e) { console.error(e.message)}
  
  return resp
}


const isExistsDB = async (title="") => {
  let resp = 0
  let res = []
  
  try {
    res = await dbConnection.query(`SELECT holiday_title FROM tbl_holiday WHERE holiday_title ='${title}'`)    
    resp = res.rows.length    
  } catch(e) { console.error(e.message)}
  
  return resp  
}



module.exports = { 
  getAllHolidayMod, 
  getHolidayByIDMod,
  addHolidayMod, 
  deleteHolidayMod,
  updateHolidayMod
}
