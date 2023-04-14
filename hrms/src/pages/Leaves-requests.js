import React, { useEffect, useState } from "react";
import Sidenav from "../components/sidenav/Sidenav";
import EmployeeLeavesBoard from "../components/employees/EmployeeLeavesBoard";
import EmployeeLeavesRequestBoard from "../components/employees/EmployeeLeavesRequestBoard";
import { GetEmployees } from "../API/Employee";
import { GetLeaveRequests } from "../API/LeaveRequest";
import { useParams, Link } from "react-router-dom";

const LeavesRequests = () => {

  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("list");
  const [roleSlug, setRoleSlug] = useState(localStorage.getItem('role_slug'));
  const { id } = useParams();
  const month =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  
  let login_id = { id: localStorage.getItem('id') };
  let login_role = { role_slug: localStorage.getItem('role_slug') };
  let newdata = { ...login_role, ...login_id };
  let imageURL = localStorage.getItem("homeURL") + "/images/";


  useEffect(async () => {
    try {
                  
      newdata = {...newdata, year: new Date().getFullYear(), status: 'Pending'}      
      GetLeaveRequests(newdata).then(r=>setEmployeeLeaves(r.data))
         
      // Loader Delay
      setTimeout(() => {
        setLoading(false);
      }, 250);

    } catch {
      setEmployeeLeaves([]);
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


  return (
    <>
      <Sidenav />
      
      <section class="col-lg-10 InnerContent">
        <article class="breadcrumbs pt-4" id="breadCrumbs">
          <div class="container">
            <div class="row">
              <div class="col-lg-7 col-md-6 col-sm-5 col-5 breadcrumbContent">
                <h2>Employee Leaves Requests</h2>

                <nav aria-label="breadcrumb">
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Dashboard</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                      Leaves Requests
                    </li>
                  </ol>
                </nav>
              </div>
              <div class="col-lg-5 col-md-6 col-sm-7 col-7 menuButton text-end">
                {
                  id != undefined && id > 0
                  ?
                  <Link type="button" class="btn btn-primary employee mb-2" to={'/leaves-requests'}>
                    <i class="fas fa-chevron-left"></i> Go Back
                  </Link>
                  :
                  ''
                }

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

        
        

      {
        id != undefined && id > 0
        ?
        <EmployeeLeavesRequestBoard role_slug={roleSlug} id={id} navigateTo={'/leaves-requests'}/> 
        :
        ''        
      }
      {/*<EmployeeLeavesBoard role_slug={roleSlug} />*/}
        {/*<article id="filter">
          <div class="container">
            <div class="row">
              <div class="col-lg-3 col-md-3 col-sm-6 col-6 mb-2">
                <input type="text" placeholder="Employee ID" />
              </div>
              <div class="col-lg-3 col-md-3 col-sm-6 col-6 mb-2">
                <select class="form-select" aria-label="Default select example">
                  <option selected>Select Department</option>
                  <option value="1">Development</option>
                  <option value="2">Integration</option>
                  <option value="3">Designing</option>
                </select>
              </div>
              <div class="col-lg-3 col-md-3 col-sm-6 col-6 mb-2 position-relative">
                <input type="date" placeholder="From" />
                <a href="##">
                  <img
                    src="./images/calendar2-date.png"
                    class="img-fluid"
                    alt=""
                  />
                </a>
              </div>
              <div class="col-lg-3 col-md-3 col-sm-6 col-6 mb-2 position-relative">
                <input type="date" placeholder="To" />
                <a href="##">
                  <img
                    src="./images/calendar2-date.png"
                    class="img-fluid"
                    alt=""
                  />
                </a>
              </div>
              <div class="col-12" id="showLeave">
                <strong>
                  Show
                  <input type="text" /> entries
                </strong>
              </div>
            </div>
          </div>
    </article>*/}
    {
      id != undefined && id > 0
      ?
      <>
        {/*<EmployeeLeavesBoard />*/}
        <div class="alert alert-light text-center w-100" role="alert">
          No records found.
        </div>
      </>
      :
        <section id="EmployeeLeaveAdmin" class="employeeLeaveTable">
          <div class="container">
            <div class="row">
              <div class="col-12 mt-4 table-responsive">
                <table class="table table-striped text-nowrap">
                  <thead>
                    <tr>
                      <th scope="col">Employee</th>
                      <th scope="col">
                        <a href="##">
                          <i class="fas fa-sort-alpha-up"></i>
                        </a>
                        Leave Type
                        <a href="##">
                          <i class="fas fa-sort-alpha-down-alt"></i>
                        </a>
                      </th>
                      <th scope="col">From</th>
                      <th scope="col">To</th>
                      <th scope="col">Duration</th>
                      <th scope="col" class="text-center">
                        No of Days
                      </th>
                      <th scope="col" class="text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>

                  {employeeLeaves.map(employee=>(
                    <tr>
                      <td>
                        <h2 class="table-avatar">
                          <a href="#" class="avatar">
                            <img
                              alt="employee picture"
                              src={employee.emp_pic ? imageURL + employee.emp_pic.replace("-l","-s") : imageURL + "Ellipse 72.png"}
                            />
                          </a>
                          <a href="#">
                          {employee.first_name} {employee.last_name}<span>{employee.desig_title}</span>
                          </a>
                        </h2>
                      </td>
                      <td class="Anumber">
                        <span>{employee.leaves_type} Leave</span>
                      </td>
                      <td class="Anumber">
                        <span> {employee.request_from_day + ' ' + month[employee.request_from_month-1] + ' ' + employee.request_from_year}</span>
                      </td>
                      <td class="Anumber">
                        <span>{employee.request_to_day + ' ' + month[employee.request_to_month-1] + ' ' + employee.request_to_year}</span>
                      </td>
                      <td class="Anumber text-center">
                        <span>{employee.leaves_start_time && employee.leaves_end_time ? employee.leaves_start_time + " - " + employee.leaves_end_time : "N/A"}</span>
                      </td>
                      <td class="Anumber text-center">
                        <span>{employee.no_of_days}</span>
                      </td>
                      <td class="text-left linkButton">
                        <span>
                          <Link to={"/leaves-individual-request/" + employee.emp_id + "/request/" + employee.request_id } class="btn viewButton bg-primary bg-success">
                            Approve
                          </Link>
                        </span>
                        
                      </td>
                      
                    </tr>
                  ))}
                  
                  </tbody>
                </table>
                {(employeeLeaves && employeeLeaves.length == 0) && <div class="alert alert-light text-center" role="alert">No leave requests available.</div>}
              </div>
            </div>
          </div>
        </section>
      }
      </section>
                                    
    </>
  );
};

export default LeavesRequests;
