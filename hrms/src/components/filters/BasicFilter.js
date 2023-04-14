import React from "react";


const BasicFilter = (props) => {

  

  return (
    <>
      <section id="filter">
        <div class="container">
          <div class="row">
            <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-2">
              <input type="text" placeholder="Employee ID" name="emp_number" onChange={props.onChangeValue} />
            </div>
            <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-2">
              <input type="text" placeholder="Employee Name" name="name" onChange={props.onChangeValue}/>
            </div>
            <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-2">
              <select class="form-select" aria-label="Default select example" name="designation" onChange={props.onChangeValue}>
                <option selected value="">Select Designation</option>
                {props.designations.map(arg=>(
                   <option value={arg.desig_title}>{arg.desig_title}</option>   
                ))}
              </select>
            </div>
            <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-2">
              <select class="form-select" aria-label="Default select example" name="department" onChange={props.onChangeValue}>
                <option selected value="">Select Department</option>
                {props.departments.map(arg=>(
                   <option value={arg.dept_title}>{arg.dept_title}</option>   
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BasicFilter;
