import React, { useReducer, useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { GetEmployees , getReportToByID } from "../API/Employee";
import { GetThisYearLeaves, AddLeaveRequests, ResponseToLeaveRequests } from "../API/LeaveRequest";
import { SendEmail } from "../API/mailer"
import Sidenav from "../components/sidenav/Sidenav";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";


const formReducer = (state, event) => {
  if(event.reset) {
    return {
      leaveType: '',
      leaveFrom: '',
      leaveTO: '',
      startTime: '',
      endTime: '',
      leaveDays: 0,
      leaveRemainingDays: 0,
      leaveReason: ''
    }
  }
  return {
    ...state,
    ['leaveType']: event.leaveType,
    ['leaveFrom']: event.leaveFrom,
    ['leaveTO']: event.leaveTO,
    ['startTime']: event.startTime,
    ['endTime']: event.endTime,
    ['leaveDays']: event.leaveDays,
    ['leaveRemainingDays']: event.leaveRemainingDays,
    ['leaveReason']: event.leaveReason    
  }
 }
  
 
const LeavesApplication = () => {

  
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const [reportToPersons, setReportToPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("list");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());  
  const [formData, setFormData] = useReducer(formReducer, {});
  const [submitting, setSubmitting] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [noOfDays, setNoOfDays] = useState("");
  const [reason, setReason] = useState("");
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [requestID, setRequestID] = useState("");
  const [showTime, setShowTime] = useState(false)
  const [showDialog, setShowDialog] = useState(false);
  const [charCountMax, setCharCountMax] = useState(2000);
  const [charCount, setCharCount] = useState(2000);
  const [file1, setFile1] = useState({});
  const [file2, setFile2] = useState({});
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showImage, setShowImage] = useState("");
  const navigate = useNavigate();

  const month =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thrusday","Friday","Saturday"]

  let login_id = { id: localStorage.getItem('id') };
  let login_role = { role_slug: "super_admin" };
  let emp_id = { emp_id: localStorage.getItem('id') };
  let newdata = { ...login_role, ...login_id, ...emp_id };


  useEffect(async () => {
    try {      
      // call API for profile
      let emp = await GetEmployees(newdata)      
      setSelectedEmployee(emp.data)       
      
      // call API for report to info
      let reportto = []      
      if(emp.data.emp_report_to) {
        const ids = emp.data.emp_report_to.split(",")        
        for(let i=0; i<ids.length; i++) {
          let rep = await getReportToByID({id:ids[i]})
          reportto.push(rep.data)                    
        }        
      }
      setReportToPersons(reportto) 

      /*let extArr = ["jpg","jpeg","png"]
      let imgSplit = "https://www.africau.edu/images/default/sample.pdf".split(".")
      setFile1({name: "Test file one anothe rone is", type: extArr.includes(imgSplit[imgSplit.length - 1]) ? "image" : "pdf", path: "https://www.africau.edu/images/default/sample.pdf"})

      imgSplit = "https://img.freepik.com/premium-photo/abstract-texture-cubic-geometric-color-background_305419-1919.jpg".split(".")
      setFile2({name: "Test file one anothe rone is", type: extArr.includes(imgSplit[imgSplit.length - 1]) ? "image" : "pdf", path: "https://img.freepik.com/premium-photo/abstract-texture-cubic-geometric-color-background_305419-1919.jpg"})
      */
           
      // Loader Delay
      setTimeout(() => {
        setLoading(false)
      }, 250);

    } catch(e) {
      setSelectedEmployee([]);       
      setEmployeeLeaves([]);
      setReportToPersons([])          
      setLoading(false);
    }
  }, []);

  

  useEffect(async () => {
    try {            
      // call API for leaves
      let leaves = await GetThisYearLeaves(newdata)      
      for(let i=0; leaves.data.length; i++) {
        if(leaves.data[i].status === "Pending") {
          let d = leaves.data[i].request_to_day + "-" + leaves.data[i].request_to_month + "-" + leaves.data[i].request_to_year
          fromDate.setDate(leaves.data[i].request_from_day)
          fromDate.setMonth(leaves.data[i].request_from_month)
          fromDate.setFullYear(leaves.data[i].request_from_year)
          toDate.setDate(leaves.data[i].request_to_day)
          toDate.setMonth(leaves.data[i].request_to_month)
          toDate.setFullYear(leaves.data[i].request_to_year)
          setReason(leaves.data[i].request_reason)
          setNoOfDays(leaves.data[i].no_of_days)
          setStartTime(leaves.data[i].leaves_start_time)
          setEndTime(leaves.data[i].leaves_end_time)
          setLeaveType(leaves.data[i].leaves_type)
          setRequestID(leaves.data[i].request_id)
          setEmployeeLeaves(leaves.data[i]);
          setSubmitting(true)
        }
      }      
      setLoading(false);
    } catch {
      setEmployeeLeaves([]);      
    }
  }, []);


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

  
  const handleSubmit = async event => {
    event.preventDefault();    
    
    let isValid = !formData.leaveType ? false : true
    for(let item in formData) {
      if(item != "startTime" && item != "endTime" && item != "leaveRemainingDays" && item != "leaveReportTo" && item != "file1" && item != "file2") {
        if(!formData[item] || formData[item] == undefined || formData[item] == 0) isValid = false
      }            
    }
    if(formData.leaveType == "Short")  {
      if(!formData.startTime || !formData.endTime || formData.startTime ==  undefined || formData.endTime == undefined) isValid = false       
    } 
    
    if(!isValid) {
      setValidationMessage("Fill out all the required fields.")      
      setSubmitting(false)
    } else {
      if(fromDate > toDate){
        setValidationMessage("Date range selected is incorrect.")        
        setSubmitting(false)
      } else {
        newdata.request_from_day = fromDate.getDate()
        newdata.request_from_month = fromDate.getMonth() + 1
        newdata.request_from_year = fromDate.getFullYear()
        newdata.request_to_day = toDate.getDate()
        newdata.request_to_month = toDate.getMonth() + 1
        newdata.request_to_year = toDate.getFullYear()
        newdata.leaves_type = formData.leaveType
        newdata.no_of_days = formData.leaveDays
        newdata.request_reason = formData.leaveReason
        newdata.status = "Pending"
        newdata.leaves_start_time = formData.startTime == undefined ? "" : formData.startTime
        newdata.leaves_end_time = formData.endTime == undefined ? "" : formData.endTime
        newdata.file1 = formData.file1;
        newdata.file2 = formData.file2
                
        // Generate Attendance record for each leave day
        let fromMonth = fromDate.getMonth() + 1
        let toMonth = toDate.getMonth() + 1
        let fromYear = fromDate.getFullYear()
        let toYear = toDate.getFullYear()        
        let startDate = fromDate.getDate()
        let endDate = toDate.getDate()        
        if(fromDate.getMonth() + 1 !== toDate.getMonth() + 1) {
          endDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0).getDate() 
        }        
        let leavesRequestToAttendanceArray = new Array()
        let i = startDate
        for(i=startDate; i<=endDate; i++) {
          let data = {}
          data.in_day = i
          data.in_month = fromMonth
          data.in_year = fromYear
          leavesRequestToAttendanceArray.push(data)
          if(fromMonth !== toMonth && i === endDate) {
            startDate = 0
            i = startDate
            endDate = toDate.getDate()            
            fromMonth = toMonth       
            if(fromYear !== toYear) {
              fromYear = toYear
            } 
          }

          // Filter Leaves Attendance to remove Sat & Sun
          leavesRequestToAttendanceArray.map(record => {
            let d = new Date(record.in_year, record.in_month, record.in_day).getDay()
            if(d === 3 || d === 2) leavesRequestToAttendanceArray.pop(record)            
          })
        }
        // Correct number of leaves according to date
        newdata.no_of_days = leavesRequestToAttendanceArray.length
        formData.leaveDays = leavesRequestToAttendanceArray.length
        setNoOfDays(leavesRequestToAttendanceArray.length)

        // extract emails of report to persons
        let reportToEmails = []
        reportToPersons.map((person)=>{
          var em = person.emp_email
          reportToEmails.push(em.toLowerCase())
        })
        
        // Email parameters
        let maildata = {
          to_email: reportToEmails.toString(), 
          from_email: "no-reply@asterisksolutions.com", 
          from_name: "[HRMS] Asterisk Solutions", 
          subject_email: "[HRMS] " + leaveType + " Leave Request", 
          body_email: ""
        }

        let _to = toDate.toLocaleDateString('en-US',{year: 'numeric', month: '2-digit', day: '2-digit', })
        let _from = fromDate.toLocaleDateString('en-US',{year: 'numeric', month: '2-digit', day: '2-digit', })
                
        // Add leave request
        setValidationMessage("")
        let resp = await AddLeaveRequests(newdata)        
        
        if(resp.data.status == 200) {
          maildata.body_email = ("<div>Dear Admin, <br></br><br></br>" +
                                 "A user <b>" + selectedEmployee.first_name + " " + selectedEmployee.last_name + "</b> has applied for <b>#" + formData.leaveDays + "</b> of " + (formData.leaveDays > 1 ? "Leaves" : "Leave") + (_from == _to ? " for <b>" + _from + "</b> " : " from <b>" + _from + "</b> to <b>" + _to + "</b>") + ". " +  
                                 (startTime && endTime ? "This is a short leave for the time duration <b>" + startTime + "-" + endTime + "</b>" : "") + ".<br></br><br></br>" +
                                 "<div style='padding:15px; width:auto; border-radius:3px; background:#F5F5DC; color:#000;'>" +
                                 "<b>Leave Type</b>: " + leaveType + "<br></br>" +
                                 "<b>Reason</b>: <br></br>" +
                                 reason +
                                 "</div><br></br><br></br>" +
                                 "Please visit the HRMS portal to accept or reject leaves requests." +
                                 "<br></br><br></br>" +                                  
                                 "Thank you,<br></br>");  
          SendEmail(maildata).then((resp3)=>{
            // email sent success
          });
          setSubmitting(true)
        } else {
          setValidationMessage("Database Error in processing leaves request." )
        }
      }
      
    }    
  }

    

  // handle change dropdown leaves type
  const handleChange = event => {    
    let data = formData    
        
    switch(event.target.name) {
      case "leaveType": 
            data.leaveType = event.target.value; 
            event.target.value == "Short" ? setShowTime(true) : setShowTime(false); data.startTime = ""; data.endTime = "";  
            setLeaveType(event.target.value)
            break;
      case "leaveDays": data.leaveDays = event.target.value; setNoOfDays(event.target.value); break;
      case "leaveReason": 
            data.leaveReason = event.target.value; 
            var str = event.target.value;
            str = str.replace(/[`'"\(\)\{\}\[\]\\\/]/gi, '');            
            if(str.length >= charCountMax) {
              str = str.slice(0, charCountMax - 1)  
              setCharCount(0);
            } else {
              setCharCount(charCountMax - str.length);
            }
            setReason(str); 
            break;
      case "startTime": data.startTime = event.target.value; setStartTime(event.target.value); break;
      case "endTime": data.endTime = event.target.value; setEndTime(event.target.value); break;
      case "file1": 
           let f1_arr = event.target.value.split('\\'); 
           data.file1 = event.target.value;
           setFile1({name: f1_arr[f1_arr.length - 1]})
           break;
      case "file2": 
           let f2_arr = event.target.value.split('\\'); 
           data.file2 = event.target.value;
           setFile2({name: f2_arr[f2_arr.length - 1]})
           break;
    }    
    
    data.leaveTO = toDate.getDate() + "/" + toDate.getMonth() + "/" + toDate.getFullYear()
    data.leaveFrom = fromDate.getDate() + "/" + fromDate.getMonth() + "/" + fromDate.getFullYear()        
    data.leaveRemainingDays = selectedEmployee.leaves_remaining
    setFormData(data)
  }


  const handleDialog = e =>{
    setShowDialog(true)
  }

  // handle cancel leaves applied for
  const handleCancelLeavesRequest = async e => {         
      let data = {id: localStorage.getItem("id"), role_slug: localStorage.getItem("role_slug") , request_id: requestID, status: "Cancelled"}
      console.log(data)
      ResponseToLeaveRequests(data).then(r=>{
        setShowDialog(false)
        navigate('/', { replace: true })
      })  
  }

  // handle cancel
  const handleCancel = e => {
    setShowDialog(false)
    setShowImageDialog(false)
  }

  // handle image
  const handleImage = e => {
    setShowImageDialog(true)
    setShowImage(e.path)
  }
  


  
   
  return (
    <>
      <Sidenav />      
      <section class="col-12 col-lg-10 InnerContent">
        <div class=" modal-dialog w-100 mw-100 mx-0">
          <div class="modal-content">
            <div class="modal-body">
              <h3 class="my-4 bg-info py-2">Leaves Request</h3>
              <form onSubmit={handleSubmit}>
                
                { submitting &&
                  (<div class="row">
                    <div class="col-12">
                      <div className="alert alert-success application">
                        To, <br></br>
                        {reportToPersons.map(person=>(person.first_name + " " + person.last_name + ", "))} <br></br>
                        Asterisk Solutions Islamabad,<br></br>
                        Pakistan. <br></br>                                                
                        <p class="my-2"><b>Subject:</b> {leaveType} {noOfDays ==1 ? 'Leave' : 'Leaves'}</p>
                        <p class="my-2">Respected Sir/Madam,</p>

                        <p class="bg-light p-3">{reason}</p>
                        
                        <b>Date From:</b> {fromDate.toDateString()}
                        <br></br>                        
                        <b>Date To:</b> {toDate.toDateString()}
                        <br></br>
                        <b>Number of Days:</b> {noOfDays}
                        <br></br>
                        {startTime && <><b>Time Duration:</b> {startTime} - {endTime}<br></br></> }                        
                        <b>Status:</b> Request Pending

                        {(file1.path || file2.path) && <p class="attachment my-5">
                          {
                            (file1 && file1.path) &&
                            <>
                            {file1.type == "image" 
                              ?
                              <a href="#" onClick={()=>handleImage({path: file2.path})}><img width="60" src={file1.path}></img> <span>{file1.name}</span></a>
                              :
                              <a href={file1.path} target="_blank"><i class="fa fa-file-pdf"></i> <span>{file1.name}</span></a>}
                            </>
                          }
                          {
                            (file2 && file2.path) &&
                            <>
                            {file2.type == "image" 
                              ?
                              <a href="#" onClick={()=>handleImage({path: file2.path})}><img width="60" src={file2.path}></img> <span>{file2.name}</span></a>
                              :
                              <a href={file2.path} target="_blank"><i class="fa fa-file-pdf"></i> <span>{file2.name}</span></a>}
                            </>
                          }  
                        </p>}                                                
                        <p class="my-0 mt-3">Yours Sincerely,</p>
                        <p class="my-0"><b>{selectedEmployee.first_name + " " + selectedEmployee.last_name}</b>,</p>
                        <p class="my-0"><b>{selectedEmployee.desig_title}</b>,</p>
                        <p class="my-0">Asterisk Solutions Islamabad, Pakistan.</p>
                        
                      </div>
                      <div class="col-12 ">
                        <button class="sendButton bg-danger mt-3 px-4" type="button" onClick={handleDialog}>
                            Cancel Request
                        </button>
                      </div>
                    </div>
                  </div>)
                }

                { !submitting && 
                <div class="row">
                  <div class="col-lg-5 col-md-5 col-sm-6 col-12">
                    <label for="" class="form-label" required>
                      Leave Type *
                    </label>
                    <div class="row">
                      <div class="col-12 col-md-12">
                        <select
                          class="form-select mw-100"
                          aria-label=""
                          className="main"
                          name="leaveType"
                          onChange={handleChange}
                        >
                          <option selected class="main" value="">
                            Select Leave Type
                          </option>
                          <option value="Emergency">Emergency Leave</option>
                          <option value="Medical">Medical Leave</option>                      
                          <option value="Maternity">Maternity Leave</option>
                          <option value="Paternity">Paternity Leave</option>
                          <option value="Casual">Casual Leave</option>                      
                          <option value="Marriage(Self)">Marriage Leave(Self)</option>
                          <option value="Marriage(Family)">Marriage Leave(Family)</option>                      
                          <option value="Short">Short Leave</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div class="col-12 col-md-12">
                        <label for="" class="form-label mw-100" required>
                          Number of days *
                        </label>
                        <input
                          type="number"
                          min={0}
                          class="mw-100"
                          placeholder="0"
                          name="leaveDays"
                          value={noOfDays}
                          onChange={handleChange}
                        />
                      </div>
                      <div class="col-12 col-md-12">
                        <label for="" class="form-label" required>
                          Date From *
                        </label>
                        <div class="position-relative popupdate">                      
                          <DatePicker 
                            className="mw-100"
                            selected={fromDate} 
                            onChange={(date) => setFromDate(date) } 
                            minDate={/*new Date()*/''} 
                            name="leaveFrom"
                          />
                          <button type="button">
                            <img
                              src="../images/calendar2-date.png"
                              class="img-fluid"
                              alt=""
                            />
                          </button>                      
                        </div>  
                      </div>
                      <div class="col-12 col-md-12">
                        <label for="" class="form-label" required>
                          Date To *
                        </label>
                        <div class="position-relative popupdate">
                          <DatePicker 
                            className="mw-100"
                            selected={toDate} 
                            onChange={(date) => setToDate(date) } 
                            minDate={/*new Date()*/''} 
                            name="leaveTo"
                          />
                          <button type="button">
                            <img
                              src="../images/calendar2-date.png"
                              class="img-fluid"
                              alt=""
                            />
                          </button>
                        </div>                    
                      </div>
                      {showTime && <div class="col-12 col-md-12">
                        <label for="" class="form-label" required>
                        Start & End Time *
                        </label>
                        <div class="position-relative popupdate">
                          <input type="time" name="startTime" class="w-50" onChange={handleChange}></input>
                          <input type="time" name="endTime" class="w-50 " onChange={handleChange} ></input>
                        </div>                    
                      </div>}                            

                      <div class="col-12 col-md-12">
                        <label for="" class="form-label" required>
                          Upload files if applicable (JPG, PNG, PDF)
                        </label>
                        <div class="box">
                          <input type="file" name="file1" id="file1" class="inputfile" onChange={handleChange} data-multiple-caption="File selected" accept=".jpg, .png, .jpeg, .pdf" />
                          <label for="file1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg> 
                            {file1.name ?  <span title={file1.name}> {file1.name}</span> : <span>Choose a file…</span>}
                          </label>
                        </div>                       
                      </div>
                      <div class="col-12 col-md-12 file_box">
                        <div class="box">
                          <input type="file" name="file2" id="file2" class="inputfile" onChange={handleChange} data-multiple-caption="File selected" accept=".jpg, .png, .jpeg, .pdf" />
                          <label for="file2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg> 
                            {file2.name ?  <span title={file2.name}> {file2.name}</span> : <span>Choose a file…</span>}
                          </label>
                        </div>                       
                      </div>                  
                      
                    </div>
                  </div>
                  <div class="col-lg-7 col-md-7 col-sm-6 col-12">                    
                    <label for="" class="form-label" required>
                      Leave Reason *
                    </label>
                    <textarea
                      class="form-control mw-100"
                      placeholder="Reason: e.g. Appointment to Doctor"
                      rows="8"
                      col="10"
                      name="leaveReason"
                      onChange={handleChange}
                      value={reason}
                    ></textarea>              
                    <div class="co-12">
                      <div class="charCount mt-3"><i class="fa fa-keyboard"></i> Maximum number of characters allowed: <span><b>{charCount}</b></span></div>
                    </div>
                    <div class="co-12">
                      <div class="leavesDetail mt-3"><i class="fa fa-arrow-down"></i> Remaining Leaves: <span>{selectedEmployee.leaves_remaining}</span></div>
                      <div class="leavesDetail mt-3"><i class="fa fa-users"></i> Reporting To: <span>{reportToPersons.map(person=>(person.first_name + " " + person.last_name + ", "))}</span></div>
                    </div>
                    <div class="col-12">
                      <button class="sendButton mt-3 px-3" type="submit" >
                          Apply Leaves
                      </button>
                    </div>
                    <div className="justify-content-center d-flex mt-3 w-100">{validationMessage && (<div className="alert alert-danger w-100">{validationMessage}</div>)}</div>
                    
                  </div>
                  
                  <div class="col-12 d-none">
                    <button className="close closeButton" >
                      <img src="../images/plus-circle-fill.png" alt="" />
                    </button>
                  </div>
                </div>
                }
              </form>
            </div>
          </div>
        </div>   

        {showDialog && <>
            <div class="modal fade in d-block confirmModal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="false" id="mi-modal">
              <div class="modal-dialog ">
                <div class="modal-content">
                  <div class="modal-header">
                    <button onClick={handleCancel} type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel"> Cancel Leaves Request </h4>
                  </div>
                  <div class="modal-body">
                    <p>Are you sure want to cancel leaves request you have applied for?</p>
                  </div>
                  <div class="modal-footer">
                    <button onClick={handleCancel} type="button" class="btn btn-default" id="modal-btn-cancel">No</button>
                    <button onClick={handleCancelLeavesRequest} type="button" class="btn btn-danger" id="modal-btn-yes">Yes, Cancel</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="alert" role="alert" id="result"></div>
          </>}  


          {showImageDialog && <>
            <div class="modal fade in d-block confirmModal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="false" id="mi-modal">
              <div class="modal-dialog w-75 mw-100">
                <div class="modal-content">
                  <div class="modal-header">
                    <button onClick={handleCancel} type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  </div>
                  <div class="modal-body">
                    {showImage && <img class="img-fluid" src={showImage}></img>}
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

export default LeavesApplication;
