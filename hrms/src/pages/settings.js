import React, { useEffect, useState, useCallback, useRef } from "react";
import {GetDepartment} from "../API/Department"
import {GetDesignation} from "../API/Designation"
import {GetRole} from "../API/Role"
import { GetAllBank } from "../API/Bank";
import {GetSetting, UpdateSetting, DeleteAllLeaves, DeleteAllPayslip, DeleteAllAttendance, ResetAllUsersPassword} from "../API/Settings";
import { useParams, Link } from "react-router-dom";
import Sidenav from "../components/sidenav/Sidenav";
import EditDropdownElements from "../components/elements/EditDropdownElements";



const Settings = () => {

  const [loading, setLoading] = useState(true);
  const [formData, updateFormData] = React.useState({});
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [roles, setRoles] = useState([]);
  const [banks, setBanks] = useState([]);
  const [setting, setSetting] = useState({});
  const [doneSuccess, setDoneSuccess] = useState(false);
  const [doneFail, setDoneFail] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState("");  
  const [messageCancelYes, setMessageCancelYes] = useState("");  
  const [showDialog, setShowDialog] = useState(false);
  const [roleSlug, setRoleSlug] = useState(localStorage.getItem("role_slug"));
  const [clickTypeDialog, setClickTypeDialog] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [wait, setWait] = useState(false);
  const roleArray = ["super_admin"]
  
    
  // timer
  const [count, setCount] = useState(0);
  const countRef = useRef();
  countRef.current = count;

  const month =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thrusday","Friday","Saturday"]

  let login_id = { id: localStorage.getItem('id') };
  let login_role = { role_slug: localStorage.getItem('role_slug') };
  let emp_id = { emp_id: localStorage.getItem('id') };
  let newdata = { ...login_role, ...login_id, ...emp_id };
  
  
        
    
  useEffect(() => {          
    try {             
      // API calls
      apiCalls()            
                       
      // today's date
      let d = new Date()
      let year = d.getFullYear()
      let month = d.getMonth() + 1 
      let dat = d.getDate()    
      let time = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
      let date = {year: year, month: month, date: dat, time: time}
      
      // Loader Delay
      setTimeout(() => {
        setLoading(false);
      }, 250);
      
    } catch(e) {
      setDepartments([]) 
      setDesignations([])           
      setRoles([])
      setBanks([])
      setSetting({})            
      setLoading(false)
    }
  }, []);

  
 const apiCalls = async (e) => {  
    // Call API for roles
    GetRole(newdata).then(r=>setRoles(r.data))
    
    // API call departements
    GetDepartment(newdata).then(r=>setDepartments(r.data))

    // API call designations
    GetDesignation(newdata).then(r=>setDesignations(r.data))

    // API call bank
    GetAllBank(newdata).then(r=>setBanks(r.data))

    // Call API for setting
    GetSetting(newdata).then(r=>setSetting(r.data))    

 }

  // Loader
  if(loading){return (
    <div class="loader">
      <div class="spinner-grow text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-secondary" role="status">
      <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-success" role="status">
      <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-danger" role="status">
      <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-warning" role="status">
      <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-info" role="status">
      <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-light" role="status">
      <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-dark" role="status">
      <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-center">Loading please wait...</p>
    </div>)
  }
 
  
 // handle input change
 const handleChangeInput = e => {
    let st = {...setting}
    st[e.target.name] = e.target.value    
    setSetting(st)
 }

  // handle update click
  const handleClickUpdate = async e => {
      e.preventDefault()
      
      // API call to update setting
      let data = {...newdata, ...setting}
      UpdateSetting(data).then((r)=>{
        if(r.data.status == 200) {
          setDoneSuccess(true);
          setMessageCancelYes("Settings updated successfully.")
        } else {
          setDoneFail(true);
          setMessageCancelYes(r.data.msg)
        }
        // timer
        const timer = setTimeout(() => {
          let c = count + 1
          setCount(c);
          if(c>0) {
            setDoneSuccess(false)
            setDoneFail(false)
            setMessageCancelYes(r.data.msg)
          }
        }, 3000); 
        return () => clearTimeout(timer);    
      })    
  }


  //////////////////// *** Clear Data Section

  // Handle dialog
  const handleDialog = async (event) => {
    // set values
    if(event.type == "Reset") {
      setMessage({title:"Reset Passwords?", mesg:"Are you sure you want to reset password for all Users? This will generate random password for all Users and will be notified using Email with login details."})
    } else {
      setMessage({title:"Delete All?", mesg:"Are you sure you want to delete all \"" + event.type + " Data\" of Users permenently?"})
    }
    setShowDialog(true)
    setClickTypeDialog(event.type)
        
    // create timer
    timeInterval = setInterval(timerFunction, 100);    
  } 

  // Timer function
  let timeInterval = null;
  const timerFunction = () => {
    if(!showDialog) clearInterval(timeInterval)
  }

  // Handle cancel
  const handleCancel = () => {
    setShowDialog(false)
    setConfirm(false)
    setWait(false)
  }

  // Handle cancel
  const handleConfirm = () => {
    setConfirm(true)
  }

  // handle clear attendance
  const handleClearAttendance =  () => {
    DeleteAllAttendance({role_slug:roleSlug}).then(r=>{
      setShowDialog(false)
      setConfirm(false)
      if(r.data.status == 200) {
        // set message dialog
        setDoneSuccess(true)
        setMessageCancelYes("Attendance records deleted successfully.")          
        
        setTimeout(() => {            
          setDoneSuccess(false)
          setMessageCancelYes("")
        }, 2000);
      } else {
        // set message dialog        
        setDoneFail(true)
        setMessageCancelYes(r.data.msg)          
        
        setTimeout(() => {            
          setDoneFail(false)
          setMessageCancelYes("")
        }, 2000);        
      }
    })
    console.log("attendance")
  }


  // handle clear leaves
  const handleClearLeaves =  () => {
    DeleteAllLeaves({role_slug:roleSlug}).then(r=>{
      setShowDialog(false)
      setConfirm(false)
      if(r.data.status == 200) {
        // set message dialog
        setDoneSuccess(true)
        setMessageCancelYes("Leaves records deleted successfully.")          
        
        setTimeout(() => {            
          setDoneSuccess(false)
          setMessageCancelYes("")
        }, 2000);
      } else {
        // set message dialog
        setDoneFail(true)
        setMessageCancelYes(r.data.msg)          
        
        setTimeout(() => {            
          setDoneFail(false)
          setMessageCancelYes("")
        }, 2000);        
      }
    })
  }

  
  // handle clear Payslip
  const handleClearPayslip =  () => {
    DeleteAllPayslip({role_slug:roleSlug}).then(r=>{
      setShowDialog(false)
      setConfirm(false)
      if(r.data.status == 200) {
        // set message dialog
        setDoneSuccess(true)
        setMessageCancelYes("Payslip records deleted successfully.")          
        
        setTimeout(() => {            
          setDoneSuccess(false)
          setMessageCancelYes("")
        }, 2000);
      } else {
        // set message dialog
        setDoneFail(true)
        setMessageCancelYes(r.data.msg)          
        
        setTimeout(() => {            
          setDoneFail(false)
          setMessageCancelYes("")
        }, 2000);        
      }
    })
  }

  // handle reset passwords
  const handleResetPasswords = async ()=>{
    setWait(true)
    ResetAllUsersPassword({role_slug:roleSlug}).then(r=>{
      setShowDialog(false)
      setConfirm(false)
      if(r.data.status == 200) {
        // set message dialog
        setDoneSuccess(true)
        setMessageCancelYes("Reset passwords and notified Users done successfully.")          
        setWait(false)
        
        setTimeout(() => {            
          setDoneSuccess(false)
          setMessageCancelYes("")
        }, 2000);
      } else {
        // set message dialog
        setDoneFail(true)
        setMessageCancelYes(r.data.msg)          
        setWait(false)
        
        setTimeout(() => {            
          setDoneFail(false)
          setMessageCancelYes("")
        }, 2000);        
      }
    })

  }
 


  ///////////////// *** Update Dropdown Dialog Section



  // Handle dialog
  const handleEditDialog = async (event) => {
    // set values
    setShowEditDialog(true)

    // create timer
    timeEditInterval = setInterval(timerEditFunction, 100);    
  } 

  // Timer function
  let timeEditInterval = null;
  const timerEditFunction = () => {
    if(!showEditDialog) clearInterval(timeEditInterval)
  }

  // Handle cancel
  const handleEditCancel = () => {
    setShowEditDialog(false)    
  }
  
  /*const opt = [{value:1, label:"one"},{value:2, label:"two"}]
  const [options, setOptions] = useState(opt)
  const [option, setOption] = useState({value:3, label:"three"})
  const [selectedOption, setSelectedOption] = useState({})*/
  
  
  return (
    <>
      <Sidenav />
      <section class="col-lg-10 InnerContent">
        
        <article class="breadcrumbs  pt-4" id="breadCrumbs">
          <div class="container">
            <div class="row">
              <div class="col-lg-7 col-md-6 col-sm-5 col-5 breadcrumbContent">
                <h2> Change Settings</h2>

                <nav aria-label="breadcrumb">
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Dashboard</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                      Settings
                    </li>
                  </ol>
                </nav>
              </div>
              <div class="col-lg-5 col-md-6 col-sm-7 col-7 menuButton text-end">
                {/*<button class="menutabs">
                  <i class="fas fa-th"></i>
                </button>
                <button class="menutabs">
                  <i class="fas fa-bars icon1"></i>
                </button>
                <button
                  type="button"
                  class="employee my-2"
                  data-bs-container="popover"
                  data-bs-toggle="popover"
                  data-bs-placement="bottom"
                  data-bs-content="Bottom popover"
                >
                  <i class="fas fa-plus"></i>Add Leave
                </button>*/}
              </div>
            </div>
          </div>
        </article>

        <article class="setting">
          <div class="container">
            <div class="row">
              
              <div class="col-12 col-md-12">
                <div class="inner mb-4 w-100 mw-100 h-100">                        


                  <form >
                    <div class="form-row row">
                      {(roleSlug == "super_admin" || roleSlug == "administrator") && <>
                        <h5 className="my-0 mt-2">Clear User Data</h5>
                        <div class="form-group col-12"><hr class="my-2"></hr></div>                      
                        <label for="clear-data" class="mb-4 text-red">
                          *This section will clear Attendance Data, Leaves Data, Payslips and Reset users password<br></br>
                          **Please be careful before proceeding.
                        </label>
                        <div class="form-group col-12 col-md-3 pb-2">
                          <button type="button" onClick={()=>handleDialog({type: "Attendance"})} class="btn btn-primary bg-danger">Clear Attendance</button>
                        </div>  
                        <div class="form-group col-12 col-md-3 pb-2">
                          <button type="button" onClick={()=>handleDialog({type: "Leaves"})} class="btn btn-primary bg-danger">Clear Leaves</button>
                        </div>
                        <div class="form-group col-12 col-md-3 pb-2">
                          <button type="button" onClick={()=>handleDialog({type: "Payslip"})} class="btn btn-primary bg-danger">Clear Payslip</button>
                        </div>
                        <div class="form-group col-12 col-md-3 pb-2">
                          <button type="button" onClick={()=>handleDialog({type: "Reset"})} class="btn btn-primary bg-danger">Reset Passwords</button>
                        </div>
                      </>}  

                      <h5 className="my-0 mt-3">Basic Setting</h5>
                      <div class="form-group col-12"><hr class="my-2"></hr></div>                      
                      <div class="form-group col-12 col-md-4 pb-2">
                        <label for="role">Select Access Role {/*<button type="button" onClick={handleEditDialog} className="btn-edit"> Edit</button>*/}</label>
                        <select name="role" class="form-control">
                          <option value="" selected>Choose Role...</option>
                          {roles.map(item=>(
                            <option value={item.role_id} >{item.role_title}</option>   
                          ))}
                        </select>
                      </div>
                      <div class="form-group col-12 col-md-4 pb-2">
                        <label for="department">Select Department</label>
                        <select name="department" class="form-control">
                          <option value="" selected>Choose Department...</option>
                          {departments.map(item=>(
                            <option value={item.dept_id} >{item.dept_title}</option>   
                          ))}
                        </select>
                      </div>
                      <div class="form-group col-12 col-md-4 pb-2">
                        <label for="designation">Select Designation</label>
                        <select name="designation" class="form-control">
                          <option value="" selected>Choose Designation...</option>
                          {designations.map(item=>(
                            <option value={item.desig_id} >{item.desig_title}</option>
                          ))}
                        </select>
                      </div>
                      <div class="form-group col-12 col-md-4 pb-2">
                        <label for="bank">Select Bank for Account Operations</label>
                        <select name="bank_id" class="form-control" onChange={handleChangeInput}>
                          <option value="" selected>Choose Bank...</option>
                          {banks.map(item=>(
                            <option value={item.bank_id} selected={item.bank_id == setting.bank_id ? 'true' : false} >{item.bank_name}, {item.bank_address}</option>
                          ))}
                        </select>
                      </div>
                      
                      <h5 className="my-0 mt-2">IP Setting</h5>
                      <div class="form-group col-12"><hr class="my-2"></hr></div>                      
                      <div class="form-group col-12 pb-2">
                        <label for="role">Provide comma seprated IPs to whitelist for Attendance notification.</label>
                        <textarea className="w-100" name="whitelist_ips" onChange={handleChangeInput} value={setting.whitelist_ips}></textarea>
                      </div>

                      <h5 className="my-0 mt-2">Email Setting</h5>
                      <div class="form-group col-12"><hr class="my-2"></hr></div>                      
                      <div class="form-group col-12 pb-2">
                        <label for="role">Provide comma seprated emails to send Admin notifications.</label>
                        <textarea className="w-100" name="notify_emails" onChange={handleChangeInput} value={setting.notify_emails}></textarea>
                      </div>

                      
                    </div>  

                    
                    <button type="submit" class="btn btn-primary mt-3" onClick={handleClickUpdate}>Update Settings</button>
                  </form>
                </div>                
              </div>
            </div>
          </div>
        </article>
        
        
        {showDialog && <>
            <div class="modal fade in d-block confirmModal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="false" id="mi-modal">
              <div class="modal-dialog ">
                <div class="modal-content">
                  <div class="modal-header">
                    <button onClick={handleCancel} type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">{message.title}</h4>
                  </div>
                  <div class="modal-body">
                   <p>{message.mesg}</p>
                  </div>
                  <div class="modal-footer">
                    <button onClick={handleCancel} type="button" class="btn btn-default" id="modal-btn-cancel">Cancel</button>
                    {(!confirm && clickTypeDialog == "Leaves") && <button onClick={handleConfirm} type="button" class="btn btn-danger" id="modal-btn-yes">Yes</button>}
                    {(!confirm && clickTypeDialog == "Attendance") && <button onClick={handleConfirm} type="button" class="btn btn-danger" id="modal-btn-yes">Yes</button>}
                    {(!confirm && clickTypeDialog == "Payslip") && <button onClick={handleConfirm} type="button" class="btn btn-danger" id="modal-btn-yes">Yes</button>}
                    {(!confirm && clickTypeDialog == "Reset") && <button onClick={handleConfirm} type="button" class="btn btn-danger" id="modal-btn-yes">Yes</button>}

                    {(!wait && confirm && clickTypeDialog == "Leaves") && <button onClick={handleClearLeaves} type="button" class="btn btn-danger" id="modal-btn-yes">Delete All Leaves</button>}
                    {(!wait && confirm && clickTypeDialog == "Attendance") && <button onClick={handleClearAttendance} type="button" class="btn btn-danger" id="modal-btn-yes">Delete All Attendance</button>}
                    {(!wait && confirm && clickTypeDialog == "Payslip") && <button onClick={handleClearPayslip} type="button" class="btn btn-danger" id="modal-btn-yes">Delete All Payslip</button>}
                    {(!wait && confirm && clickTypeDialog == "Reset") && <button onClick={handleResetPasswords} type="button" class="btn btn-danger" id="modal-btn-yes">Reset All Users Password</button>}
                  
         
                    {wait && <button class="btn btn-danger" type="button" disabled>
                      <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                      Please wait...
                    </button>}

                  </div>
                </div>
              </div>
            </div>
            <div class="alert" role="alert" id="result"></div>
          </>}  


          {showEditDialog && <>
            <div class="modal fade in d-block confirmModal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="false" id="mi-modal">
              <div class="modal-dialog ">
                <div class="modal-content">
                  <div class="modal-header">
                    <button onClick={handleEditCancel} type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel"> title </h4>
                  </div>
                  <div class="modal-body">
                    <EditDropdownElements roles={roles} />
                  </div>
                  <div class="modal-footer">
                    <button onClick={handleEditCancel} type="button" class="btn btn-default" id="modal-btn-cancel">Cancel</button>
                    <button onClick={handleConfirm} type="button" class="btn btn-success" id="modal-btn-yes">Update</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="alert" role="alert" id="result"></div>
          </>}  


          {doneSuccess && <div class="popupMessageBox alert alert-success alert-dismissible w-50" role="alert">
            {doneSuccess && messageCancelYes}
            <a href="#">&times;</a>
          </div>}

          {doneFail && <div class="popupMessageBox alert alert-danger alert-dismissible w-50" role="alert">
            {doneFail && messageCancelYes}
            <a href="#">&times;</a>
          </div>}

        <section id="EmployeeAttendance" class="employeeAttendance">
          <article>
            <div class="container">
              <div class="row">
                <div class="col-12 mt-4">
                  


                </div>
              </div>
            </div>
          </article>
        </section>
      </section>
    </>
  );
};

export default Settings;
