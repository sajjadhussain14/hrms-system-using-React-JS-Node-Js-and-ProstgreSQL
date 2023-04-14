import Sidenav from "../components/sidenav/Sidenav";
import apiURL from '../config'
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams} from "react-router-dom";
import { GetLeaveRequests, GetApprovedLeaveRequest } from "../API/LeaveRequest";
import { GetMonthlyAttendance, PunchIn, GetAttendanceById, GetAttendanceByEmpId, GetTodayAttendance } from "../API/Attendance";
import {GetEmployees4Count, GetEmployees} from "../API/Employee"
import EmployeeLeavesBoard from "../components/employees/EmployeeLeavesBoard"
import { GetSetting } from "../API/Settings";
import { SendEmail } from '../API/mailer';

import CanvasJSReact from "../graph/canvasjs.react";



const client = axios.create({
  baseURL: apiURL
}); 
const GetTest = async () => { 
  const respData = await client.get("/");
    console.log(respData)          
    return respData
}


const Home = () => {

  const [loading, setLoading] = useState(true);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);  
  const [approvedLeavesCount, setApprovedLeavesCount] = useState(0);
  const [roleSlug, setRoleSlug] = useState(localStorage.getItem("role_slug"));
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [selectedAttendance, setSelectedAttendance] = useState({});
  const [isPresent, setIsPresent] = React.useState(false);
  const [isOnLeave, setIsOnLeave] = React.useState(false);
  const [punchedInTime, setpunchedInTime] = useState("")
  const [doneSuccess, setDoneSuccess] = useState(false);
  const [doneFail, setDoneFail] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState("");  
  const [messageCancelYes, setMessageCancelYes] = useState("");  
  const [showDialog, setShowDialog] = useState(false);
  const [clickTypeDialog, setClickTypeDialog] = useState("");
  const [punchStatus, SetpunchStatus] = useState("");  
  const [reason, setreason] = useState("");
  const navigate = useNavigate();
  const { id, attendance_id } = useParams();
  const month =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thrusday","Friday","Saturday"]


 
  let CanvasJS = CanvasJSReact.CanvasJS;
  let CanvasJSChart = CanvasJSReact.CanvasJSChart;
 
  
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
  if(attendance_id && attendance_id!=undefined) {   
    renderDateSheet = (<span>{selectedAttendance.in_day + " " + month[selectedAttendance.in_month-1] + " " + selectedAttendance.in_year + ", " + selectedAttendance.in_time}  </span>)
  } else {
    renderDateSheet = (<span>{date.getDate() + " " + month[date.getMonth()] + " " + date.getFullYear()} </span>)
  }
  


  
  useEffect(() => {
    try {
  
      if(!localStorage.getItem("role_slug") || localStorage.getItem("role_slug") == "") {        
        navigate('/login', { replace: true })        
        return;
      }

      // call APIs
      apiCalls();
      
      // Loader Delay
      setTimeout(() => {
        setLoading(false);
      }, 250);

    } catch(e) {
      setApprovedLeavesCount(0)
      setPresentCount(0)
      setAbsentCount(0);  
      setSelectedEmployee([]) 
      setSelectedAttendance([])      
      setLoading(false);    
    }
  }, []);
  
 

  const apiCalls = async (e)=>{    
    // API Call for profile
    GetEmployees(newdata).then(r=>setSelectedEmployee(r.data.length ? r.data.length : 0))
    
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
    //GetAttendanceByEmpId(newdata).then(r=>setEmployeeAttendance(r.data))
    
    // API Call for selected attendance
    if(attendance_id != undefined){
      newdata = {...newdata, attendance_id: attendance_id}
      GetAttendanceById(newdata).then(r=>setSelectedAttendance(r.data))            
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

    /**** Graph Data ****/
    // Total Emp
    GetEmployees4Count(newdata).then(r=>setTotalCount(r.data.length));
    
    // set Date
    let gd = new Date()
    let gdate = {year: gd.getFullYear(), month: gd.getMonth()+1, date: gd.getDate(), status:'Present'}
    newdata = {...newdata, ...gdate}
        
    // Today Aproved Leaves & Present count
    GetTodayAttendance(newdata).then(r=>{
      let leave_count = 0
      let present_count = 0
      r.data.map((data)=>{
        if(data.emp_status == "Leave"){
          leave_count++
        } else if(data.emp_status == "Present" || data.emp_status == "Work from home"){
          present_count++
        }
      })
      setApprovedLeavesCount(leave_count); 
      setPresentCount(present_count);
      // absent count
      const absent = totalCount - present_count - leave_count
      setAbsentCount(absent);
    })
    /**** Graph Data ****/

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

  

  const handleChangeDropdown = async (event)=> {

    // API call Total Emp
    let emp = await GetEmployees4Count(newdata);
    setTotalCount(emp.data.length);

    // set Date
    let d = new Date()
    let noOfDays = new Date(d.getFullYear(), event.target.value, 0).getDate()
    let date = {year: d.getFullYear(), month: event.target.value, date: d.getDate(), status:'Present'}
    if(event.target.value == 22) { // today
      date = {year: d.getFullYear(), month: d.getMonth()+1, date: d.getDate(), status:'Present'}
    } else if(event.target.value == 33) { // yesterday      
      if(d.getDate() == 1 && d.getMonth() == 0) {
        noOfDays = new Date(d.getFullYear()-1, 12, 0).getDate()
        date = {year: d.getFullYear()-1, month: 12, date: noOfDays, status:'Present'}
      } else if(d.getDate() > 1 && d.getMonth() > 0) {
        date = {year: d.getFullYear(), month: d.getMonth()+1, date: d.getDate()-1, status:'Present'}
      }
    } 

    newdata = {...newdata, ...date}
    
    if(event.target.value == 22 || event.target.value == 33) {

      // API call Today's Attendance
      let attendance = await GetTodayAttendance(newdata);
    
      // Today Aproved Leaves & Present count
      let leave_count = 0
      let present_count = 0
      attendance.data.map((data)=>{      
        if(data.emp_status == "Leave"){
          leave_count++
        } else if(data.emp_status == "Present"){
          present_count++
        }
      })
      setApprovedLeavesCount(leave_count); 
      setPresentCount(present_count);

      const absent = emp.data.length - present_count - leave_count
      setAbsentCount(absent);
    
    } else {
      let countDays = 0
      let percentage = 0
      let numOfDays = new Date(new Date().getFullYear(), event.target.value, 0).getDate()
      for(var dd=1; dd<=numOfDays; dd++) {
        var dt = new Date(new Date().getFullYear() + "-" + event.target.value + "-" + dd)
        let presentNums = 0
        let offDays = 0
        let totalNums = emp.data.length
        if(dt.getDay() != 0 || dt.getDay() != 6) {
          newdata.year = dt.getFullYear()
          newdata.month = event.target.value
          newdata.date = dd
          var att = await GetTodayAttendance(newdata)          
          att.data.map((data)=>{      
            if(data.emp_status == "Leave" || data.emp_status == "Present"){
              presentNums++
            }
          })
          countDays++
        } else {
          offDays++
        }        
        percentage = (presentNums/(totalNums-offDays)*100).toFixed(0)
      }      
      percentage = (percentage/countDays*100).toFixed(0)
      //setPresentCount(percentage)
      //setAbsentCount(countDays-percentage)
      
    }
   
  }


  // Chart options
  const optionsAttendance = {
    animationEnabled: true,
    exportEnabled: true,
    theme: "light1", // "light1", "dark1", "dark2"
    title: {
      text: "Attendance Overview",      
    },
    legend: {
			maxWidth: 350,
			itemWidth: 120
		},
    height:300,
    data: [
      {
        type: "pie",
        startAngle: -90,
        showInLegend: true,
			  indexLabel: "{label}: {y}%",
        legendText: "{label} ({x})",
        dataPoints: [          
          { y: (presentCount/totalCount*100).toFixed(1), x: presentCount, label: "Present", color:"green"},           
          { y: (absentCount/totalCount*100).toFixed(1), x: absentCount, label: "Absent", color:"red"},
        ],
      },
    ],
  };

  const optionsLeaves = {
    animationEnabled: true,
    exportEnabled: true,
    theme: "light1", // "light1", "dark1", "dark2"
    title: {
      text: "Leaves Overview",      
    },
    legend: {
			maxWidth: 350,
			itemWidth: 120
		},
    height:300,
    data: [
      {
        type: "pie",
        startAngle: -90,
        showInLegend: true,
        indexLabel: "{label}: {y}%",
        legendText: "{label} ({x})",
        dataPoints: [                    
          { y: ((totalCount-approvedLeavesCount)/totalCount*100).toFixed(1), x: (totalCount-approvedLeavesCount), label: "Total", color:"green"},           
          { y: (approvedLeavesCount/totalCount*100).toFixed(1), x: approvedLeavesCount, label: "Leaves", color:"blue"},
        ],
      },
    ],
  };
  
  const fullmonth = ["January","February","March","April","May","June","July","August","September","October","November","December"]
  


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

  // Handle reason
  const handleChangeReason = (e) => {
    var str = e.target.value;
    str = str.replace(/[`'"\(\)\{\}\[\]\\\/]/gi, '')
    setreason(str);     
  };
  

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
    
    // Punch In Attendance
    let resp = await PunchIn(newdata)          
    SetpunchStatus(resp.data.status)
    setpunchedInTime(resp.data.time)


    // call API for attendance
    //let attendance = await GetAttendanceByEmpId(newdata)      
    //setEmployeeAttendance(attendance.data)
    
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
    newdata = {...newdata, ...allow_punch, ...date, status:'Work from home'}
    
    // Punch In Attendance
    let resp = await PunchIn(newdata)          
    SetpunchStatus(resp.data.status)
    setpunchedInTime(resp.data.time)

    // send email
    if(resp.data.status && resp.data.status != undefined) {
      handleEmail();
    }

    // call API for attendance
    //let attendance = await GetAttendanceByEmpId(newdata)      
    //setEmployeeAttendance(attendance.data)
    
    setShowDialog(false)
    setConfirm(false) 
  }


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
      <section class="col-lg-10 InnerContent p-0 pt-3">
        {
        
        (roleSlug == "super_admin" || roleSlug == "administrator")
        
        ?
        
        <>
          <EmployeeLeavesBoard role_slug={roleSlug} />
          <div class="container-fluid">

            
            
            {/*<div class="row">            
              <div class="form-group col-12 col-md-4 pb-2 mt-0 ">
                <label for="role">Change option to view graph:</label>
                <select name="role" class="form-control" onChange={handleChangeDropdown}>
                  <option value="" >Choose Option</option>
                  <option value="22" selected>Today</option>
                  <option value="33" >Yesterday</option>
                  <option value="" disabled>-----------------</option>
                  {fullmonth.map((m, i)=>(
                    <option value={i+1} >{m}</option>
                  ))}
                </select>
              </div>
                  </div>*/}

            {/*<div class="row ">
              <div class="col-12 col-md-6 mb-3">
                <div id="canvas-container">          
                  <CanvasJSChart
                    options={optionsAttendance}
                    // onRef={ref => this.chart = ref} 
                  />
                  {
                  //You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods
                  }
                </div>
              </div>
              <div class="col-12 col-md-6 mb-3">
                <div id="canvas-container">          
                  <CanvasJSChart
                    options={optionsLeaves}
                    // onRef={ref => this.chart = ref} 
                  />
                  {
                    //You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods
                  }
                </div>
              </div>
                </div>*/}
          </div>
        </>

        :
        
        <>
          <EmployeeLeavesBoard role_slug={roleSlug} emp_id={login_id.id} />
          <article class="AttendancePunchIn">
            <div class="container">
              <div class="row">
              
                {!attendance_id && !id && <>
                  <div class="col-12 col-md-6">
                    <div class="timesheet mb-4">
                      <p>
                        <strong>Timesheet</strong> { renderDateSheet}                    
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
                
              </div>
            </div>
          </article>
        </>

        }

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

      </section>
    </>
  );
  
};



export default Home;
