import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const Sidenav = () => {

  const [roleSlug, setRoleSlug] = useState(localStorage.getItem('role_slug'));

  let id = localStorage.getItem('id') ? localStorage.getItem('id') : '' 
  let role_slug = localStorage.getItem('id') ? localStorage.getItem('role_slug') : '' 
  let employeesBtn = ""
  let xemployeesBtn = ""
  let imageURL = localStorage.getItem("homeURL") + "/images/";

  
  if (id && role_slug && role_slug === "super_admin" || role_slug === "administrator" || role_slug === "manager" || role_slug === "team_lead") {
    employeesBtn = <li><Link to="/employees" class="link-dark rounded">Current Employees</Link></li>;
    xemployeesBtn = <li><Link to="/ex-employees" class="link-dark rounded">Ex Employees</Link></li>;
  } 

  return (
    <>
      <section id="sidebar" class="col-md-2 border">
        <div class="flex-shrink-0 bg-white">
          <ul class="list-unstyled ps-0">
            <li class="mb-1">
              <button
                class="btn align-items-center rounded collapsed sidebarbutton"
                data-bs-toggle="collapse"
                data-bs-target="#home-collapse"
                aria-expanded="true"
              >
                <img src={imageURL + "Group 67.png"} /> Employees
                <img src={imageURL + "chevron-down.png"} />
              </button>
              <div class="collapse show" id="home-collapse">
                <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  <li>
                    <Link to={'/employee-profile/' + localStorage.getItem('id')} class="link-dark rounded">
                      My profile
                    </Link>
                  </li>                  

                  { employeesBtn }
                  { xemployeesBtn }
                  
                  {(roleSlug == "super_admin" || roleSlug == "manager" || roleSlug == "administrator") && 
                  <>
                    <li><Link to={'/add-employee' } class="link-dark rounded">
                      Add Employee
                    </Link></li>
                    <li><Link to={'/setting' } class="link-dark rounded">
                      Settings
                    </Link></li>
                  </>
                  }                 
                  
                  <li>
                    <Link to={'/reset-password/' + localStorage.getItem('email')} class="link-dark rounded">
                      Reset Password
                    </Link>
                  </li>                  
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <div class="flex-shrink-0 bg-white">
          <ul class="list-unstyled ps-0">
            <li class="mb-1">
              <button
                class="btn align-items-center rounded collapsed sidebarbutton"
                data-bs-toggle="collapse"
                data-bs-target="#home-collapse"
                aria-expanded="true"
              >
                <img src={imageURL + "Group 67.png"} /> Attendence
                <img src={imageURL + "chevron-down.png"} />
              </button>
              <div class="collapse show" id="home-collapse">
                <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  <li>
                    <Link to="/attendence-screen" class="link-dark rounded">
                      Mark Attendence
                    </Link>
                  </li>

                  {
                    (role_slug == "super_admin" || role_slug == "team_lead" || role_slug == "manager" || role_slug == "administrator") &&
                    <li>
                      <Link to="/attendence-overview" class="link-dark rounded">
                        Attendence Overview 
                      </Link>
                    </li>
                  }
                  <li>     
                    <Link to={"/attendence-details/" + id} class="link-dark rounded">
                      My Attendence
                    </Link>                                   
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <div class="flex-shrink-0 bg-white">
          <ul class="list-unstyled ps-0">
            <li class="mb-1">
              <button
                class="btn align-items-center rounded collapsed sidebarbutton"
                data-bs-toggle="collapse"
                data-bs-target="#home-collapse"
                aria-expanded="true"
              >
                <img src={imageURL + "Group 67.png"} /> Leaves
                <img src={imageURL + "chevron-down.png"} />
              </button>
              <div class="collapse show" id="home-collapse">
                <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  <li>
                    <Link to={roleSlug == "member" ? '/leaves-individual-details/' + localStorage.getItem('id')  : '/leaves-record'} class="link-dark rounded">
                      Leave Records
                    </Link>
                  </li>
                  {
                  (roleSlug == "super_admin" || roleSlug == "team_lead" || roleSlug == "manager" || roleSlug == "administrator") && <li>
                    <Link to={roleSlug == "super_admin" || roleSlug == "team_lead" || roleSlug == "manager" || roleSlug == "administrator" ? "/leaves-requests" : "/leaves-requests/" + id} class="link-dark rounded">
                      Leave Requests <strong className="text-danger">({localStorage.getItem('totalLeavesRequest') ? localStorage.getItem('totalLeavesRequest') : '0'})</strong>
                    </Link>
                  </li>
                  }
                  <li>
                    <Link to={"/leaves-application/"} class="link-dark rounded">
                      Apply for Leave
                    </Link>
                  </li>
                  {/*<li>
                    <Link
                      to="/leaves-respond-on-request"
                      class="link-dark rounded"
                    >
                      Respond on Leave Applications
                    </Link>
  </li>*/}
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <div class="flex-shrink-0 bg-white">
          <ul class="list-unstyled ps-0">
            <li class="mb-1">
              <button
                class="btn align-items-center rounded collapsed sidebarbutton"
                data-bs-toggle="collapse"
                data-bs-target="#home-collapse"
                aria-expanded="true"
              >
                <img src={imageURL + "Group 67.png"} /> Salary
                <img src={imageURL + "chevron-down.png"} />
              </button>
              <div class="collapse show" id="home-collapse">
                <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  <li>
                    <Link to={roleSlug == "super_admin" || roleSlug == "manager" || roleSlug == "administrator" ? '/salary-overview' : '/salary-detail/' + localStorage.getItem('id')} class="link-dark rounded">
                      Salary overview
                    </Link>
                  </li>
                  {(roleSlug == "super_admin" || roleSlug == "manager" || roleSlug == "administrator") && 
                    <li>
                      <Link to={'/release-salary'} class="link-dark rounded">
                        Release Salary
                      </Link>
                    </li>}
                  {/*<li>
                    <Link to="/salary-detail" class="link-dark rounded">
                      Salary Detail
                    </Link>
                  </li>
                  <li>
                    <Link to="/salary-slip" class="link-dark rounded">
                      Salary Slip
                    </Link>
                  </li>*/}
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <div class="flex-shrink-0 bg-white">
          <ul class="list-unstyled ps-0">
            <li class="mb-1">
              <button
                class="btn align-items-center rounded collapsed sidebarbutton"
                data-bs-toggle="collapse"
                data-bs-target="#home-collapse"
                aria-expanded="true"
              >
                <img src={imageURL + "Group 67.png"} /> Other
                <img src={imageURL + "chevron-down.png"} />
              </button>
              <div class="collapse show" id="home-collapse">
                <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  <li>
                    <Link to="/holidays" class="link-dark rounded">
                      Holidays
                    </Link>
                  </li>
                  {/*<li>
                    <Link to="/notice-board" class="link-dark rounded">
                      Notice Board
                    </Link>
                  </li>*/}
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Sidenav;
