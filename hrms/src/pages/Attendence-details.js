import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import parse from 'html-react-parser'
import Sidenav from "../components/sidenav/Sidenav";
import { GetMonthlyAttendance , GetEmployeeAttendance } from "../API/Attendance";
import { GetEmployees } from "../API/Employee";

const AttendenceDetails = () => {

  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [employeeAttendance, setEmployeeAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [roleSlug, setRoleSlug] = useState(localStorage.getItem('role_slug'));
  const { id } = useParams();
  const month =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thrusday","Friday","Saturday"]
  
  let login_id = { id: localStorage.getItem('id') };
  let login_role = { role_slug: localStorage.getItem('role_slug')};
  let emp_id = { emp_id: id };
  let newdata = { ...login_role, ...login_id, ...emp_id };
  let imageURL = localStorage.getItem("homeURL") + "/images/";

  useEffect(async () => {
    try {
      // API CALL attendance
      let attendance = await GetEmployeeAttendance(newdata)      
      setEmployeeAttendance(attendance.data)

      // API CALL employee
      let emp = await GetEmployees(newdata)
      setEmployeeDetails(emp.data)      
      
      // Loader Delay
      setTimeout(() => {
        setLoading(false);
      }, 250);

    } catch {
      setEmployeeAttendance([]);
      setEmployeeDetails([]);
      setLoading(false);
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
  
  function showAttendance(props) {    
    return (                     
      <tr>
        <td class="number">
          <span>{props.counter}</span>
        </td>
        <td>
          <span>{props.date}</span>
        </td>
        <td>
          <span> {props.time ? props.time : 'N/A'}</span>
        </td>
        <td>
          <span>{props.emp_status}</span>
        </td>
        <td>
          <span>{props.in_notes ? props.in_notes : "N/A"}</span>
        </td>        
        <td class="linkButton">
          {" "}
          <button
            class="bg-secondary viewButton text-light mx-auto"
            data-bs-toggle="modal"
            data-bs-target={"#staticBackdropLabel" + props.counter}  
          >
            View Details
          </button>          
        </td>
        <td>
          {
            (roleSlug == 'super_admin' || roleSlug == 'administrator' || roleSlug == 'team_lead') && 
            <Link to={"/attendence-screen/" + id + "/" + props.attendance_id} class="btn btn-secondary bg-danger text-light viewButton">Change Details</Link>
          }
        </td>
      </tr>
    );
  }


  
  function showPopup(props) {    
    return (                     
      <div
        class="modal fade staticBackdrop1"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby={"staticBackdropLabel" + props.counter}
        id={"staticBackdropLabel" + props.counter}
        aria-hidden="true"
        
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body AttendancePunchIn">
              <h3 class="my-4">Attendance Info</h3>
              <div class="timesheet mb-4">
                <p>
                  <strong>Timesheet</strong> <span>{props.date}</span>
                </p>
                <div class="punchIn mx-auto">                  
                  {props.is_present > 0 ? <strong>Punch In On</strong> : <strong>Attendance Status</strong>}
                  <span>{props.is_present > 0 ? props.punch_in : props.emp_status}</span>
                  <br></br><br></br>
                  {props.in_notes && <>
                    <strong>Late Reason</strong>
                    <p>{props.in_notes}</p>
                  </>}
                </div>
              </div>
              <button class="closeButton" data-bs-dismiss="modal" aria-label="Close">
                {" "}
                <img src={imageURL + "plus-circle-fill.png"} alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  let listTemplate = []
  let popupTemplate = []
  let date = new Date()
  let daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();  
  if(employeeAttendance.length) {    
    let details = {}
    let counter = 1
    for(let j=0; j<employeeAttendance.length; j++) {      
      date = new Date(month[employeeAttendance[j].in_month-1] + " " + employeeAttendance[j].in_day  + ", " + employeeAttendance[j].in_year)
      let day = date.getDay()
      details.date = employeeAttendance[j].in_day + " " + month[employeeAttendance[j].in_month-1] + " " + employeeAttendance[j].in_year
      details.time = employeeAttendance[j].in_time      
      details.punch_in =  days[day] + ", "+employeeAttendance[j].in_day + " " + month[employeeAttendance[j].in_month-1] + " " + employeeAttendance[j].in_year + " " + employeeAttendance[j].in_time 
      details.counter = counter
      details.emp_status = employeeAttendance[j].emp_status
      details.is_present = employeeAttendance[j].is_present
      details.attendance_id = employeeAttendance[j].attendance_id
      details.in_notes = employeeAttendance[j].in_notes
      listTemplate[j] = showAttendance(details)
      popupTemplate[j] = showPopup(details)
      counter += 1      
    }
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
                  <img src={imageURL + "Ellipse 59.png"} class="img-fluid" alt="" />
                  <span class="name d-block">{employeeDetails.first_name + " " + employeeDetails.last_name }</span>{" "}
                  <span class="designation">{employeeDetails.desig_title}</span>
                </p>
                {
                  (roleSlug == "super_admin" || roleSlug == "manager" || roleSlug == "team_lead") &&
                  <Link type="button" class="btn btn-primary employee mb-2 " to={'/attendence-overview'}>
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
                     Attendance Details
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
                  class="employee"
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

        <section id="EmployeeAttendanceDashboard" class="employeeAttendance">
          <article>
            <div class="container">
              <div class="row">
                <div class="col-12 mt-4 table-responsive">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col" class="col-lg-1 text-center">
                          #
                        </th>
                        <th scope="col" class="col-lg-2">
                          Date
                        </th>                       
                        <th scope="col" class="col-lg-2">
                          Punch In On
                        </th>
                        <th scope="col" class="col-lg-2">
                          Status
                        </th>
                        <th scope="col" class="col-lg-6">
                          Late Reason
                        </th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {listTemplate}                      
                    </tbody>
                  </table>
                  {
                    listTemplate==""
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
        </section>
      </section>
     {popupTemplate}
      <div
        class="modal fade"
        id="staticBackdropLabel1"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body AttendancePunchIn">
              <h3 class="my-4">Attendance Info</h3>
              <div class="timesheet mb-4">
                <p>
                  <strong>Timesheet</strong> <span>11 Mar 2022</span>
                </p>
                <div class="punchIn mx-auto">
                  <strong>Punch In at</strong>
                  <span>Wed, 11th Mar 2022 03:00PM</span>
                </div>
              </div>
              <button class="closeButton" data-bs-dismiss="modal" aria-label="Close" >
                {" "}
                <img src={imageURL + "plus-circle-fill.png"} alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttendenceDetails;
