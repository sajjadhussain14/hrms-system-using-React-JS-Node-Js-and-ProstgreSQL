import React, { useEffect, useState } from "react";
import Sidenav from "../components/sidenav/Sidenav";
import { GetEmployees } from "../API/Employee";
import {GetDepartment} from "../API/Department"
import {GetDesignation} from "../API/Designation"
import { useParams, useNavigate, Link } from "react-router-dom";
import GridView from "../components/employees/GridView";
import ListView from "../components/employees/ListView";
import BasicFilter from "../components/filters/BasicFilter";

const ExEmployees = () => {

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("list");
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const navigate = useNavigate();

  if(!localStorage.getItem('id') || !localStorage.getItem('role_slug')) {
    navigate('/login', { replace: true })   
  }  
    
  let id = { id: localStorage.getItem('id') };
  let user_role = { role_slug: localStorage.getItem('role_slug') };
  let ex_employee = {ex_employee: "Yes"};
  let newdata = { ...user_role, ...id, ...ex_employee };  
    

  useEffect(async () => {
    
    try {
      // API call employees
      let emp = await GetEmployees(newdata);    
      setEmployees(emp.data.profile);

      // API call departements
      let dept = await GetDepartment(newdata);    
      setDepartments(dept.data);

      // API call designation
      let desig = await GetDesignation(newdata);    
      setDesignations(desig.data);
      
      // Loader Delay
      setTimeout(() => {
        setLoading(false);
      }, 250);
      
    } catch {
      setEmployees([]);
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


  const handleChangeValue = async event => {
    let searchData = {...newdata}
    if(event.target.name === "department") {
      const department = {department: event.target.value}
      searchData = {...searchData, ...department}
    } else if(event.target.name === "designation") {
      const designation = {designation: event.target.value}
      searchData = {...searchData, ...designation}
    } else if(event.target.name === "name") {
      const name = {name: event.target.value}
      searchData = {...searchData, ...name}
    } else if(event.target.name === "emp_number") {
      const emp_number = {emp_number: event.target.value}
      searchData = {...searchData, ...emp_number}
    }
    // API call employees
    let emp = await GetEmployees(searchData);    
    setEmployees(emp.data.profile);   
  }



  return (
    <>
      <Sidenav />
      <section class="col-lg-10 InnerContent">
        <section id="AllEmployeeInner1">
          <article class="breadcrumbs pt-4" id="breadCrumbs">
            <div class="container">
              <div class="row">
                <section class="col-lg-7 col-md-6 col-sm-5 col-5 breadcrumbContent">
                  <PageHeading />
                  <BreadCrumbs />
                </section>
                {PageViewType(setViewType)}
              </div>
            </div>
          </article>
          <BasicFilter designations={designations} departments={departments}  onChangeValue={handleChangeValue}/>
          {viewType === "list" ? (
            <ListView employees={employees} setViewType={setViewType} />
          ) : (
            <GridView employees={employees} setViewType={setViewType} />
          )}
        </section>
      </section>
    </>
  );
};

const ViewTypehandler = (val, setViewType) => {
  setViewType(val);
};

const PageHeading = () => {
  return <h2>Ex Employees</h2>;
};

const BreadCrumbs = () => {
  return (
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <Link to="/">Dashboard</Link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          Ex Employees
        </li>
      </ol>
    </nav>
  );
};

const PageViewType = (setViewType) => {
  return (
    <section class="col-lg-5 col-md-6 col-sm-7 col-7 menuButton text-end">
      <button
        class="menutabs"
        onClick={() => {
          ViewTypehandler("grid", setViewType);
        }}
      >
        <i class="fas fa-th"></i>
      </button>
      <button
        class="menutabs"
        onClick={() => {
          ViewTypehandler("list", setViewType);
        }}
      >
        <i class="fas fa-bars icon1"></i>
      </button>
      {
        localStorage.getItem('role_slug') == "super_admin" &&
        <Link class="btn btn-primary employee my-2" to="/add-employee">
          <i class="fas fa-plus"></i>Add Employee
        </Link>
      }
    </section>
  );
};

export default ExEmployees;
