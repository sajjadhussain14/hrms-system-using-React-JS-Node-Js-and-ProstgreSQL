import React, { useEffect, useState } from "react";
import Sidenav from "../components/sidenav/Sidenav";
import { GetEmployees } from "../API/Employee";
import { Link } from "react-router-dom";
import {GetPayrolls} from "../API/Payroll"

const SalaryOverview = () => {
  
  const [employeeSalary, setEmployeeSalary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("list");
  const [mytest, setmytest] = useState("")

  let id = { id: 94 };
  let user_role = { role_slug: "super_admin" };
  let newdata = { ...user_role, ...id };
  let imageURL = localStorage.getItem("homeURL") + "/images/";

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    try {
      let emp = await GetEmployees(newdata);    
      setEmployeeSalary(emp.data.profile);
            
      // Loader Delay
      setTimeout(() => {
        setLoading(false);
      }, 250);

    } catch {
      setEmployeeSalary([]);
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
      <section class="col-lg-10 InnerContent ">
        <article class="breadcrumbs pt-4" id="breadCrumbs">
          <div class="container">
            <div class="row">
              <div class="col-lg-8 col-md-8 col-sm-5 col-5 breadcrumbContent">
                <h2>Employees Salary</h2>

                <nav aria-label="breadcrumb">
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Dashboard</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                      Salary Overview 
                    </li>
                  </ol>
                </nav>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-7 col-7 menuButton text-end">
                {/*<button type="button" class="employee">
                  <i class="fas fa-plus"></i>Add Salary
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
                  <option selected="">Select Month</option>
                  <option value="1">January</option>
                  <option value="2">Feb</option>
                  <option value="3">March</option>
                </select>
              </div>
              <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-2">
                <select class="form-select" aria-label="Default select example">
                  <option selected="">Select Year</option>
                  <option value="1">2018</option>
                  <option value="2">2019</option>
                  <option value="3">2020</option>
                </select>
              </div>
              <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-2 position-relative">
                <input type="date" placeholder="From" />
                <a href="##">
                  <img
                    src={imageURL + "calendar2-date.png"}
                    class="img-fluid"
                    alt=""
                  />
                </a>
              </div>
              <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-2 position-relative">
                <input type="date" placeholder="To" />
                <a href="##">
                  <img
                    src={imageURL + "calendar2-date.png"}
                    class="img-fluid"
                    alt=""
                  />
                </a>
              </div>*/}
            </div>
          </div>
        </article>
        <section id="EmployeePaySlip" class="employeeLeaveTable">
          <div class="container">
            <div class="row">
              <div class="col-12 mt-4 table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Employee</th>
                      <th scope="col">Join Date</th>
                      <th scope="col">Back Account #</th>
                      <th scope="col"> </th>
                    </tr>
                  </thead>
                  <tbody>

                  {employeeSalary.map(employee=>(
                    
                    <tr>
                      <td>
                        <h2 class="table-avatar">
                          <a class="avatar">
                            <img
                              alt="employee picture"
                              src={employee.emp_pic ? imageURL + employee.emp_pic.replace("-l","-s") : imageURL + employee.gender.toLowerCase() + ".png"}
                            />
                          </a>
                          <a >
                            {employee.first_name} {employee.last_name}<span>{employee.desig_title}</span>
                          </a>
                        </h2>
                      </td>
                      <td class="Anumber">
                        <span>{employee.joining_date}</span>
                      </td>                      
                      <td class="Anumber">
                        <span>{employee.account_number}</span>
                      </td>                      
                      <td class="linkButton">
                        <Link to={"/salary-detail/" +employee.emp_id} class="viewButton mx-auto text-center">
                          Salary Slips
                        </Link>
                      </td>
                    </tr>
                  ))}
                  
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default SalaryOverview;
