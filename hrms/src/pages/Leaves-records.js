import React, { useEffect, useState } from "react";
import Sidenav from "../components/sidenav/Sidenav";
import { GetEmployees } from "../API/Employee";
import { UpdateLeave } from "../API/Leave";
import { Link } from "react-router-dom";

const LeavesRecords = () => {
  
  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleSlug, setRoleSlug] = useState(localStorage.getItem("role_slug"));
  const [leavesAlloted, setLeavesAlloted] = useState(0);
  const [leavesTotal, setLeavesTotal] = useState(0);
  const [leavesAvailed, setLeavesAvailed] = useState(0);
  const [leavesRemaining, setLeavesRemaining] = useState(0);
  const [empID, setEmpID] = useState();
  const [name, setName] = useState();
  const [doneSuccess, setDoneSuccess] = useState(false);
  const [doneFail, setDoneFail] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState("");  
  const [messageCancelYes, setMessageCancelYes] = useState("");  
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  let login_id = { id: localStorage.getItem('id') };
  let login_role = { role_slug: localStorage.getItem('role_slug')};
  let newdata = { ...login_role, ...login_id };
  let imageURL = localStorage.getItem("homeURL") + "/images/";
  let roleArray = ["super_admin","administrator","team_lead"]

  useEffect(async () => {
    try {      
      // API CALL leaves
      let leaves = await GetEmployees(newdata);
      setEmployeeLeaves(leaves.data.profile);
            
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



  ///////////////// *** Update Leaves Dialog Section


  // Handle dialog
  const handleEditDialog = async (event) => {
    // set values
    setShowEditDialog(true)
    setEmpID(event.emp_id)
    setName(event.name)
    setLeavesAlloted(event.alloted)
    setLeavesTotal(event.total)
    setLeavesAvailed(event.availed)
    setLeavesRemaining(event.remaining)

    // create timer
    timeEditInterval = setInterval(timerEditFunction, 100);    
  } 

  // Timer function
  let timeEditInterval = null;
  const timerEditFunction = () => {
    if(!showEditDialog) clearInterval(timeEditInterval)
  }

  // Handle cancel
  const handleCancel = () => {
    setShowEditDialog(false)    
  }

  // Handle change input
  const handleChangeInput = (e)=>{
    if(e.target.name == "leaves_total") {
      setLeavesTotal(e.target.value)
    } else if(e.target.name == "leaves_availed") {
      setLeavesAvailed(e.target.value)
    } else if(e.target.name == "leaves_remaining") {
      setLeavesRemaining(e.target.value)
    } else if(e.target.name == "leaves_alloted") {
      setLeavesAlloted(e.target.value)
    }

  }
  
  // Handle edit leaves
  const handleEditLeaves = async ()=>{
    let data = {role_slug: roleSlug, emp_id: empID, leaves_alloted:leavesAlloted, leaves_total:leavesTotal, leaves_availed: leavesAvailed, leaves_remaining: leavesRemaining}    
    UpdateLeave(data).then(r=>{
      setShowEditDialog(false)
      setConfirm(false)
      if(r.data.status == 200) {
        // set message dialog
        setDoneSuccess(true)
        setMessageCancelYes("Leaves record updated successfully.")  
        
        // Redraw leaves
        GetEmployees(newdata).then(r=>setEmployeeLeaves(r.data.profile))        
        
        setTimeout(() => {            
          setDoneSuccess(false)
          setMessageCancelYes("")
        }, 2000);
      } else {
        // set message dialog        
        setDoneFail(true)
        setMessageCancelYes(r.data.msg)          
        
        setTimeout(() => {            
          setDoneFail(false)
          setMessageCancelYes("")
        }, 2000);        
      }
    })
  }
  
  return (
    <>
      <Sidenav />
      <section class="col-lg-10 InnerContent">
        <article class="breadcrumbs pt-4" id="breadCrumbs">
          <div class="container">
            <div class="row">
              <div class="col-lg-7 col-md-6 col-sm-5 col-5 breadcrumbContent">
                <h2>Leave Records</h2>

                <nav aria-label="breadcrumb">
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Dashboard</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                      Leave Records
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
                <button class="employee">
                  <i class="fas fa-plus"></i>Add Employee
  </button>*/}
              </div>
            </div>
          </div>
        </article>

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
                    src="/images/calendar2-date.png"
                    class="img-fluid"
                    alt=""
                  />
                </a>
              </div>
              <div class="col-lg-3 col-md-3 col-sm-6 col-6 mb-2 position-relative">
                <input type="date" placeholder="To" />
                <a href="##">
                  <img
                    src="/images/calendar2-date.png"
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
        <section id="EmployeeLeave" class="employeeLeaveTable">
          <div class="container">
            <div class="row">
              <div class="col-12 mt-4 table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col" class="text-start">
                        Employee
                      </th>
                      <th scope="col">Alloted Leaves</th>
                      <th scope="col">Total Leaves</th>
                      <th scope="col">Availed Leaves</th>
                      <th scope="col">Remaining Leaves</th>
                      <th scope="col"></th>                      
                    </tr>
                  </thead>
                  <tbody>
                  
                  {employeeLeaves.map(employee=>(
                    <tr>
                      <td>
                        <h2 class="table-avatar">
                        <Link to={"/leaves-individual-details/" +employee.emp_id} class="avatar">
                            <img
                              alt="employee picture"
                              src={employee.emp_pic ? imageURL + employee.emp_pic.replace("-l","-s") : imageURL + employee.gender.toLowerCase() + ".png" }
                            />
                          </Link>
                          <Link to={"/leaves-individual-details/" +employee.emp_id}>
                          {employee.first_name} {employee.last_name}<span>{employee.desig_title}</span>
                          </Link>
                        </h2>
                      </td>
                      
                      <td class="Anumber">
                        <span>{employee.leaves_alloted}</span>
                      </td>
                      <td class="Anumber">
                        <span>{employee.leaves_total}</span>
                      </td>
                      <td class="Anumber">
                        <span> {employee.leaves_availed}</span>
                      </td>
                      <td class="Anumber">
                        <span>{employee.leaves_remaining}</span>
                      </td>
                      {<td class="text-center">
                       <span>
                          {roleArray.includes(roleSlug) && <button type="button" onClick={()=>handleEditDialog({emp_id: employee.emp_id,alloted: employee.leaves_alloted,total: employee.leaves_total, availed:employee.leaves_availed, remaining:employee.leaves_remaining, name: employee.first_name + " " + employee.last_name})} class="btn-edit border-0">
                            Edit
                          </button>}
                        </span>                        
                      </td>}
                    </tr>
                ))} 

                  </tbody>
                </table>
                
              </div>
            </div>
          </div>

          {showEditDialog && <>
            <div class="modal fade in d-block confirmModal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="false" id="mi-modal">
              <div class="modal-dialog ">
                <div class="modal-content">
                  <div class="modal-header">
                    <button onClick={handleCancel} type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">Edit Leaves Info</h4>
                  </div>
                  <div class="modal-body">
                      <div class="row">
                        <div class="form-group col-12 col-md-12 text-center">
                          <nav aria-label="breadcrumb">
                            <ol class="breadcrumb">
                              <li class="breadcrumb-item">
                                <a href="#">Leaves Detail</a>
                              </li>
                              <li class="breadcrumb-item active" aria-current="page">
                                {name}
                              </li>
                            </ol>
                          </nav>
                        </div>
                        <div class="form-group col-12 col-md-12 text-center">
                          <label for="leaves" >Alloted Leaves</label>
                          <input class="w-50" name="leaves_alloted" type="number" max={999} min={0} value={leavesAlloted} onChange={handleChangeInput} />
                        </div>
                        {<div class="form-group col-12 col-md-12 text-center">
                          <label for="leaves" >Total Leaves</label>
                          <input class="w-50" name="leaves_total" type="number" max={999} min={0} value={leavesTotal} onChange={handleChangeInput} />
                        </div>}
                        <div class="form-group col-12 col-md-12 text-center">
                          <label for="leaves">Availed Leaves</label>
                          <input class="w-50" name="leaves_availed" type="number" max={999} min={0} value={leavesAvailed} onChange={handleChangeInput} />
                        </div>
                        <div class="form-group col-12 col-md-12 text-center">
                          <label for="leaves">Remaining Leaves</label>
                          <input class="w-50" name="leaves_remaining" type="number" max={999} min={0} value={leavesRemaining} onChange={handleChangeInput} />
                        </div>
                      </div>
                  </div>
                  <div class="modal-footer">
                    <button onClick={handleCancel} type="button" class="btn btn-default" id="modal-btn-cancel">Cancel</button>
                    <button onClick={handleEditLeaves} type="button" class="btn btn-success" id="modal-btn-yes">Update Leaves</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="alert" role="alert" id="result"></div>
          </>}  

          {doneSuccess && <div class="popupMessageBox alert alert-success alert-dismissible w-50" role="alert">
            {doneSuccess && messageCancelYes}
            <a href="#">&times;</a>
          </div>}

          {doneFail && <div class="popupMessageBox alert alert-danger alert-dismissible w-50" role="alert">
            {doneFail && messageCancelYes}
            <a href="#">&times;</a>
          </div>}
          

        </section>
      </section>
    </>
  );
};

export default LeavesRecords;
