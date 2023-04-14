import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Sidenav from "../components/sidenav/Sidenav";
import EmployeeLeavesBoard from "../components/employees/EmployeeLeavesBoard";
import { GetLeaveRequests, GetThisYearLeaves, ResponseToLeaveRequests } from "../API/LeaveRequest";
import { GetEmployees, getReportToByID, GetEmployeeReportTo } from "../API/Employee";

const LeavesIndividualDetails = () => {

  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const [employeeLeavesPending, setEmployeeLeavesPending] = useState([]);
  const [employeeLeavesDeclined, setEmployeeLeavesDeclined] = useState([]);
  const [reportToPersons, setReportToPersons] = useState([]);  
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [roleSlug, setRoleSlug] = useState(localStorage.getItem('role_slug'));
  const [approvedByName, setapprovedByName] = useState("")
  const [reportTo, setReportTo] = useState("");
  const [thisMonth, setthisMonth] = useState(new Date().getMonth() + 1);
  const [thisYear, setthisYear] = useState(new Date().getFullYear());
  const [thisDate, setthisDate] = useState(new Date().getDate());  
  const [showDialog, setShowDialog] = useState(false);
  const [leavesData, setLeavesData] = useState(false);
  const navigate = useNavigate();
  const month =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  let login_id = { id: localStorage.getItem('id') };
  let login_role = { role_slug: "super_admin" };
  let emp_id = { emp_id: id };
  let newdata = { ...login_role, ...login_id, ...emp_id };
  let roleArray = ["super_admin", "administrator", "team_lead"]




  useEffect(() => {
    try {
     
      // API Calls
      apiCalls();
      
      // Loader Delay
      setTimeout(() => {
        setLoading(false);
      }, 250);

    } catch {
      setSelectedEmployee([]);       
      setEmployeeLeaves([]);      
      setReportToPersons([]);
      setLoading(false);
    }
  }, []);


  const apiCalls = async (e) => {
     
    // set date
    let date = {year: thisYear, month: thisMonth, date: thisDate, status:'Approved'}
    newdata = {...newdata, ...date}

    // Approved Leaves
    GetLeaveRequests(newdata).then(r=>setEmployeeLeaves(r.data));
    
    // Declined Leaves
    newdata.status = 'Declined'
    GetLeaveRequests(newdata).then(r=>setEmployeeLeavesDeclined(r.data));

    // Declined Leaves
    newdata.status = 'Pending'
    GetLeaveRequests(newdata).then(r=>setEmployeeLeavesPending(r.data));    
      
    // get employee profile
    GetEmployees(newdata).then(r=>{      
      // get report to personas
      var rep_to = r.data.emp_report_to;
      employeeLeaves.map(item =>{rep_to = !rep_to.includes(item.approved_by) ? rep_to + "," + item.approved_by : rep_to })
      newdata = {...newdata, ids: rep_to}
      GetEmployeeReportTo(newdata).then((r2)=>{
        let opt = []
        r2.data.map((d)=>{
          let it = {value: d.emp_id, label: d.first_name + " " + d.last_name}
          if(d.emp_id) opt.push(it)
        });
        setReportToPersons(opt)        
      });      
      setSelectedEmployee(r.data)
    });                  
                
    
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


    // Handle cancel
    const handleCancel = () => {
      setShowDialog(false)      
    }

    // Handle show dialog
    const handleShowDialog = async (e) => {
      let data = {}
      data.numOfDays = e.no_of_days
      data.fromDate = new Date(e.request_from_year + "-" + e.request_from_month + "-" + e.request_from_day)
      data.toDate = new Date(e.request_to_year + "-" + e.request_to_month + "-" + e.request_to_day)
      data.startTime = e.leaves_start_time
      data.endTime = e.leaves_end_time
      data.reason = e.request_reason
      data.leaveType = e.leaves_type
      data.status = e.status
      // approved by name
      let rep = await getReportToByID({id: e.approved_by})
      data.approved_by = rep.data.first_name + " " + rep.data.last_name
      // report to name
      let repto = ""      
      if(selectedEmployee.emp_report_to) {
        const ids = selectedEmployee.emp_report_to.split(",")        
        for(let i=0; i<ids.length; i++) {
          let rep = await getReportToByID({id:ids[i]})
          if(i == 0)  repto = rep.data.first_name + " " + rep.data.last_name
          else  repto = "," + rep.data.first_name + " " + rep.data.last_name                    
        }        
      }
      data.reportTo = repto

      setLeavesData(data)
      setShowDialog(true)      
    }

  return (
    <>
      <Sidenav />
      <div class="col-lg-10 InnerContent">
        <article id="employeeProfile" class="employeeLeaveDetailProfile mb-3">
          <div class="container p-0">
            <div class="row">
              <div class="col-12 d-flex align-items-center h-100 info justify-content-between">
                
                <p>
                <img src="./images/Ellipse 59.png" class="img-fluid" alt="" />
                  <span class="name d-block">{selectedEmployee.first_name} {selectedEmployee.last_name}</span>
                  <span class="designation">{selectedEmployee.desig_title}</span>
                </p>
                {
                  (roleSlug == "super_admin" || roleSlug == "team_lead" || roleSlug == "manager") &&
                  <Link type="button" class="btn btn-primary employee mb-2 " to={'/leaves-record'}>
                    <i class="fas fa-chevron-left"></i> Go Back
                  </Link>
                }
              </div>
            </div>
          </div>
        </article>

        <EmployeeLeavesBoard emp_id={id} role_slug="member" />

        <article id="filter">
          {/*<div class="container">
            <div class="row">
              <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-2">
                <select class="form-select" aria-label="Default select example">
                  <option selected>Select Department</option>
                  <option value="1">Development</option>
                  <option value="2">Integration</option>
                  <option value="3">Designing</option>
                </select>
              </div>
              <div class="offset-lg-3 col-lg-3 col-md-4 col-sm-6 col-6 mb-2 position-relative">
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
              </div>
            </div>
  </div>*/}
        </article>

        <section id="EmployeeLeaveDetails" class="employeeLeaveTable">
          <div class="container">
            <div class="row">
              
              <div class="col-12 mt-4 table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col"># of Days</th>
                      <th scope="col">Leave Type</th>
                      <th scope="col">Duration</th>
                      <th scope="col">From</th>
                      <th scope="col">To</th>
                      <th scope="col">Status</th>
                      <th scope="col">Approved by</th>
                    </tr>
                  </thead>
                  <tbody>
                  
                  {employeeLeavesPending.map((leaves)=>(
                    <tr>
                      <td>
                        <span class="number">{leaves.no_of_days}</span>
                      </td>
                      <td class="Anumber">
                        <span>{leaves.leaves_type} Leave</span>
                      </td>
                      <td class="Anumber">
                        <span>{leaves.leaves_start_time ? leaves.leaves_start_time + " - " + leaves.leaves_end_time : "N/A"}</span>
                      </td>                      
                      <td class="Anumber">
                        <span> {leaves.request_from_day + ' ' + month[leaves.request_from_month-1] + ' ' + leaves.request_from_year}</span>
                      </td>
                      <td class="Anumber">
                        <span> {leaves.request_to_day + ' ' + month[leaves.request_to_month-1] + ' ' + leaves.request_to_year}</span>
                      </td>                      
                      <td class="Anumber">
                        { roleArray.includes(roleSlug) 
                          ?
                          <Link to={"/leaves-individual-request/" + leaves.emp_id + "/request/" + leaves.request_id } class="badge pending">
                            Pending
                          </Link>
                          :
                          <button type="button" class="btn pending" onClick={()=>handleShowDialog(leaves)}>
                            {leaves.status}
                          </button>
                        }       
                      </td>
                      <td class="Anumber">
                        <span>{leaves.approved_by ? reportToPersons.map((person)=>(leaves.approved_by == person.value ? person.label : "")) : "N/A"}</span> 
                      </td>
                    </tr>
                  ))}

                  {employeeLeaves.map((leaves)=>(
                    <tr>
                      <td>
                        <span class="number">{leaves.no_of_days}</span>
                      </td>
                      <td class="Anumber">
                        <span>{leaves.leaves_type} Leave</span>
                      </td>
                      <td class="Anumber">
                        <span>{leaves.leaves_start_time ? leaves.leaves_start_time + " - " + leaves.leaves_end_time : "N/A"}</span>
                      </td>                      
                      <td class="Anumber">
                        <span> {leaves.request_from_day + ' ' + month[leaves.request_from_month-1] + ' ' + leaves.request_from_year}</span>
                      </td>
                      <td class="Anumber">
                        <span> {leaves.request_to_day + ' ' + month[leaves.request_to_month-1] + ' ' + leaves.request_to_year}</span>
                      </td>                      
                      <td class="Anumber">
                          <button type="button" class="btn approved" onClick={()=>handleShowDialog(leaves)}>
                            {leaves.status}
                          </button>
                      </td>
                      <td class="Anumber">
                        <span>{leaves.approved_by ? reportToPersons.map((person)=>(leaves.approved_by == person.value ? person.label : "")) : "N/A"}</span> 
                      </td>
                    </tr>
                  ))}

                  {employeeLeavesDeclined.map((leaves)=>(
                    <tr>
                      <td>
                        <span class="number">{leaves.no_of_days}</span>
                      </td>
                      <td class="Anumber">
                        <span>{leaves.leaves_type} Leave</span>
                      </td>
                      <td class="Anumber">
                        <span>{leaves.leaves_start_time ? leaves.leaves_start_time + " - " + leaves.leaves_end_time : "N/A"}</span>
                      </td>                      
                      <td class="Anumber">
                        <span> {leaves.request_from_day + ' ' + month[leaves.request_from_month-1] + ' ' + leaves.request_from_year}</span>
                      </td>
                      <td class="Anumber">
                        <span> {leaves.request_to_day + ' ' + month[leaves.request_to_month-1] + ' ' + leaves.request_to_year}</span>
                      </td>                      
                      <td class="Anumber">
                          <button type="button" class="btn declined" onClick={()=>handleShowDialog(leaves)}>
                            {leaves.status}
                          </button>
                      </td>
                      <td class="Anumber">
                        <span>{leaves.approved_by ? reportToPersons.map((person)=>(leaves.approved_by == person.value ? person.label : "")) : "N/A"}</span> 
                      </td>
                    </tr>
                  ))}
                                      
                  </tbody>
                </table>
                {
                    (employeeLeaves.length == 0 && employeeLeavesDeclined.length == 0 && employeeLeavesPending.length == 0)  &&
                      <div class="alert alert-light text-center w-100" role="alert">
                        No leaves record found.
                      </div>
                  }
              </div>
            </div>
          </div>

          {showDialog && <>
            <div class="modal fade in d-block confirmModal mx-100" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="false" id="mi-modal">
              <div class="modal-dialog ">
                <div class="modal-content">
                  <div class="modal-header">
                    <button onClick={handleCancel} type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel"> Leaves Detail </h4>
                  </div>
                  <div class="modal-body">
                  <div class="col-12">
                      <div className="alert alert-success application">
                        To, <br></br>
                        {leavesData.reportTo}, <br></br>
                        Asterisk Solutions Islamabad,<br></br>
                        Pakistan. <br></br>                                                
                        <p class="my-2"><b>Subject:</b> {leavesData.leaveType} {leavesData.noOfDays ==1 ? 'Leave' : 'Leaves'}</p>
                        <p class="my-2">Respected Sir/Madam,</p>

                        <p class="bg-light p-3">{leavesData.reason}</p>
                        
                        <b>Date From:</b> {leavesData.fromDate.toDateString()}
                        <br></br>                        
                        <b>Date To:</b> {leavesData.toDate.toDateString()}
                        <br></br>
                        <b>Number of Days:</b> {leavesData.numOfDays}
                        <br></br>
                        {leavesData.startTime && <><b>Time Duration:</b> {leavesData.startTime} - {leavesData.endTime}<br></br></> }                        
                        <b>Status:</b> Request {leavesData.status}
                        <br></br>
                        {(leavesData.status == "Approved" || leavesData.status == "Declined") && <><b>{leavesData.status} By: </b>{leavesData.approved_by}</>}
                                                
                        <p class="my-0 mt-3">Yours Sincerely,</p>
                        <p class="my-0"><b>{selectedEmployee.first_name + " " + selectedEmployee.last_name}</b>,</p>
                        <p class="my-0"><b>{selectedEmployee.desig_title}</b>,</p>
                        <p class="my-0">Asterisk Solutions Islamabad, Pakistan.</p>

                      </div>
                    </div>
                  </div>                  
                </div>
              </div>
            </div>
            <div class="alert" role="alert" id="result"></div>
          </>}  


        </section>
      </div>
    </>
  );
};

export default LeavesIndividualDetails;
