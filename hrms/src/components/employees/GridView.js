import React from "react";
import { Link } from "react-router-dom";

const GridView = (props) => {

  let imageURL = localStorage.getItem("homeURL") + "/images/";

  return (
    <>
      <article id="ProfileCart">
        <div class="container">
          <div class="row">
            {props.employees.map((employee) => {

              let profile_pic = ""
              if(employee.emp_pic) {
                profile_pic = employee.emp_pic.replace("-l","-s")
              } else {
                profile_pic = employee.gender.toLowerCase() + ".png"
              }

              return (
                <div class="col-lg-3 col-md-4 col-sm-6 col-6">
                  <div class="sub position-relative my-2">
                    <Link to={`/employee-profile/${employee.emp_id}`}>
                      <img src={imageURL + profile_pic} class="img-fluid d-block mx-auto mt-2" alt="" />
                    </Link>
                    <Link to={`/employee-profile/${employee.emp_id}`}>
                      <h2> {employee.first_name + " " + employee.last_name}</h2>
                    </Link>
                    <p>{employee.desig_title}</p>
                    <button>
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>
              );
            })}

            {
              (!props.employees || props.employees.length ==0) &&
              <div class="alert alert-light text-center" role="alert">
                No records found.
              </div>
            }
          </div>
        </div>
      </article>
    </>
  );
};
const ViewTypehandler = (val, setViewType) => {
  setViewType(val);
};

export default GridView;
