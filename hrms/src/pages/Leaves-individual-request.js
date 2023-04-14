import React, { useEffect, useState } from "react";
import Sidenav from "../components/sidenav/Sidenav";
import EmployeeLeavesRequestBoard from "../components/employees/EmployeeLeavesRequestBoard";
import { GetLeaveRequests, GetThisYearLeaves, ResponseToLeaveRequests } from "../API/LeaveRequest";
import { GetEmployees, getReportToByID } from "../API/Employee";
import { useParams, Link } from "react-router-dom";
import { useNavigate} from "react-router-dom";
import EmployeeLeavesBoard from "../components/employees/EmployeeLeavesBoard";


const LeavesRespondOnRequest = () => {

  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const [reportToPersons, setReportToPersons] = useState([]);  
  const [loading, setLoading] = useState(true);
  const { id, request_id } = useParams();
  const [roleSlug, setRoleSlug] = useState(localStorage.getItem('role_slug'));
  const [reportTo, setReportTo] = useState("");
  const navigate = useNavigate();
  const month =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  
  let login_id = { id: localStorage.getItem('id') };
  let login_role = { role_slug: "super_admin" };
  let emp_id = { emp_id: id };
  let newdata = { ...login_role, ...login_id, ...emp_id };

  useEffect(() => {
    try {
      // API calls
      apiCalls();
       
      // Loader Delay
      setTimeout(() => {
        setLoading(false);
      }, 350);

    } catch {
      setSelectedEmployee([]);       
      setEmployeeLeaves([]);      
    }
  }, []);


  // API calls
  const apiCalls = async ()=>{

      // get employee profile
      let emp = await GetEmployees(newdata)      
      setSelectedEmployee(emp.data);       

      // get employee leaves
      GetThisYearLeaves(newdata).then(r=>{
        r.data.map((lev)=>{
          if(!emp.data.report_to.includes(lev.approved_by)) setReportTo(lev.approved_by)  
        })
        setEmployeeLeaves(r.data)
      });
      
      GetEmployees(newdata).then(r=>{
          // Get report to persons
          let reportto = []
          let repto = reportTo ? emp.data.report_to + "," + reportTo : emp.data.report_to
          if(repto) {
            const ids = repto.split(",")
            for(let i=0; i<ids.length; i++) {
              let rep =  getReportToByID({id:ids[i]})
              reportto.push(rep.data)
                        
            }        
          }   
          setReportToPersons(reportto)
      })
                  
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


  return (
    <>
      <Sidenav />

      <div class="col-lg-10 InnerContent">

        <article class="breadcrumbs pt-4" id="breadCrumbs">
          <div class="container">
            <div class="row">
              <div class="col-lg-7 col-md-6 col-sm-5 col-5 breadcrumbContent">
                <h2>Leaves Request</h2>
              </div>
              <div class="col-lg-5 col-md-6 col-sm-7 col-7 menuButton text-end">                
                <Link type="button" class="btn btn-primary employee mb-2" to={'/leaves-requests'}>
                  <i class="fas fa-chevron-left"></i> Go Back
                </Link>
              </div>
            </div>
          </div>
        </article>

        <EmployeeLeavesRequestBoard role_slug={roleSlug} id={id} request_id={request_id} navigateTo={'/leaves-requests'}/>       

        {/*<article id="filter">
          <div class="container">
            <div class="row">
              <div class="col-12 my-3">
                <h3>LEAVE RECORD</h3>
              </div>
              <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-2">
                <select class="form-select" aria-label="Default select example">
                  <option selected="">Select Department</option>
                  <option value="1">Development</option>
                  <option value="2">Integration</option>
                  <option value="3">Designing</option>
                </select>
              </div>
              <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-2 position-relative mx-auto">
                <input type="date" placeholder="From" />
                <a href="##">
                  <img
                    src="../images/calendar2-date.png"
                    class="img-fluid"
                    alt=""
                  />
                </a>
              </div>
              <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-2 position-relative text-end">
                <input type="date" placeholder="To" />
                <a href="##">
                  <img
                    src="../images/calendar2-date.png"
                    class="img-fluid"
                    alt=""
                  />
                </a>
              </div>
            </div>
          </div>
        </article>
        <section id="EmployeeLeaveForm" class="employeeLeaveTable">
          <div class="container">
            <div class="row">
              
              <div class="col-12 mt-4 table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col"># of Days</th>
                      <th scope="col">Leave Type</th>
                      <th scope="col">Start From</th>
                      <th scope="col">Reason</th>
                      <th scope="col">Status</th>
                      <th scope="col">Approved by</th>
                    </tr>
                  </thead>
                  <tbody>
                  
                  {employeeLeaves.map(employee=>(
                    <tr>
                      <td>
                        <span class="number">{employee.no_of_days}</span>
                      </td>
                      <td class="Anumber">
                        <span>{employee.leaves_type}</span>
                      </td>
                      <td class="Anumber">
                        <span> {employee.request_from_day + ' ' + month[employee.request_from_month] + ' ' + employee.request_from_year}</span>
                      </td>
                      <td class="Anumber">
                        <span>{employee.request_reason}</span>
                      </td>
                      <td class="Anumber">
                        <span>{employee.status}</span>
                      </td>
                      <td class="Anumber">
                        <span>{employee.approved_by ? reportToPersons.map(person=>(person.emp_id === parseInt(employee.approved_by) ? person.first_name + " " + person.last_name : "")) : "N/A"}</span>
                      </td>
                    </tr>
                  ))}

                    
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>*/}
      </div>
    </>
  );
};

       

export default LeavesRespondOnRequest;
