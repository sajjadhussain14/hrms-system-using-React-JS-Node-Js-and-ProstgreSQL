import React from "react";
import { Link } from "react-router-dom";

const ListView = (props) => {

  let imageURL = localStorage.getItem("homeURL") + "/images/";
  
  return (
    <>
      <section id="AllEmployeeListView">
        <article id="innerListView">
          <div class="container">
            <div class="row">
              <div class="col-12 mt-4 table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Employee</th>
                      <th scope="col">NIC No.</th>
                      <th scope="col">NTN No.</th>
                      <th scope="col">Bank Account No.</th>
                      <th scope="col">Tel</th>
                      <th scope="col">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.employees.map((employee) => {

                      let profile_pic = ""
                      if(employee.emp_pic) profile_pic = employee.emp_pic.replace("-l","-s")
                      else profile_pic = "profile_pic.png"

                      if(employee.emp_pic) {
                        profile_pic = employee.emp_pic.replace("-l","-s")
                      } else {
                        profile_pic = employee.gender.toLowerCase() + ".png"
                      }

                      return (
                        <tr>
                          <td>
                            <h2 class="table-avatar">
                              <a href="##" class="avatar">
                                <img
                                  alt="employee "
                                  src= {imageURL + profile_pic}
                                />
                              </a>
                              <Link to={`/employee-profile/${employee.emp_id}`}>
                                {employee.first_name + " " + employee.last_name}
                                <span>{employee.emp_number}</span>

                                <span>{employee.desig_title}</span>
                              </Link>
                            </h2>
                          </td>
                          <td class="Anumber">
                            <span> {employee.emp_cnic}</span>
                          </td>
                          <td class="Anumber">
                            <span> {employee.emp_ntn}</span>
                          </td>
                          <td class="Anumber">
                            <span>{employee.account_number}</span>
                          </td>
                          <td class="contact">
                            <span> {employee.emp_mobile} </span>
                          </td>
                          <td class="contact">
                            <span> {employee.emp_email}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {
                  (!props.employees || props.employees.length ==0) &&
                  <div class="alert alert-light text-center" role="alert">
                    No records found.
                  </div>
                }
              </div>
            </div>
          </div>
        </article>
      </section>
    </>
  );
};

export default ListView;
