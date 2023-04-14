import React, { useEffect, useState } from "react";
import Sidenav from "../components/sidenav/Sidenav";
import { GetPayrolls } from "../API/Payroll";
import {GetEmployees} from "../API/Employee"
import { useParams, Link } from "react-router-dom";


const SalaryDetail = () => {

  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [payrollDetail, setpayrollDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleSlug, setRoleSlug] = useState(localStorage.getItem('role_slug'));
  const [viewType, setViewType] = useState("list");
  const [fromDate, setFromDate] = useState("");
  const { id } = useParams();
  const month =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const fullmonth = ["January","February","March","April","May","June","July","August","September","October","November","December"]
  const startYear = 2000

  let login_id = { id: localStorage.getItem('id') };
  let login_role = { role_slug: localStorage.getItem('role_slug') };
  let emp_id = { emp_id: id };
  let newdata = { ...login_role, ...login_id, ...emp_id };
 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    try {      
      
      // Call API for profile
      let emp = await GetEmployees(newdata)      
      setSelectedEmployee(emp.data); 
     
      // Call API for payroll
      let payroll = await GetPayrolls(newdata);          
      setpayrollDetail(payroll.data.payroll);
      
      // Loader Delay
      setTimeout(() => {
        setLoading(false);
      }, 250);

    } catch {
      setSelectedEmployee([]);
      setpayrollDetail([]);
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



  // set years for dropdown
  let years = []
  const dat = new Date()
  for(let i=dat.getFullYear(); i>dat.getFullYear()-20; i--) {
    years.push(i)
  }

  const handleChangeValue = async event => {
    let searchData = {...newdata}
    if(event.target.name === "search_from_date") {
      setFromDate(event.target.value)      
    } else if(event.target.name === "search_to_date" && fromDate != "") {
      const sdat = {search_from_date:fromDate, search_to_date: event.target.value}
      searchData = {...searchData, ...sdat}
    } else if(event.target.name === "search_month") {
      const searchmonth = {search_month: event.target.value}
      searchData = {...searchData, ...searchmonth}
    } else if(event.target.name === "search_year") {
      const searchyear = {search_year: event.target.value}
      searchData = {...searchData, ...searchyear}
    }    
    
    // API call Payrolls
    let emp = await GetEmployees(searchData);          
    setSelectedEmployee(emp.data);

    // API call Payrolls
    let payroll = await GetPayrolls(searchData);          
    setpayrollDetail(payroll.data.payroll);    
  }


  return (
    <>
      <Sidenav />
      <section class="col-lg-10 InnerContent">
        <article class="breadcrumbs pt-4" id="breadCrumbs">
          <div class="container">
            <div class="row">
              <div class="col-lg-8 col-md-8 col-sm-7 col-9 breadcrumbContent">
                <h2>Salary Slips</h2>

                <nav aria-label="breadcrumb">
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Dashboard</a>
                    </li>                    
                    <li class="breadcrumb-item active" aria-current="page">
                      {selectedEmployee.first_name} {selectedEmployee.last_name}
                    </li>
                  </ol>
                </nav>                
              </div>
              <div class="col-lg-4 col-md-4 col-sm-5 col-3 menuButton text-end">
                {/*<button type="button" class="employee">
                  <i class="fas fa-plus"></i>Add Salary
                </button>*/}
                
                {
                  (roleSlug == "super_admin" || roleSlug == "manager") &&
                  <Link type="button" class="btn btn-primary employee mb-1 " to={'/salary-overview'}>
                    <i class="fas fa-chevron-left"></i> Go Back
                  </Link>
                }
              </div>
            </div>
          </div>
        </article>
        <article id="filter">
          <div class="container">
            <div class="row">
              <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-2">
                <select class="form-select" aria-label="Default select example" name="search_month" onChange={handleChangeValue}>
                  <option  value="">Select Month</option>
                  {fullmonth.map((m,i)=>(
                    <option value={i+1}>{m}</option>
                  ))}
                </select>
              </div>
              <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-2">
                <select class="form-select" aria-label="Default select example" name="search_year" onChange={handleChangeValue}>
                  <option selected value="">Select Year</option>
                  {years.map((y)=>(                    
                    <option value={y}>{y}</option>
                  ))}
                </select>
              </div>
              
            </div>
          </div>
        </article>
        <section id="EmployeePaySlipRecord" class="employeeLeaveTable">
          <div class="container">
            <div class="row">
              <div class="col-12 mt-4 table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Month</th>
                      <th scope="col">Gross Salary</th>
                      <th scope="col">Increment</th>
                      <th scope="col">Bonus</th>
                      <th scope="col">Overtime</th>
                      <th scope="col">Bank Account #</th>
                      <th scope="col">NTN</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollDetail.map(payroll=>(
                      <tr>
                        <td class="Anumber">
                          <span>{month[payroll.pay_month-1]}, {payroll.pay_year}</span>
                        </td>
                        <td class="Anumber">
                          <span>Rs. {payroll.pay_gross.toFixed(2)}</span>
                        </td>
                        <td class="Anumber">
                          <span>Rs. {payroll.pay_increment.toFixed(2)}</span>
                        </td>
                        <td class="Anumber">
                          <span>Rs. {payroll.pay_bonus.toFixed(2)}</span>
                        </td>
                        <td class="Anumber">
                          <span>Rs. {payroll.overtime.toFixed(2)}</span>
                        </td>
                        <td class="Anumber">
                          <span>{selectedEmployee.account_number}</span>
                        </td>
                        <td class="Anumber">
                          <span>{selectedEmployee.emp_ntn}</span>
                        </td>
                        <td class="linkButton">
                          { 
                            roleSlug == "super_admin" ||roleSlug == "manager" ||roleSlug == "administrator"
                            ?
                            <div class="d-flex">
                              <Link class="viewButton mx-auto" to={'/edit-salary-slip/' + id + "/slip/" + payroll.payroll_id}>
                                Edit Slip
                              </Link>
                              <Link class="bg-secondary viewButton mx-auto" to={'/salary-slip/'  + id + "/slip/" + payroll.payroll_id}>
                                View Slip
                              </Link>
                            </div>
                            :
                            <Link class="bg-secondary viewButton mx-auto text-center" to={'/salary-slip/'  + id + "/slip/" + payroll.payroll_id}>
                              View Slip
                            </Link>
                          }
                        </td>
                      </tr>
                    ))}
                    
                  </tbody>
                </table>

                {(!payrollDetail || payrollDetail.length == 0) && <div class="alert alert-light text-center" role="alert">No payslip record available.</div>}
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default SalaryDetail;
