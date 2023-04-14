const dbConnection = require("../db-config").pool
let rowRecords = {}


const getInventoryByEmpIdMod = async (req, res) => {
  let response = { status: 409, msg: "Record not found." }
  
  try{
    response = await dbConnection.query(`SELECT inventory_id, emp_id, emp_id, computer, brand, spec, serial_no, hdd, keyboard, mouse, laptopbag, screen, accessories FROM tbl_inventory WHERE emp_id=${req.body.emp_id}`)
    rowRecords = response.rows[0]
  } catch(e) { console.error(e.message)
    rowRecords = []
  }
  return rowRecords
}


const addInventoryMod = async (req, res) => {
  let response = { status: 409, msg: "Inventory Adding Failed." }
  let resp = await isExistsDB(req.body.emp_id, req.body.inventory_name, req.body.brand)

  if (resp > 0) { 
    return (response = {
      status: 309,
      msg: `Inventory <strong> ${req.body.inventory_name} , ${req.body.brand} </strong> for Employee Already Exists`,
    })
  } else {    
    let resp = await insertDB(req, res)
    console.log(resp)
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Inventory <strong> ${req.body.inventory_name}  </strong> Created Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Inventory <strong> ${req.body.role_title}  </strong> Creation Failed!!!`,
      })
    }
  }
}


const deleteInventoryMod = async (req, res) => {        
    let resp = await deleteDB(req, res)
    
    if (resp > 0) {
      return (response = {
        status: 200,
        msg: `Inventory <strong>  </strong> Deleted Successfully`,
      })
    } else {
      return (response = {
        status: 309,
        msg: `Inventory Deletion Failed!!!`,
      })
    }
}


const insertDB = async (req, res) => {  
  let resp = 0
  try{             
    await dbConnection.query(`
        INSERT INTO tbl_inventory (emp_id, inventory_name, brand, spec, serial_no, qty)         
        VALUES (${req.body.emp_id}, '${req.body.inventory_name}', '${req.body.brand}', '${req.body.spec}', '${req.body.serial_no}', ${req.body.qty})
    `)  
    resp = 1        
  } catch(e) { console.error(e.message)}
  
  return resp
}


const deleteDB = async (req, res) => {  
  let resp = 0  
  try {
    if(req.body.id == -123) {
      await dbConnection.query(`DELETE FROM tbl_inventory`)          
    } else {
      await dbConnection.query(`DELETE FROM tbl_inventory WHERE inventory_id =${req.params.id}`)      
    }
    
    resp = 1
  } catch(e) { console.error(e.message)}

  return resp  
}


const isExistsDB = async (id, title="", brand="") => {
  let resp = 0
  let res = []
  
  try {
    res = await dbConnection.query(`SELECT inventory_name FROM tbl_inventory WHERE lower(inventory_name)='${title.toLowerCase()}' AND lower(brand)='${brand.toLowerCase()}' AND emp_id=${id}`)   
    resp = res.rows.length    
  } catch(e) { console.error(e.message)}
  
  return resp  
}



module.exports = { 
  getInventoryByEmpIdMod, 
  addInventoryMod, 
  deleteInventoryMod,
}
