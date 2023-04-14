import React, { useEffect, useState } from "react";
import { GetEmployees , GetEmployeeReportTo, getAllReportTo, EditEmployeeProfile} from "../API/Employee";

import { useParams, Link, useNavigate } from "react-router-dom";
import Sidenav from "../components/sidenav/Sidenav";
import EditableInput from "../components/elements/EditableInput";
import MultiSelectBox from "../components/elements/MultiSelectBox";
import {GetDesignation} from "../API/Designation"
import { GetAllBank, GetBankById } from "../API/Bank";
import { GetInventoryByEmpId } from "../API/Inventory";
import {GetRole} from "../API/Role"


const EditProfile = () => {
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [reportToPersons, setReportToPersons] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [inventory, setInventory] = useState({});
  const [designations, setDesignations] = useState([]);
  const [roles, setRoles] = useState([]);
  const [allBank, setAllBank] = useState([]);
  const [joining_date, setjoining_date] = useState({})
  const [reg_year, setreg_year] = useState("")
  const [emp_dob, setemp_dob] = useState({})
  const [selectedMultiItems, setSelectedMultiItems] = useState([]);
  const [selectOptions, setSelectOptions] = useState([]);  
  const [selectOptionsDefault, setSelectOptionsDefault] = useState([])
  const [roleSlug, setRoleSlug] = useState(localStorage.getItem('role_slug') )
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  let login_id = { id: localStorage.getItem('id') };
  let login_role = { role_slug: localStorage.getItem('role_slug') };
  let emp_id = { emp_id: id };
  let newdata = { ...login_role, ...login_id, ...emp_id };
  let imageURL = localStorage.getItem("homeURL") + "/images/";



    
  useEffect(async() => {
    try{
      // call all API's
      apiCalls()

      // set joining date
      let joining_date = new Date(selectedEmployee.joining_date)
      joining_date = joining_date.toLocaleDateString('en-CA')
      setjoining_date(joining_date)
      
      // set EOBI reg date
      let reg_year = selectedEmployee.reg_year ? new Date("1" + "-" + "Jan" + "-" + selectedEmployee.reg_year) : new Date()
      reg_year = reg_year.toLocaleDateString('en-CA')
      setreg_year(reg_year)

      // set date of birth
      let emp_dob = new Date(selectedEmployee.emp_dob)      
      emp_dob = emp_dob.toLocaleDateString('en-CA')
      setemp_dob(emp_dob)
      
      // Loader Delay
      setTimeout((e) => {
        setLoading(false);
      }, 250);

    }
    catch(e) {
      setLoading(false);
    }
    
  }, [selectedEmployee.joining_date!=undefined && selectedEmployee.emp_dob != undefined ])



    // API Calls
    const apiCalls = async ()=> {
      try {
        
        // API call designation
        GetDesignation(newdata).then((resp)=>{
          setDesignations(resp.data);           
        });  
  
        // API call role
        GetRole(newdata).then((resp)=>{
          setRoles(resp.data);           
        });  
              
        // API call bank
        GetAllBank(newdata).then((resp)=>{
          setAllBank(resp.data);           
        });  
  
        // API call employee profile
        GetEmployees(newdata).then((resp)=>{
          //resp.data.teamlead_id=0
          setSelectedEmployee(resp.data);                                   
        });
                    
        // API call get all report to
        getAllReportTo(newdata).then((resp)=>{
          let opt = []
          resp.data.map((item)=>{
            let it = {value: item.emp_id, label: item.first_name + " " + item.last_name}
            opt.push(it)
          })
          setSelectOptions(opt)
        });
        
        // API call get employee report to
        newdata = {...newdata, ids: selectedEmployee.emp_report_to}
        console.log(newdata)
        GetEmployeeReportTo(newdata).then((resp)=>{        
          let opt = []
          resp.data.map((item)=>{
            let it = {value: item.emp_id, label: item.first_name + " " + item.last_name}
            opt.push(it)
            setSelectOptionsDefault(opt)
          })      
        });
  
        // API call get employee inventory
        GetInventoryByEmpId(newdata).then((resp)=>{
          setInventory(resp.data) 
        });
        
      } catch (e) {
        console.error(e);
      }
    };

   
   

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
  

  const inventoryField = "emp_id, computer, brand, spec, serial_no, hdd, keyboard, mouse, laptopbag, screen, accessories";
  
  let profile_pic = ""
  if(selectedEmployee.emp_pic) {
    profile_pic = selectedEmployee.emp_pic.replace("-l","-s")
  } else {
    profile_pic = selectedEmployee.gender + ".png"
  }

  // handle editable input value
  const handleChangeEditableInput = data => {
    if(inventoryField.includes(data.key)) {
      inventory[data.key] = data.value;
      selectedEmployee["inventory"] = {...inventory}
    } else {
      selectedEmployee[data.key] = data.value;
    }    
    setEditing(true);
  };
    
  // handle change select
  const handleChangeSelect = event => {
    if(inventoryField.includes(event.target.name)) {
      inventory[event.target.name] = event.target.value;
      selectedEmployee["inventory"] = {...inventory}
    } else {
      selectedEmployee[event.target.name] = event.target.value;
    }    
    setEditing(true);    
  };
  
  // handle change date
  const handleChangeDate = event => {
    let dd = new Date(event.target.value)
    dd = dd.toLocaleDateString('en-CA')    
    selectedEmployee[event.target.name] = event.target.value;
    if(event.target.name == "joining_date") setjoining_date(dd)
    if(event.target.name == "reg_year") setreg_year(dd)   
    if(event.target.name == "emp_dob") setemp_dob(dd) 
    setEditing(true);
  };
    
  // handle save
  const handleSave = async event => {
    let ddata = {id: selectedEmployee.emp_id, user_role: login_role.role_slug, ...selectedEmployee}
    EditEmployeeProfile(ddata).then(r=>{        
      navigate("/employee-profile/" + id)      
    })     
  };

  
  // handle on change multi select
  const handleChangeMultiSelect = data => {
    setEditing(true)

    let list_report_to = ""
    selectedMultiItems.map((e, index)=>{
      if(index == 0) list_report_to = e.value
      else list_report_to += "," + e.value
    })
    if(!editing && selectedMultiItems && selectedMultiItems.length > 0) {
      setEditing(true);
    }
    selectedEmployee["report_to"] = list_report_to      
  };



    // On change multiselect set report_to
    
  
  
  
  
  
  return ( selectedEmployee.first_name != undefined && selectedEmployee.desig_title != undefined &&
    <>
      <Sidenav />
      <section className="col-lg-10 InnerContent">
        <article className="breadcrumbs pt-4" id="breadCrumbs">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-6 col-sm-5 col-5 breadcrumbContent">
                <h2>Employee Profile </h2>

                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li> 
                    <li className="breadcrumb-item active" aria-current="page">
                      Profile
                    </li>                    
                  </ol>
                </nav>
              </div>
              <div className="col-lg-5 col-md-6 col-sm-7 col-7 d-flex menuButton text-end">                
                {editing ?
                  <a className="btn btn-secondary employee mx-1"  onClick={handleSave }>
                    <i className="fa fa-check"></i> Save Details
                  </a>
                  :
                  <a className="btn btn-secondary employee mx-1 disabled" aria-disabled>
                    <i className="fa fa-check"></i> Save Details
                  </a>}
                <Link className="btn btn-secondary bg-danger employee" to={"/employee-profile/" + id }>
                  <i className="fa fa-times"></i> Cancel
                </Link>                
              </div>
            </div>
          </div>
        </article>

        <section id="employeeProfile">
          <article>
            <div className="container">
              <div className="row">
                <div className="col-lg-12 " id="employeeInfo">
                  <div className="row">
                    <div className="col-lg-5 col-md-6 col-sm-12 col-12 personalInfo">
                      <div className="d-flex profileInfo">
                        <div className="flex-shrink-0">
                          <img
                            src={imageURL + profile_pic}
                            className="img-fluid"
                            alt="..."
                          />
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h3 className="mt-0">                                                        
                            <EditableInput width="45%" name="first_name" text={selectedEmployee.first_name} handleChangeEditableInput={handleChangeEditableInput} /> 
                            &nbsp; <EditableInput width="49%" name="last_name" text={selectedEmployee.last_name} handleChangeEditableInput={handleChangeEditableInput} /> 
                          </h3>
                          <span> 
                            <select name="desig_id" className="my-1 border-0 w-75" onChange={handleChangeSelect}>
                              <option value="" selected>Choose Designation...</option>
                              {designations.map(item=>(
                                <option value={item.desig_id} selected={selectedEmployee.desig_id == item.desig_id ? true : false}>{item.desig_title}</option>
                              ))}
                            </select>
                          </span>
                          <strong>
                            Employee ID: <EditableInput width="120px" name="emp_number" text={selectedEmployee.emp_number} handleChangeEditableInput={handleChangeEditableInput} /> 
                          </strong>
                          <p class="mt-3">
                            Date of Join: <input type="date" name="joining_date" className="mx-auto border-0 mx-2" value={joining_date} onChange={handleChangeDate} />
                          </p>
                          <p>
                            <select name="role_id" className="mt-2 border-0 w-75" onChange={handleChangeSelect}>
                              <option value="0" selected>Choose Role...</option>
                              {roles.map(item=>(
                                <option value={item.role_id} selected={selectedEmployee.role_id == item.role_id ? true : false}>{item.role_title}</option>
                              ))}
                            </select>
                          </p>                              
                          
                          {
                            selectedEmployee.role_slug == "super_admin" || selectedEmployee.role_slug == "team_lead"
                            ?
                            ''
                            : 
                            <>                             
                              <p>
                                <select name="teamlead_id" className="mt-2 border-0 w-75" onChange={handleChangeSelect}>
                                  <option value="0" selected>Choose Team Lead...</option>
                                  {selectOptions.map(item=>(
                                    <option value={item.value} selected={selectedEmployee.teamlead_id == item.value ? true : false}>{item.label}</option>
                                  ))}
                                </select>
                              </p>                                                            
                            </>
                          }   
                          
                        </div>                        
                      </div>
                    </div>
                    <div className="col-lg-7 col-md-6 col-sm-12 col-12 bioInfo position-relative">
                      <div className="d-flex">
                        <div className="w-25 d-inline-block">
                          <div className="sub">Phone:</div>
                          <div className="sub">Email:</div>
                          <div className="sub">Birthday:</div>
                          <div className="sub">Address:</div>
                          <div className="sub">Gender:</div>
                          <div className="sub">Report to:</div>
                        </div>
                        <div className="w-75 d-inline-block">
                          <div className="contactInfo">
                            <EditableInput name="emp_mobile" text={selectedEmployee.emp_mobile} handleChangeEditableInput={handleChangeEditableInput} /> 
                          </div>
                          <div className="contactInfo">
                            <EditableInput name="emp_email" text={selectedEmployee.emp_email} handleChangeEditableInput={handleChangeEditableInput} /> 
                          </div>
                          <div className="contactInfo">
                            <input type="date" name="emp_dob" className="contactInfo border-0" value={emp_dob} onChange={handleChangeDate} />
                          </div>
                          <div className="adressInfo">
                            <EditableInput name="emp_address1" text={selectedEmployee.emp_address1} handleChangeEditableInput={handleChangeEditableInput} /> 
                          </div>                          
                          <div className="adressInfo">
                            <select name="gender" className="adressInfo border-0" onChange={handleChangeSelect}>
                              <option value="" selected>Choose Gender...</option>
                              <option value="Male" selected={selectedEmployee.gender == "Male" ? true : false}>Male</option>   
                              <option value="Female" selected={selectedEmployee.gender == "Female" ? true : false}>Female</option>
                              <option value="Other" selected={selectedEmployee.gender == "Other" ? true : false}>Other</option>                             
                            </select>
                          </div>
                          <div className="contactInfo mb-2">
                            <MultiSelectBox options={selectOptions} setSelectedMultiItems={setSelectedMultiItems} selectOptionsDefault={selectOptionsDefault} onChange={handleChangeMultiSelect}  />
                          </div>
                        </div>
                      </div>
                      <button>
                        <img src={imageURL + "edit_icon.png"} alt="" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article id="employeeTabs">
            <div className="container">
              <div className="row">
                <div className="col-12 employeeTabInfo ">
                  <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
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
                
                  <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
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
                <div className="col-12">
                  <div className="tab-content" id="myTabContent">
                    <div
                      className="tab-pane fade show active"
                      id="Profile"
                      role="tabpanel"
                      aria-labelledby="Profile-tab"
                    >
                      <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-12 employeePersonalInfo">
                          <div className="tabContents">
                            <h2>Personal Informations</h2>
                            <div className="w-50 d-inline-block">
                              <div className="sub">ID No.</div>
                              <div className="sub">Tel</div>
                              <div className="sub">Marital Status</div>
                              <div className="sub">Employment of spouse</div>
                            </div>
                            <div className="w-50 d-inline-block">
                              <div className="contactInfo">
                                {selectedEmployee.emp_cnic && <EditableInput name="emp_cnic" text={selectedEmployee.emp_cnic} handleChangeEditableInput={handleChangeEditableInput} /> }
                              </div>
                              <div className="contactInfo">
                                {selectedEmployee.emp_mobile && <EditableInput name="emp_mobile" text={selectedEmployee.emp_mobile} handleChangeEditableInput={handleChangeEditableInput} /> }
                              </div>
                              <div className="contactInfo">
                                <select name="marital_status" className="contactInfo border-0 w-75" onChange={handleChangeSelect}>
                                  <option value="" selected>Choose...</option>
                                  <option value="Single" selected={selectedEmployee.marital_status == "Single" ? true : false}>Single</option>
                                  <option value="Married" selected={selectedEmployee.marital_status == "Married" ? true : false}>Married</option>                             
                                  <option value="Divorced" selected={selectedEmployee.marital_status == "Divorced" ? true : false}>Divorced</option>
                                  <option value="Windowed" selected={selectedEmployee.marital_status == "Windowed" ? true : false}>Windowed</option>                                     
                                </select>
                              </div>
                              <div className="contactInfo">
                                <select name="employment_of_spouse" className="contactInfo border-0 w-75" onChange={handleChangeSelect}>
                                  <option value="" selected>Choose...</option>                                  
                                  <option value="1" selected={selectedEmployee.employment_of_spouse ? true : false}>Yes</option>                             
                                  <option value="0" selected={!selectedEmployee.employment_of_spouse ? true : false}>No</option>   
                                </select>
  
                              </div>
                            </div>
                            <button className="editButton">
                              <img src={imageURL + "edit_icon.png"} alt="" />
                            </button>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                          <div className="tabContents">
                            <h2>Emergency Contact</h2>
                            <div className="emergencyInfo">
                              <div className="w-50 d-inline-block ">
                                <div className="sub">Primary Name</div>
                                <div className="sub">Relationship</div>
                                <div className="sub">Phone</div>
                              </div>
                              <div className="w-25 d-inline-block">
                                <div className="contactInfo">
                                  <EditableInput width="170px" name="primary_name" text={selectedEmployee.primary_name} handleChangeEditableInput={handleChangeEditableInput} /> 
                                </div>
                                <div className="contactInfo">
                                  <EditableInput width="170px" name="primary_relation" text={selectedEmployee.primary_relation} handleChangeEditableInput={handleChangeEditableInput} /> 
                                </div>
                                <div className="contactInfo">
                                  <EditableInput width="170px" name="primary_phone" text={selectedEmployee.primary_phone} handleChangeEditableInput={handleChangeEditableInput} /> 
                                </div>
                              </div>
                            </div>
                            <div className="secondaryinfo w-100">
                              <div className="w-50 d-inline-block">
                                <div className="sub">Secondary Name</div>
                                <div className="sub">Relationship</div>
                                <div className="sub">Phone</div>
                              </div>
                              <div className="w-25 d-inline-block">
                                <div className="contactInfo">
                                  <EditableInput width="170px" name="secondary_name" text={selectedEmployee.secondary_name} handleChangeEditableInput={handleChangeEditableInput} />
                                </div>
                                <div className="contactInfo">
                                  <EditableInput width="170px" name="secondary_relation" text={selectedEmployee.secondary_relation} handleChangeEditableInput={handleChangeEditableInput} />
                                </div>
                                <div className="contactInfo">
                                  <EditableInput width="170px" name="secondary_phone" text={selectedEmployee.secondary_phone} handleChangeEditableInput={handleChangeEditableInput} />
                                </div>
                              </div>
                            </div>
                            <button className="editButton">
                              <img src={imageURL + "edit_icon.png"} alt="" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="Bank"
                      role="tabpanel"
                      aria-labelledby="Bank-tab"
                    >
                      <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-12 ">
                          <div className="tabContents">
                            <h2>EOBI registration information</h2>
                            <div className="w-50 d-inline-block">
                              <div className="sub">Registration status</div>
                              <div className="sub">Registration No</div>
                              <div className="sub">Registration year</div>
                            </div>
                            <div className="w-50 d-inline-block">
                              <div className="contactInfo">
                                {!selectedEmployee.eobi_number
                                  ? "Yes"
                                  : "N/A"}                      
                              </div>
                              <div className="contactInfo">
                                <EditableInput name="eobi_number" text={selectedEmployee.eobi_number} handleChangeEditableInput={handleChangeEditableInput} />
                              </div>
                              <div className="contactInfo">
                                <input type="date" name="reg_year" value={reg_year} className="border-0" onChange={handleChangeDate} />
                              </div>
                            </div>
                            <button className="editButton">
                              <img src={imageURL + "edit_icon.png"} alt="" />
                            </button>
                          </div>

                          <div className="tabContents">
                            <h2>Bank Account Details</h2>
                            <select name="bank_id" className="contactInfo my-1 p-2 border-0" onChange={handleChangeSelect}>
                                <option value="0" selected>Choose Bank...</option>
                                {allBank.map(item=>(
                                  <option value={item.bank_id} selected={selectedEmployee.bank_id == item.bank_id ? true : false}>{item.bank_name} {item.bank_branch}, {item.bank_address} </option>
                                ))}
                              </select>
                            
                            <button className="editButton">
                              <img src={imageURL + "edit_icon.png"} alt="" />
                            </button>
                          </div>

                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 col-12 inventory mb-5">
                          <div className="tabContents">
                            <h2>Inventory in use</h2>
                            <div>                           
                              <div className="w-100 d-inline-block">
                                <div className="sub ">
                                  <span className="border-bottom border-secondary pb-1">Computer</span> 
                                  <div className="contactInfo "> 
                                    <EditableInput name="computer" text={inventory.computer} handleChangeEditableInput={handleChangeEditableInput} />
                                  </div>
                                </div>
                                <div className="sub">
                                  <span className="border-bottom border-secondary pb-1">Serial number</span> 
                                  <div className="contactInfo">
                                    <EditableInput name="serial_no" text={inventory.serial_no} handleChangeEditableInput={handleChangeEditableInput} />
                                  </div>
                                </div>
                                <div className="sub">
                                  <span className="border-bottom border-secondary pb-1">Spec</span> 
                                  <div className="contactInfo">
                                    <EditableInput name="spec" text={inventory.spec} handleChangeEditableInput={handleChangeEditableInput} />
                                  </div>
                                </div>
                                <div className="sub">
                                  <span className="border-bottom border-secondary pb-1">Hard drive</span> 
                                  <div className="contactInfo">
                                    <EditableInput name="hdd" text={inventory.hdd} handleChangeEditableInput={handleChangeEditableInput} />
                                  </div>
                                </div>
                                <div className="sub">
                                  <span className="border-bottom border-secondary pb-1">External keyboard</span> 
                                  <div className="contactInfo">
                                    <EditableInput name="keyboard" text={inventory.keyboard} handleChangeEditableInput={handleChangeEditableInput} />
                                  </div>
                                </div>
                                <div className="sub">
                                  <span className="border-bottom border-secondary pb-1">Mouse</span> 
                                  <div className="contactInfo">
                                    <select name="mouse" className="contactInfo border-0" onChange={handleChangeSelect}>
                                      <option value="" selected>Choose...</option>                                  
                                      <option value="Yes" selected={inventory.mouse == "Yes" ? true : false}>Yes</option>                             
                                      <option value="No" selected={!inventory.mouse == "No" ? true : false}>No</option>   
                                    </select>
                                  </div>
                                </div>
                                <div className="sub">
                                  <span className="border-bottom border-secondary pb-1">Laptop Bag</span> 
                                  <div className="contactInfo">
                                    <select name="laptopbag" className="contactInfo border-0" onChange={handleChangeSelect}>
                                      <option value="" selected>Choose...</option>                                  
                                      <option value="Yes" selected={inventory.laptopbag == "Yes" ? true : false}>Yes</option>                             
                                      <option value="No" selected={!inventory.laptopbag == "No" ? true : false}>No</option>   
                                    </select>
                                  </div>
                                </div>
                                <div className="sub">
                                  <span className="border-bottom border-secondary pb-1">External Screen:</span> 
                                  <div className="contactInfo">
                                    <select name="screen" className="contactInfo border-0" onChange={handleChangeSelect}>
                                      <option value="" selected>Choose...</option>                                  
                                      <option value="Yes" selected={inventory.screen == "Yes" ? true : false}>Yes</option>                             
                                      <option value="No" selected={!inventory.screen == "No" ? true : false}>No</option>   
                                    </select>
                                  </div>
                                </div>
                                <div className="sub">
                                  <span className="border-bottom border-secondary pb-1">Other Accessories</span> 
                                  <div className="contactInfo">
                                    <select name="accessories" className="contactInfo border-0" onChange={handleChangeSelect}>
                                      <option value="" selected>Choose...</option>                                  
                                      <option value="Yes" selected={inventory.accessories == "Yes" ? true : false}>Yes</option>                             
                                      <option value="No" selected={!inventory.accessories == "No" ? true : false}>No</option>   
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div className="w-25 d-inline-block Cinfo">
                                <div className="contactInfo">
                                
                                </div>
                                
                                
                              </div>
                            </div>
                            <button className="editButton">
                              <img src={imageURL + "edit_icon.png"} alt="" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>
      </section>
    </>
  )

  
};

export default EditProfile;




