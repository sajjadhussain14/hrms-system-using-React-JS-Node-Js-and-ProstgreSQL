import React, { useEffect, useState, useCallback } from "react";
import { GetMonthlyAttendance, PunchIn, GetAttendanceById, GetAttendanceByEmpId, GetTodayAttendance } from "../API/Attendance";
import { GetEmployees} from "../API/Employee";
import { useParams, Link } from "react-router-dom";
import Sidenav from "../components/sidenav/Sidenav";
import { GetSetting } from "../API/Settings";
import { SendEmail } from '../API/mailer';



const AttendenceScreen = () => {

  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState({});
  const [punchStatus, SetpunchStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [roleSlug, setRoleSlug] = useState(localStorage.getItem('role_slug'));
  const [formData, updateFormData] = React.useState({});
  const [isDateTime, setIsDateTime] = React.useState(true);
  const [punchDate, setpunchDate] = useState("");
  const [punchTime, setpunchTime] = useState("")
  const [punchedInTime, setpunchedInTime] = useState("")
  const [workHome, setworkhome] = useState("")
  const [isPresent, setIsPresent] = React.useState(false);
  const [isOnLeave, setIsOnLeave] = React.useState(false);
  const [doneSuccess, setDoneSuccess] = useState(false);
  const [doneFail, setDoneFail] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState("");  
  const [messageCancelYes, setMessageCancelYes] = useState("");  
  const [showDialog, setShowDialog] = useState(false);
  const [clickTypeDialog, setClickTypeDialog] = useState("");
  const [reason, setreason] = useState("");
  const { id, attendance_id } = useParams();
  const month =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thrusday","Friday","Saturday"]


  let login_id = { id: localStorage.getItem('id') };
  let login_role = { role_slug: localStorage.getItem('role_slug') };
  let emp_id = { emp_id: id ? id : localStorage.getItem('id') };
  let newdata = {}
  if(attendance_id) {
    let a_id = {attendance_id: attendance_id} 
    newdata = { ...login_role, ...login_id, ...emp_id, ...a_id };
  } else {
    let emp_id = { emp_id: localStorage.getItem('id') };
    newdata = { ...login_role, ...login_id, ...emp_id };
  }
  
  
  
  const date = new Date() 
  const time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  const renderTime = (punchStatus && (<><strong>Punch In at</strong><span>{days[date.getDay()]}, {month[date.getMonth()]} {date.getFullYear()} {punchedInTime}</span></>))
  let renderDateSheet = ""
  if(attendance_id) {
    renderDateSheet = (<span>{selectedAttendance.in_day + " " + month[selectedAttendance.in_month-1] + " " + selectedAttendance.in_year + ", " + selectedAttendance.in_time}  </span>)
  } else {
    renderDateSheet = (<span>{date.getDate() + " " + month[date.getMonth()] + " " + date.getFullYear()} </span>)
  }
  
  
  
    
  useEffect(() => {              
    try {            
      
      // API Calls
      apiCalls();

      // Loader Delay
      setTimeout(() => {
        setLoading(false);
      }, 300);
      
    } catch(e) {
      console.log(e)
      setSelectedEmployee([]) 
      setSelectedAttendance([])           
      setLoading(false);      
    }
  }, [attendance_id]);

  
  

  const apiCalls = async (e)=>{
  
    // API Call for profile
    GetEmployees(newdata).then(r=>setSelectedEmployee(r.data))
   
    // prep data
    let allow_punch = {allow_punch: "Yes"}
    
    // today's date
    let d = new Date()
    let year = d.getFullYear()
    let month = d.getMonth() + 1 
    let dat = d.getDate()    
    let time = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    let date = {year: year, month: month, date: dat, time: time}
    
    // combine all
    newdata = {...newdata, ...allow_punch, ...date, status:'Present'}
    
    // API Call for punchin
    GetTodayAttendance(newdata).then(r=>{
      SetpunchStatus(r.data.length ? r.data[0].emp_status : "")
      setpunchedInTime(r.data.length ? r.data[0].in_time : "")   
      setreason(r.data.in_notes ? r.data.in_notes : "")               
    })
    
    // API Call for attendance
    GetAttendanceByEmpId(newdata).then(r=>setEmployeeAttendance(r.data))
    
    // Selected attendance
    if(attendance_id && attendance_id != undefined){
      newdata = {...newdata, attendance_id: attendance_id}
      console.log(newdata)
      GetAttendanceById(newdata).then(r=>{
          setSelectedAttendance(r.data)

          /***** Current updating attendance date/time *****/
          let in_month = r.data.in_month;
          let in_day = r.data.in_day;
          let currentAttendanceDate = r.data.in_year + "-" + (in_month.toString().length == 1 ? '0' + in_month : in_month) + "-" + (in_day.toString().length == 1 ? '0' + in_day : in_day); 
          let currentAttendanceTime = ""
          if(r.data.in_time) {
            const tim = r.data.in_time.split(":")
            currentAttendanceTime = (r.data.in_time.includes("PM") && parseInt(tim[0]) < 12 ? parseInt(tim[0]) + 12 : parseInt(tim[0])) + ":" + tim[1].split(" ")[0] + ":00";
          } else {
            currentAttendanceTime = "12:00:00"
          }
          setpunchDate(currentAttendanceDate)
          setpunchTime(currentAttendanceTime)
          /***** Current updating attendance date/time *****/
      })                  
    }      
    
    /***** Today's Attendance *****/
    // set Date
    let dd = new Date()
    let ddate = {year: dd.getFullYear(), month: dd.getMonth()+1, date: dd.getDate(), status:'Leave', emp_id:id}
    newdata = {...newdata, ...ddate}
    
    // API Call for Leave
    GetTodayAttendance(newdata).then(r=>setIsOnLeave(r.data.length > 0 ? true : false))

    // API Call for is present
    newdata.status = 'Present'
    GetTodayAttendance(newdata).then(r=>setIsPresent(r.data.length > 0 ? true : false))
    /***** Today's Attendance *****/
    
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



  const updateAnyPunchInByAdmin = async (event) => {   
    
    if(punchDate && punchTime) {
      setIsDateTime(true)
      // prep data
      let allow_punch = {allow_punch: "Yes"}
      // punch in date
      let d = new Date(punchDate + " " + punchTime)
      let year = d.getFullYear()
      let month = d.getMonth() + 1
      let dat = d.getDate()    
      let time = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
      let date = {year: year, month: month, date: dat, time: time}
      
      // combine all
      newdata = {...newdata, ...allow_punch, ...date, status: (workHome ? workHome : (punchStatus == "Short Leave" ? "Short Leave" : "Present"))}       
      // Update punchin
      let resp = await PunchIn(newdata)      
      SetpunchStatus(resp.data.status)

      // Get attendance
      let attendance = await GetAttendanceByEmpId(newdata)      
      setEmployeeAttendance(attendance.data)   

      // Set message
      setDoneSuccess(true)
      setMessageCancelYes("Attendance updated successfully.")
      
      setTimeout(() => {
        setMessageCancelYes("")
        setDoneSuccess(false)
      }, 500);
            
    } else {
      setIsDateTime(false)
    }      
  }

  const handleChange = (e) => {
    
    if(e.target.name == "punch_time") setpunchTime(e.target.value);
    if(e.target.name == "punch_date") setpunchDate(e.target.value);
    if(e.target.name == "work_home") {
      if(e.target.checked) {
        setworkhome(e.target.value)
      } else {
        setworkhome("")
      }
    }
 
    updateFormData({
      ...formData,

      // Trimming any whitespace
      [e.target.name]: e.target.value.trim()
    });
  };

  // Handle reason
  const handleChangeReason = (e) => {
    var str = e.target.value;
    str = str.replace(/[`'"\(\)\{\}\[\]\\\/]/gi, '')
    setreason(str);     
  };


    
  //////////////////// *** Attendance Dialog


  
  // Handle dialog
  const handleDialog = async (event) => {
    // set values
    if(event.type == "Work from home") {
      setMessage({title:"Work from home?", mesg:"Are you working from home today?"})
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
  }

  // Handle cancel
  const handleConfirm = () => {
    setConfirm(true)
  }

  // Handle Punch In Present
  const handlePunchInPresent = async () => {    
    // prep data
    let allow_punch = {allow_punch: "Yes"}
    // punch in date
    let d = new Date()
    let year = d.getFullYear()
    let month = d.getMonth() + 1 
    let dat = d.getDate()    
    let time = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    let date = {year: year, month: month, date: dat, time: time}

    // combine all
    newdata = {...newdata, ...allow_punch, ...date, status: (punchStatus == 'Short Leave' ? 'Short Leave' : 'Present'), reason: reason ? reason : ""}
    
    // call API for punchin
    let resp = await PunchIn(newdata)          
    SetpunchStatus(resp.data.status)
    setpunchedInTime(resp.data.time);

    // call API for attendance
    let attendance = await GetAttendanceByEmpId(newdata)      
    setEmployeeAttendance(attendance.data)

    // send email
    if(resp.data.status && resp.data.status != undefined) {
      handleEmail();
    }
    
    setShowDialog(false)
    setConfirm(false) 
  }

  // Handle Punch In Remote
  const handlePunchInRemote = async () => {    
    // prep data
    let allow_punch = {allow_punch: "Yes"}
    // punch in date
    let d = new Date()
    let year = d.getFullYear()
    let month = d.getMonth() + 1 
    let dat = d.getDate()    
    let time = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    let date = {year: year, month: month, date: dat, time: time}

    // combine all
    newdata = {...newdata, ...allow_punch, ...date, status:'Work from home', reason: reason ? reason : ""}
    
    // call API for punchin
    let resp = await PunchIn(newdata)          
    SetpunchStatus(resp.data.status)
    setpunchedInTime(resp.data.time)

    // call API for attendance
    let attendance = await GetAttendanceByEmpId(newdata)      
    setEmployeeAttendance(attendance.data)

    // send email
    if(resp.data.status && resp.data.status != undefined) {
      handleEmail();
    }
    
    setShowDialog(false)
    setConfirm(false) 
  }


  // Handle email
  const handleEmail = ()=> {

    let email = localStorage.getItem('email')
    let name = localStorage.getItem('name')

    // Get setting
    GetSetting({role_slug:"super_admin"}).then(r=>{
      if(r.data.whitelist_ips) {
        let ips = r.data.whitelist_ips.split(",");          
        // Email parameters
        let maildata = {
          to_email: r.data.notify_emails ? r.data.notify_emails : 'hr@asterisksolutions.com', 
          from_email: "no-reply@asterisksolutions.com", 
          from_name: "[HRMS] Asterisk Solutions", 
          subject_email: "Attendance Notification", 
          body_email: ""
        }
        // send email if IP not whitelisted
        fetch('https://ifconfig.me/all.json').then(response => response.json()).then(res => { 
          let cur_ip = res.ip_addr; 
          let found = ips.find(item=>{              
            return item === cur_ip.trim();
          })
          // set body and send Email
          if(!found || found == undefined) {
              maildata.body_email = ("<div>Dear Admin, <br></br><br></br>" +
                                    "A user <b>" + name + "</b> has Punched In attendance from unknown IP (" + cur_ip + "). <br></br><br></br>" +                  
                                    "Thank you,<br></br>");  
              SendEmail(maildata).then((resp3)=>{
                // email sent success
              });               
          }            
        });
      }
    }) 
  }


  

  return ( 
    <>
      <Sidenav />
      <section class="col-lg-10 InnerContent">
        <article id="employeeProfile" class="employeeLeaveDetailProfile">
          <div class="container p-0">
            <div class="row">
              <div class="col-12 d-flex align-items-center h-100 info justify-content-between">
                <p>
                  {" "}
                  <span class="name d-block">{selectedEmployee.first_name + " " + selectedEmployee.last_name }</span>{" "}
                  <span class="designation">{selectedEmployee.desig_title}</span>
                </p>
                {
                roleSlug == "super_admin" || roleSlug == "team_lead" || roleSlug == "manager" &&
                <Link type="button" class="btn btn-primary employee mb-1" to={'/attendence-overview'}>
                  <i class="fas fa-chevron-left"></i> Go Back
                </Link>
                }
              </div>
            </div>
          </div>
        </article>
        <article class="breadcrumbs  pt-4" id="breadCrumbs">
          <div class="container">
            <div class="row">
              <div class="col-lg-7 col-md-6 col-sm-5 col-5 breadcrumbContent">
                <h2>Attendance</h2>

                <nav aria-label="breadcrumb">
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Dashboard</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                      Attendance Overview
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

        <article class="AttendancePunchIn">
          <div class="container">
            <div class="row">
              {!attendance_id && !id && <>
                <div class="col-12 col-md-6">
                  <div class="timesheet mb-4">
                    <p class="w-100 text-center">
                      <strong>Timesheet: </strong> { renderDateSheet}
                    </p>
                    <div class="punchIn">                   
                      {(renderTime ? (punchStatus == "Leave" ? "On leave today." : renderTime) : "No punch in result for today.")}
                    </div>
                    
                    {punchStatus == "Work from home" && <span class="status">Working from home</span>}                    
                    {
                     !punchedInTime 
                     ?
                     <button onClick={()=>handleDialog({type: "Work from home"})}>Punch In Attendance</button>
                     :
                     <button className="bg-secondary" disabled>{punchStatus == "Leave" ? 'On Leave' : 'Already Punch In'}</button>
                    }
                    
                  </div>                
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    { 
                      !renderTime
                      ? 
                      <>                        
                        <textarea class="form-control" id="exampleFormControlTextarea1" rows="6" placeholder="Late reason here" onChange={handleChangeReason} value={reason}></textarea>
                        <label for="late-notes text-dark"><b>Are you Punching In late today? Please give reason.</b></label>                    
                      </>
                      :
                      <>
                        <div class="alert alert-light border border-warning m-0" role="alert">
                          {reason ? reason : "No punch in notes available."}
                        </div>
                        {reason && <label for="late-notes text-dark"><b>Late Punch In notes.</b></label>}                    
                      </>
                    }
                  </div>
                </div>              
              </>}

              {attendance_id && id && <div class="col-12 col-md-6">
                <div class="timesheet mb-4">
                  <p>
                    <strong>Change Timesheet:</strong>  { renderDateSheet }       
                  </p>
                  <div class="punchIn py-1 mb-2">  
                    <strong>Select Punch In Date & Time</strong>                  
                    <input class="mt-2 mx-2" type="date" name="punch_date" id="punch_date" onChange={handleChange} value={punchDate}/>
                    <input class="mt-2" type="time" name="punch_time" id="punch_time" onChange={handleChange} value={punchTime}  />                    
                    {punchStatus != "Short Leave" && <label class="mt-2 mx-2"><input type="checkbox" name="work_home" value="Work from home" onChange={handleChange} /> Is <b>{selectedEmployee.first_name + "" + selectedEmployee.last_name}</b> on work from home for the selected date?</label>}
                  </div>
                  {!isDateTime && <div class="alert alert-warning p-1 m-0">Please select Date & Time to update</div>}
                  <button className="mt-2" onClick={updateAnyPunchInByAdmin}>Update Attendance</button>    
                </div>                
              </div>}
            </div>
          </div>
        </article>
        
        

        <article id="filter">
          <div class="container">
            <div class="row">
              {/*<div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-2">
                <select class="form-select" aria-label="Default select example">
                  <option selected="">Select Department</option>
                  <option value="1">Development</option>
                  <option value="2">Integration</option>
                  <option value="3">Designing</option>
                </select>
              </div>
              <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-2">
                <select class="form-select" aria-label="Default select example">
                  <option selected="">Select Department</option>
                  <option value="1">Development</option>
                  <option value="2">Integration</option>
                  <option value="3">Designing</option>
                </select>
              </div>
              <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-2 position-relative">
                <input type="date" placeholder="From" />
                <a href="##">
                  <img
                    src="./images/calendar2-date.png"
                    class="img-fluid"
                    alt=""
                  />
                </a>
              </div>
              <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-2 position-relative">
                <input type="date" placeholder="To" />
                <a href="##">
                  <img
                    src="./images/calendar2-date.png"
                    class="img-fluid"
                    alt=""
                  />
                </a>
              </div>*/}
            </div>
          </div>
        </article>
        <section id="EmployeeAttendance" class="employeeAttendance">
          <article>
            <div class="container">
              <div class="row">
                <div class="col-12 mt-4">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col" class="col-lg-1 text-center">
                          #
                        </th>
                        <th scope="col" class="col">
                          Date
                        </th>
                        <th scope="col">Punch In</th>
                        <th scope="col">Status</th>
                        <th scope="col">Late Punch In Notes</th>                       
                        <th scope="col"></th>                       
                      </tr>
                    </thead>
                    <tbody>
                      {employeeAttendance.map((attendance, index)=>(
                        <tr>
                          <td class="number">
                            <span>{index + 1}</span>
                          </td>
                          <td>
                            <span> {attendance.in_day + " " + month[attendance.in_month-1] + " " + attendance.in_year}</span>
                          </td>
                          <td>
                            {" "}
                            <span> {attendance.in_time ? attendance.in_time : "N/A"}</span>
                          </td>
                          <td>
                            <span> {attendance.emp_status}</span>
                          </td>
                          <td>
                            <span> {attendance.in_notes ? attendance.in_notes : "N/A"}</span>
                          </td>
                          <td>
                          {
                            (roleSlug == 'super_admin' || roleSlug == 'manager' || roleSlug == 'administrator') && 
                            <Link to={"/attendence-screen/" + emp_id.emp_id + "/" + attendance.attendance_id}>Change Punch In Detail</Link>
                          }
                          </td>
                          
                          
                        </tr>              
                      ))                      
                      }                      
                    </tbody>
                  </table>
                  {
                    employeeAttendance.length == 0
                    ?
                    <div class="alert alert-light text-center" role="alert">
                      No attendance record available.
                    </div>
                    :
                    ''
                  }
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
                    <h4 class="modal-title" id="myModalLabel"> {message.title} </h4>
                  </div>
                  <div class="modal-body">
                    {message.mesg}
                  </div>
                  <div class="modal-footer">
                    <button onClick={handleCancel} type="button" class="btn btn-default" id="modal-btn-cancel">Cancle</button>
                    {(!confirm && clickTypeDialog == "Work from home") && <button onClick={handlePunchInPresent} type="button" class="btn btn-danger" id="modal-btn-yes">No</button>}                    
                    {(!confirm && clickTypeDialog == "Work from home") && <button onClick={handleConfirm} type="button" class="btn btn-danger" id="modal-btn-yes">Yes</button>}                    
                    {(confirm && clickTypeDialog == "Work from home") && <button onClick={handlePunchInPresent} type="button" class="btn btn-danger" id="modal-btn-yes">No</button>}
                    {(confirm && clickTypeDialog == "Work from home") && <button onClick={handlePunchInRemote} type="button" class="btn btn-danger" id="modal-btn-yes">From Home</button>}                                      
                    
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

        </section>
      </section>
    </>
  );
};

export default AttendenceScreen;
