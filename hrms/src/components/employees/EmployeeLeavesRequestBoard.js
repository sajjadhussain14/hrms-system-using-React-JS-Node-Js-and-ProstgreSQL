
import React, { useEffect, useState } from "react";
import { GetEmployees , getReportToByID } from "../../API/Employee";
import { GetLeaveRequests, GetThisYearLeaves, ResponseToLeaveRequests } from "../../API/LeaveRequest";
import { AddAttendanceArray } from "../../API/Attendance";
import { useParams, Link } from "react-router-dom";
import { useNavigate} from "react-router-dom";
import { SendEmail } from '../../API/mailer';

const EmployeeLeavesRequestBoard = (props) => {

  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const [reportToPersons, setReportToPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingLeaves, setPendingLeaves] = useState(false);
  const [leaveRequest, setLeaveRequest] = useState({});
  const [pendingLeavesCount, setPendingLeavesCount] = useState(0);  
  const [roleSlug, setRoleSlug] = useState(localStorage.getItem("role_slug"));
  const [doneSuccess, setDoneSuccess] = useState(false);
  const [doneFail, setDoneFail] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState("");  
  const [messageCancelYes, setMessageCancelYes] = useState("");  
  const [showDialog, setShowDialog] = useState(false);
  const [clickTypeDialog, setClickTypeDialog] = useState("");  
  const navigate = useNavigate();


  let login_id = { id: props.id };
  let login_role = { role_slug: props.role_slug };
  let emp_id = { emp_id: props.id };
  let approved_by = { approved_by: localStorage.getItem("id") };
  let newdata = { ...login_role, ...login_id, ...emp_id, ...approved_by };
  let imageURL = localStorage.getItem("homeURL") + "/images/";
  let roleArray = ["super_admin","administrator", "manager", "team_lead"]


  // Email parameters
  let maildata = {
    to_email: selectedEmployee.emp_email, 
    from_email: "no-reply@asterisksolutions.com", 
    from_name: "[HRMS] Asterisk Solutions", 
    subject_email: "", 
    body_email: ""
  }



  useEffect(async () => {
    try {
      // get employee leaves
      let leaves = await GetThisYearLeaves(newdata);
      setEmployeeLeaves(leaves.data);
      
      // get leave request
      for(let i=0; i<leaves.data.length; i++) {
        if(leaves.data[i].status == "Pending") {
          setLeaveRequest(leaves.data[i])         
        }
      }
      
      // get employee profile
      let emp = await GetEmployees(newdata)      
      setSelectedEmployee(emp.data);       
      
      // Get report to persons
      let reportto = []
      if(emp.data.report_to != "") {
        
        const ids = emp.data.report_to.split(",")
        for(let i=0; i<ids.length; i++) {
          let rep = await getReportToByID({id:ids[i]})
          reportto.push(rep.data)          
        }        
      }                     
      setReportToPersons(reportto) 
      

    } catch {
      setSelectedEmployee([]);       
      setEmployeeLeaves([]);
      setReportToPersons([])          
    }
  }, []);


 

  //////////////////// *** Leaves Accept/Decline Section



  // Handle dialog
  const handleDialog = async (event) => {
    // set values
    setMessage({title: event.type + " Leaves?", mesg:"Are you sure you want to \"" + event.type + "\" leaves request?"})
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

  // Handle approve
  const handleSubmitApprove = async event => {    
      const request_id = {request_id: leaveRequest.request_id}
      const status = {status: "Approved"}
      const no_of_days = {no_of_days: leaveRequest.no_of_days}
      newdata.emp_id = selectedEmployee.emp_id
      newdata = {...newdata , ...request_id, ...status, ...no_of_days}

      // Generate Attendance record for each leave day
      let f = new Date(leaveRequest.request_from_year, leaveRequest.request_from_month-1, leaveRequest.request_from_day)
      let t = new Date(leaveRequest.request_to_year, leaveRequest.request_to_month-1, leaveRequest.request_to_day)
      let fromMonth = f.getMonth() 
      let toMonth = t.getMonth() 
      let fromYear = f.getFullYear()
      let toYear = t.getFullYear()        
      let startDate = f.getDate()
      let endDate = t.getDate()        
      if(f.getMonth() !== t.getMonth()) {
        endDate = new Date(f.getFullYear(), t.getMonth(), 0).getDate() 
      }        
        
      let leavesRequestToAttendanceArray = new Array()        
      if(leaveRequest.leaves_type == "Short") {
        let data = {}
        data.in_day = leaveRequest.request_from_day
        data.in_month = leaveRequest.request_from_month
        data.in_year = leaveRequest.request_from_year
        data.emp_status = 'Short Leave'
        leavesRequestToAttendanceArray.push(data)        
      } else {

        let i = startDate
        for(i=startDate; i<=endDate; i++) {
          let d = new Date(fromYear, fromMonth, i).getDay()        
          if(d !== 0 && d !== 6) {
              let data = {}
              data.in_day = i
              data.in_month = fromMonth + 1
              data.in_year = fromYear
              data.emp_status = 'Leave'
              leavesRequestToAttendanceArray.push(data)
          }
          if(fromMonth !== toMonth && i === endDate) {
            startDate = 0
            i = startDate
            endDate = t.getDate()            
            fromMonth = toMonth       
            if(fromYear !== toYear) {
              fromYear = toYear
            } 
          }
        }
      }   
      
      // API Call Accept Leave Request
      let resp = await ResponseToLeaveRequests(newdata)
      
      if(resp.data.status == 200) {
        setShowDialog(false)
        // API Call Add Attendance for Leaves
        newdata.id = props.id
        newdata = {...newdata, leavesAttendanceRecs: leavesRequestToAttendanceArray}
        let resp = await AddAttendanceArray(newdata)
                
        if(resp.data.status == 200) {       
          setDoneSuccess(true)
          setMessageCancelYes("Leaves approved successfully.")
                    
          maildata.subject_email = "[HRMS] Leaves Request Approved";
          maildata.body_email = ("<div>Dear " + selectedEmployee.first_name + " " + selectedEmployee.last_name + ", <br></br><br></br>" +
                                "Your leaves request of <b>#" + (leaveRequest.no_of_days == 1 ? leaveRequest.no_of_days + "</b> of day" : leaveRequest.no_of_days + "</b> of days") + (f.toLocaleDateString() == t.toLocaleDateString() ? " for <b>" + f.toLocaleDateString() + "</b>" : " from <b>" + f.toLocaleDateString() + "</b> to <b>" + t.toLocaleDateString() + "</b>.") + (leaveRequest.leaves_start_time ? " (Time Duration <b>" + leaveRequest.leaves_start_time + " - " + leaveRequest.leaves_end_time + ")": "") + "</b> has been approved and can avail it.<br></br>" + 
                                "Visit HRMS portal for more details.<br></br><br></br>" +
                                "Thank you,<br></br>Admin Asterisk Solutions");
          SendEmail(maildata).then((resp3)=>{
            // email sent success
          });                                      

        } else {
          setDoneFail(true)
          setMessageCancelYes("Leaves couldn't approve.")
        }
        
        setTimeout(() => {
          setDoneSuccess(false)
          setDoneFail(false)
          setMessageCancelYes("")
          navigate(props.navigateTo, { replace: true }) 
        }, 2000);
        
      }
  }

  const handleSubmitDecline = async event => {
      setShowDialog(false)
      // start/end date
      let f = new Date(leaveRequest.request_from_year, leaveRequest.request_from_month-1, leaveRequest.request_from_day)
      let t = new Date(leaveRequest.request_to_year, leaveRequest.request_to_month-1, leaveRequest.request_to_day)

      const request_id = {request_id: leaveRequest.request_id}
      const status = {status: "Declined"}
      newdata = {...newdata , ...request_id, ...status}
      let resp = await ResponseToLeaveRequests(newdata)
      if(resp.data.status === 200) {
        setDoneSuccess(true)
        setMessageCancelYes("Leaves declined successfully.")

        maildata.subject_email = "[HRMS] Leaves Request Declined";
        maildata.from_name = "[HRMS] Asterisk Solutions";
        maildata.body_email = ("<div>Dear " + selectedEmployee.first_name + " " + selectedEmployee.last_name + ", <br></br><br></br>" +
                                "Sorry, your leaves request of <b>#" + (leaveRequest.no_of_days == 1 ? leaveRequest.no_of_days + "</b> of day" : leaveRequest.no_of_days + "</b> of days") + (f.toLocaleDateString() == t.toLocaleDateString() ? " for <b>" + f.toLocaleDateString() + "</b>" : " from <b>" + f.toLocaleDateString() + "</b> to <b>" + t.toLocaleDateString() + "</b>.") + (leaveRequest.leaves_start_time ? " (Time Duration " + leaveRequest.leaves_start_time + "-" + leaveRequest.leaves_end_time + ")": "") + " has not been approved.<br></br>" +                  
                                "Visit HRMS portal for more details.<br></br><br></br>" +
                                "Thank you,<br></br>Admin Asterisk Solutions");
        SendEmail(maildata).then((resp3)=>{
          // email sent success
        });
        
      } else {
        setDoneFail(true)
        setMessageCancelYes("Leaves couldn't decline.")
      }
      
      setTimeout(() => {
        setDoneSuccess(false)
        setDoneFail(false)
        setMessageCancelYes("")
        navigate(props.navigateTo, { replace: true })
      }, 2000);
      
  }
 


  let profile_pic = ""
  if(selectedEmployee.emp_pic) {
    profile_pic = selectedEmployee.emp_pic.replace("-l","-s")
  } else {
    profile_pic = selectedEmployee.gender + ".png"
  }



  return (    
    
    (leaveRequest && leaveRequest.status == "Pending" && roleArray.includes(roleSlug))  
    ?     
    <>
      <article id="employeeLeaveForm" class="employeeLeaveForm">
        <div class="container p-0">
          <div class="row">
            <div class="col-12 d-flex justify-content-between contentHolder">
              <div class="info d-flex align-items-center">
                <img src={imageURL + "Ellipse 59.png"} class="img-fluid" alt="" />
                <img src={imageURL +  profile_pic} alt="" />
                <p>
                  <span class="name d-block">{selectedEmployee.first_name + " " + selectedEmployee.last_name}</span>
                  <span class="designation">{selectedEmployee.desig_title}</span>
                </p>
              </div>
              <div class="leaveApprovalLink">                  
                <button onClick={()=>handleDialog({type:"Approve"})} type="submit">
                  <img src={imageURL + "Group 152.png"} alt="" /> Approve
                </button>
                <button onClick={()=>handleDialog({type:"Decline"})} type="submit ">
                  <img src={imageURL + "Group 153.png"} alt="" /> Decline
                </button>                  
              </div>                
            </div>
          </div>
        </div>
      </article>
      
      <article class="leavesnumber mx-auto">
          <div class="container">
            <div class="row">
              <div class="col-lg-2 col-md-4 col-sm-6 col-6 my-3 mx-auto p-0">
                <div class="Aleave">
                  <i class="fa fa-pen"></i>
                  <strong>Leave Type </strong>
                  <span class="leavesCategory">{leaveRequest.leaves_type}</span>
                </div>
              </div>
              <div class="col-lg-2 col-md-4 col-sm-6 col-6 my-3 mx-auto p-0">
                <div class="Aleave">
                  <i class="fa fa-calendar-check"></i>
                  <strong>Date From</strong>
                  <span class="leavesCategory">{leaveRequest.request_from_day + "/" + leaveRequest.request_from_month + "/" + leaveRequest.request_from_year}</span>
                </div>
              </div>
              <div class="col-lg-2 col-md-4 col-sm-6 col-6 my-3 mx-auto p-0">
                <div class="Aleave">
                  <i class="fa fa-calendar-check"></i>
                  <strong>Date To</strong>
                  <span class="leavesCategory">{leaveRequest.request_to_day + "/" + leaveRequest.request_to_month + "/" + leaveRequest.request_to_year}</span>
                </div>
              </div>
              <div class="col-lg-2 col-md-4 col-sm-6 col-6 my-3 mx-auto p-0">
                <div class="Aleave">
                  <i class="fa fa-calendar-plus"></i>
                  <strong>Number of days</strong>
                  <span class="leavesCategory">{leaveRequest.no_of_days}</span>
                </div>
              </div>
              <div class="col-lg-2 col-md-4 col-sm-6 col-6 my-3 mx-auto p-0">
                <div class="Aleave">
                  <i class="fa fa-calendar-minus"></i>
                  <strong>Remaining Leave</strong>
                  <span class="leavesCategory">{selectedEmployee.leaves_remaining}</span>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article id="Reporting">
          <div class="container">
            <div class="row">
              <div class="col-lg-5 col-md-6 col-sm-12 col-12 reportto mt-4">
                <h3>REPORTING TO</h3>
                <div class="reportingManager">                  
                  {reportToPersons.map(person=>(  
                    <div class="d-flex profileInfo">
                      <div class="flex-shrink-0">
                        <img
                          src={person.emp_pic != null ? imageURL + person.emp_pic.replace("-l","-s") : imageURL + person.gender.toLowerCase() + ".png"}
                          class="img-fluid"
                          alt="..."
                        />
                      </div>
                      <div class="flex-grow-1 ms-3">
                        <h3 class="mt-0">{person.first_name + " " + person.last_name}</h3>
                        <p>{person.desig_title}</p>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
              <div class="col-lg-7 col-md-6 col-sm-12 col-12 reportto mt-4">
                <h3>LEAVE REASON</h3>
                <div class="leaveApplication">
                  <strong>Dear Sir,</strong>
                  <p>
                   {leaveRequest.request_reason}
                  </p>
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
                  {(!confirm && clickTypeDialog == "Approve") && <button onClick={handleConfirm} type="button" class="btn btn-danger" id="modal-btn-yes">Yes</button>}
                  {(!confirm && clickTypeDialog == "Decline") && <button onClick={handleConfirm} type="button" class="btn btn-danger" id="modal-btn-yes">Yes</button>}
                  
                  {(confirm && clickTypeDialog == "Approve") && <button onClick={handleSubmitApprove} type="button" class="btn btn-danger" id="modal-btn-yes">Approve Leaves</button>}
                  {(confirm && clickTypeDialog == "Decline") && <button onClick={handleSubmitDecline} type="button" class="btn btn-danger" id="modal-btn-yes">Decline Leaves</button>}                  
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


    </>

    :
    
    <></>

  );
};

export default EmployeeLeavesRequestBoard;
