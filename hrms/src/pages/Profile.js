import React, { useEffect, useState } from "react";
import { GetEmployees , getReportToByID, AcceptEmployeeResignation} from "../API/Employee";
import { GetInventoryByEmpId } from "../API/Inventory";
import { DeleteEmployeeById } from "../API/Settings"
import { GetAllBank } from "../API/Bank";

import { useParams, Link, useNavigate } from "react-router-dom";
import Sidenav from "../components/sidenav/Sidenav";

const Profile = () => {
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [reportToPersons, setReportToPersons] = useState({});
  const [loading, setLoading] = useState(true);
  const [doneSuccess, setDoneSuccess] = useState(false);
  const [doneFail, setDoneFail] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState("");  
  const [messageCancelYes, setMessageCancelYes] = useState("");  
  const [showDialog, setShowDialog] = useState(false);  
  const [inventory, setInventory] = useState({});
  const [seelctedBank, setSeelctedBank] = useState({});  
  const [roleSlug, setRoleSlug] = useState(localStorage.getItem('role_slug'))
  const [resignationDate, setResignationDate] = useState("")  
  const { id } = useParams(); 
  const navigate = useNavigate();
  

  let login_id = { id: localStorage.getItem('id') };
  let login_role = { role_slug: localStorage.getItem('role_slug') };
  let emp_id = { emp_id: id };
  let newdata = { ...login_role, ...login_id, ...emp_id };
  let imageURL = localStorage.getItem("homeURL") + "/images/";
  const month =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]


  useEffect(async () => {          
    try {            
      // API call get employee profile
      let emp = await GetEmployees(newdata)      
      setSelectedEmployee(emp.data);  
      setResignationDate(emp.data.resign_date)     

      // API call get inventory
      let inv = await GetInventoryByEmpId(newdata)      
      setInventory(inv.data)
      
      // Get report to persons
      let reportto = []
      if(emp.data.report_to) {
        const ids = emp.data.report_to.split(",")
        for(let i=0; i<ids.length; i++) {
          let rep = await getReportToByID({id:ids[i]})
          reportto.push(rep.data)
          setReportToPersons(reportto)          
        }        
      }   

      // Loader Delay
      setTimeout(() => {
        setLoading(false);
      }, 250);

    } catch(e) {
      setSelectedEmployee([])      
      setReportToPersons([]) 
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


  ///////////////// *** Delete Employee Section


  // Handle dialog
  const handleDialog = async (event) => {
    // set values
    setMessage({title:"Delete User?", mesg:"Are you sure you want to delete \"User\" permenently? This will erase all data related to the User!"})
    setShowDialog(true)
    
    // create timer
    timeInterval = setInterval(timerFunction, 100);    
  } 

  // Timer function
  let timeInterval = null;
  const timerFunction = () => {
    if(!showDialog) clearInterval(timeInterval)
  }

  // Handle cancel
  const handleCancel = () => {
    setShowDialog(false)
    setConfirm(false)
  }

  // Handle cancel
  const handleConfirm = () => {
    setConfirm(true)
  }

  // handle clear attendance
  const handleDeleteEmployee = () => {
    DeleteEmployeeById({emp_id: id,role_slug: roleSlug}).then(r=>{
      setShowDialog(false)
      setConfirm(false)
      if(r.data.status == 200) {
        // set message dialog
        setDoneSuccess(true)
        setMessageCancelYes("User and all its data are deleted successfully.")          
        
        setTimeout(() => {            
          setDoneSuccess(false)
          setMessageCancelYes("")
          navigate("/employees", true)
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


  // handle resignation
  const handleResignation = data => {
    let dat = new Date()
    let dat_str = ""
    if(resignationDate == ""){
      dat_str = dat.getFullYear() + "-" + (dat.getMonth() + 1) + "-" + dat.getDate()
    }
    let ddata = {emp_id: selectedEmployee.emp_id, role_slug: roleSlug, resign_date: dat_str}

    // API call resignation
    AcceptEmployeeResignation(ddata).then((resp)=>{      
      if(resp.data.status == 200) {
        // API call employee profile
        GetEmployees(newdata).then((resp)=>{
          resp.data.teamlead_id=0
          setSelectedEmployee(resp.data);                   
          setResignationDate(resp.data.resign_date)
        });
      }
    });    
  };
  


  let reportToText = ""
  if(reportToPersons.length) {
    for(let i=0; i<reportToPersons.length; i++) {
      if(reportToText) {
        reportToText += " / " + reportToPersons[i].first_name + " " + reportToPersons[i].last_name
      } else {
        reportToText += reportToPersons[i].first_name + " " + reportToPersons[i].last_name
      }
    }    
  }

  
  let profile_pic = ""
  if(selectedEmployee.emp_pic) {
    profile_pic = selectedEmployee.emp_pic.replace("-l","-s")
  } else {
    profile_pic = selectedEmployee.gender + ".png"
  }


  let date_of_birth = selectedEmployee.emp_dob.split("/")
  date_of_birth = new Date(date_of_birth[2] + "-" + date_of_birth[1] + "-" + date_of_birth[0])
  


  return (
    <>
      <Sidenav />
      <section class="col-lg-10 InnerContent">
        <article class="breadcrumbs pt-4" id="breadCrumbs">
          <div class="container">
            <div class="row">
              <div class="col-lg-7 col-md-6 col-sm-5 col-5 breadcrumbContent">
                <h2>Employee Profile </h2>

                <nav aria-label="breadcrumb">
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                      Profile
                    </li>                    
                  </ol>
                </nav>
              </div>
              <div class="col-lg-5 col-md-6 col-sm-7 col-7 menuButton text-end">                
                {
                  (roleSlug == "super_admin" || roleSlug == "administrator" || roleSlug == "manager") &&
                  <Link class="btn btn-secondary employee" to={"/edit-employee-profile/" + id }>
                    <i class="fa fa-edit"></i> Edit Details
                  </Link>
                }
              </div>
            </div>
          </div>
        </article>

        <section id="employeeProfile">
          <article>
            <div class="container">
              <div class="row">
                <div class="col-lg-12 " id="employeeInfo">
                  <div class="row">
                    <div class="col-lg-5 col-md-6 col-sm-12 col-12 personalInfo">
                      <div class="d-flex profileInfo">
                        <div class="flex-shrink-0">
                          <img
                            src={imageURL +  profile_pic}
                            class="img-fluid"
                            alt="..."
                          />
                        </div>
                        <div class="flex-grow-1 ms-3">
                          <h3 class="mt-0">
                            {selectedEmployee.first_name +
                              " " +
                              selectedEmployee.last_name}
                          </h3>
                          <span>{selectedEmployee.desig_title}</span>
                          <strong>
                            Employee ID: {selectedEmployee.emp_number}
                          </strong>
                          <p>Date of Join: {selectedEmployee.joining_date}</p>
                          
                          {(roleSlug == "super_admin" || roleSlug == "administrator") && <button type="button" onClick={handleDialog} class="btn btn-primary button-template bg-danger"><i class="fa fa-times"></i> Delete User</button>}
                          {
                            (roleSlug == "super_admin" || roleSlug == "administrator") &&
                            <>
                              {
                                resignationDate == ""
                                ?
                                <button className="btn btn-primary button-template bg-danger mt-3" onClick={handleResignation}><i className="fa fa-check"></i> Accept Resignation</button>
                                :
                                <button className="btn btn-primary button-template bg-danger mt-3" onClick={handleResignation}><i className="fa fa-times"></i> Cancel Resignation</button>
                              }
                            </>
                          }
                          
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-7 col-md-6 col-sm-12 col-12 bioInfo position-relative">
                      <div className="d-flex">
                        <div class="w-25 d-inline-block">
                          <div class="sub">Phone:</div>
                          <div class="sub">Email:</div>
                          <div class="sub">Birthday:</div>
                          <div class="sub">Address:</div>
                          <div class="sub">Gender:</div>
                          <div class="sub">Report to:</div>
                        </div>
                        <div class="w-75 d-inline-block">
                          <div class="contactInfo">
                            {selectedEmployee.emp_mobile}
                          </div>
                          <div class="contactInfo">
                            {selectedEmployee.emp_email}
                          </div>
                          <div class="contactInfo">
                            {date_of_birth.getDate() + "-" + month[date_of_birth.getMonth()] + "-" + date_of_birth.getFullYear()}
                          </div>
                          <div class="adressInfo">
                            {selectedEmployee.emp_address1} 
                          </div>                          
                          <div class="adressInfo">
                            {selectedEmployee.gender}
                          </div>
                          <div class="contactInfo">
                            {reportToText ? reportToText : 'N/A'}                                        
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article id="employeeTabs">
            <div class="container">
              <div class="row">
                <div class="col-12 employeeTabInfo ">
                  <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                      <button
                        class="nav-link active"
                        id="Profile-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#Profile"
                        type="button"
                        role="tab"
                        aria-controls="Profile"
                        aria-selected="true"
                      >
                        Profile
                      </button>
                    </li>                    
                
                  <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    id="Bank-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#Bank"
                    type="button"
                    role="tab"
                    aria-controls="Bank"
                    aria-selected="false"
                  >
                    Bank & Statutory <span> (Admin Only)</span>
                  </button>
                </li>  
                    
                  </ul>
                </div>
                <div class="col-12">
                  <div class="tab-content" id="myTabContent">
                    <div
                      class="tab-pane fade show active"
                      id="Profile"
                      role="tabpanel"
                      aria-labelledby="Profile-tab"
                    >
                      <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-12 col-12 employeePersonalInfo">
                          <div class="tabContents">
                            <h2>Personal Informations</h2>
                            <div class="w-50 d-inline-block">
                              <div class="sub">ID No.</div>
                              <div class="sub">Tel</div>
                              <div class="sub">Marital Status</div>
                              <div class="sub">Employment of spouse</div>
                            </div>
                            <div class="w-50 d-inline-block">
                              <div class="contactInfo">
                                {selectedEmployee.emp_cnic}
                              </div>
                              <div class="contactInfo">
                                {selectedEmployee.emp_mobile}
                              </div>
                              <div class="contactInfo">
                                {selectedEmployee.marital_status}
                              </div>
                              <div class="contactInfo">
                                {selectedEmployee.employment_of_spouse == 0 ? "No" : "Yes"}
                              </div>
                            </div>
                            
                          </div>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                          <div class="tabContents">
                            <h2>Emergency Contact</h2>
                            <div class="emergencyInfo">
                              <div class="w-50 d-inline-block ">
                                <div class="sub">Primary Name</div>
                                <div class="sub">Relationship</div>
                                <div class="sub">Phone</div>
                              </div>
                              <div class="w-25 d-inline-block">
                                <div class="contactInfo">
                                  {!selectedEmployee.primary_name ? 'N/A' : selectedEmployee.primary_name}
                                </div>
                                <div class="contactInfo">
                                  {!selectedEmployee.primary_relation ? 'N/A' : selectedEmployee.primary_relation}
                                </div>
                                <div class="contactInfo">
                                  {" "}
                                  {!selectedEmployee.primary_phone ? 'N/A' : selectedEmployee.primary_phone}
                                </div>
                              </div>
                            </div>
                            <div class="secondaryinfo w-100">
                              <div class="w-50 d-inline-block">
                                <div class="sub">Secondary Name</div>
                                <div class="sub">Relationship</div>
                                <div class="sub">Phone</div>
                              </div>
                              <div class="w-25 d-inline-block">
                                <div class="contactInfo">
                                  {!selectedEmployee.secondary_name ? "N/A" : selectedEmployee.secondary_name}
                                </div>
                                <div class="contactInfo">
                                  {!selectedEmployee.secondary_relation ? "N/A" : selectedEmployee.secondary_relation}
                                </div>
                                <div class="contactInfo">
                                  {!selectedEmployee.secondary_phone ? "N/A" : selectedEmployee.secondary_phone}
                                </div>
                              </div>
                            </div>
                            
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="tab-pane fade"
                      id="Bank"
                      role="tabpanel"
                      aria-labelledby="Bank-tab"
                    >
                      <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-12 col-12 ">
                          <div class="tabContents">
                            <h2>EOBI registration information</h2>
                            <div class="w-50 d-inline-block">
                              <div class="sub">Registration status</div>
                              <div class="sub">Registration No</div>
                              <div class="sub">Registration year</div>
                            </div>
                            <div class="w-25 d-inline-block">
                              <div class="contactInfo">
                                {selectedEmployee.eobi_number != null
                                  ? "Yes"
                                  : "No"}
                              </div>
                              <div class="contactInfo">
                                {selectedEmployee.eobi_number != null ? "  " + selectedEmployee.eobi_number : "N/A"}
                              </div>
                              <div class="contactInfo">
                                {selectedEmployee.reg_year != null ? "  " + selectedEmployee.reg_year : "N/A"}
                              </div>
                            </div>
                            
                          </div>

                          <div class="tabContents">
                            <h2>Bank Account Details</h2>
                            <div class="w-50 d-inline-block">
                              <div class="sub">Bank Name</div>
                              <div class="sub">Account No</div>
                              <div class="sub">Bank Address</div>
                            </div>
                            <div class="w-50 d-inline-block">                              
                              <div class="contactInfo">
                                {selectedEmployee.bank_name != null && selectedEmployee.bank_name ? selectedEmployee.bank_name : "N/A"}
                              </div>
                              <div class="contactInfo">
                                {selectedEmployee.account_number != null && selectedEmployee.account_number ? selectedEmployee.account_number : "N/A"}
                              </div>
                              <div class="contactInfo">
                                {selectedEmployee.bank_address != null  && selectedEmployee.bank_address ? selectedEmployee.bank_address : "N/A"}
                              </div>
                            </div>
                            
                          </div>

                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-12 col-12 inventory mb-5">
                          <div class="tabContents">
                            <h2>Inventory in use</h2>
                            <div>

                           
                              <div class="w-100 d-inline-block">
                                <div class="sub "><span class="border-bottom border-secondary pb-1">Computer</span> <div class="contactInfo "> {inventory && inventory.computer ? inventory.computer : 'N/A'} </div></div>
                                <div class="sub"><span class="border-bottom border-secondary pb-1">Serial number</span> <div class="contactInfo">{inventory && inventory.serial_no ? inventory.serial_no : 'N/A'}</div></div>
                                <div class="sub"><span class="border-bottom border-secondary pb-1">Spec</span> <div class="contactInfo">{inventory && inventory.spec ? inventory.spec : 'N/A'}</div></div>
                                <div class="sub"><span class="border-bottom border-secondary pb-1">Hard drive</span> <div class="contactInfo">{inventory && inventory.hdd ? inventory.hdd : 'N/A'}</div></div>
                                <div class="sub"><span class="border-bottom border-secondary pb-1">External keyboard</span> <div class="contactInfo">{inventory && inventory.keyboard ? inventory.keyboard : 'N/A'}</div></div>
                                <div class="sub"><span class="border-bottom border-secondary pb-1">Mouse</span> <div class="contactInfo">{inventory && inventory.mouse ? inventory.mouse : 'N/A'}</div></div>
                                <div class="sub"><span class="border-bottom border-secondary pb-1">Laptop Bag</span> <div class="contactInfo">{inventory && inventory.laptopbag ? inventory.laptopbag : 'N/A'}</div></div>
                                <div class="sub"><span class="border-bottom border-secondary pb-1">External Screen:</span> <div class="contactInfo">{inventory && inventory.screen ? inventory.screen : 'N/A'}</div></div>
                                <div class="sub"><span class="border-bottom border-secondary pb-1">Other Accessories</span> <div class="contactInfo">{inventory && inventory.accessories ? inventory.accessories: 'N/A'}</div></div>
                              </div>
                              <div class="w-25 d-inline-block Cinfo">
                                <div class="contactInfo">
                                
                                </div>
                                
                                
                              </div>
                            </div>
                            
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {showDialog && <>
            <div class="modal fade in d-block confirmModal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="false" id="mi-modal">
              <div class="modal-dialog ">
                <div class="modal-content">
                  <div class="modal-header">
                    <button onClick={handleCancel} type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">{message.title}</h4>
                  </div>
                  <div class="modal-body">
                   <p>{message.mesg}</p>
                  </div>
                  <div class="modal-footer">
                    <button onClick={handleCancel} type="button" class="btn btn-default" id="modal-btn-cancel">Cancel</button>
                    {!confirm && <button onClick={handleConfirm} type="button" class="btn btn-danger" id="modal-btn-yes">Yes</button>}
                    
                    {confirm && <button onClick={handleDeleteEmployee} type="button" class="btn btn-danger" id="modal-btn-yes">Delete User</button>}
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
  )

  
};

export default Profile;
