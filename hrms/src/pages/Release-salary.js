import React, { useEffect, useState, useCallback } from "react";
import { GenerateSalarySlip4All, ReleaseSalarySlip4All, IsSalaryGeneratedReleased} from "../API/Payroll";
import { useParams, Link } from "react-router-dom";
import Sidenav from "../components/sidenav/Sidenav";


const ReleaseSalary = () => {

  const [formData, updateFormData] = React.useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = React.useState({year:0, month:0});
  const [salarySlipDate, setSalarySlipDate] = React.useState("");
  const [isDate, setIsDate] = React.useState(false);
  const [isGenerated, setIsGenerated] = React.useState(false);
  const [isReleased, setIsReleased] = React.useState(false);
  const [roleSlug, setRoleSlug] = useState(localStorage.getItem('role_slug'));
  const [doneSuccess, setDoneSuccess] = useState(false);
  const [doneFail, setDoneFail] = useState(false);
  const [message, setMessage] = useState("")
  const { id } = useParams();
  
  const month =["January","February","March","April","May","June","July","August","September","October","November","December"]
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thrusday","Friday","Saturday"]
  const role_array = ['super_admin', 'manager', 'administrator'];

  let login_id = { id: localStorage.getItem('id') };
  let login_role = { role_slug:  roleSlug};
  let emp_id = { emp_id: id ? id : localStorage.getItem('id') };
  let newdata = { ...login_role, ...login_id, ...emp_id };
  newdata = {...newdata, year: selectedDate.year, month: selectedDate.month, prepared_by: localStorage.getItem('id')}
  
  
  React.useEffect(() => {
   
    try{
      role_array.find((item)=>{if(roleSlug==item) {setRoleSlug("super_admin")}})   

      // Loader Delay
      setTimeout(() => {
        setLoading(false);
      }, 250);

    } catch(e){
      setLoading(false);
    }

  }, [roleSlug])  


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
  
  
  // handle on click generate
  const handleClickGenerateSlip = async (e) => {    
    if(isDate) {
        GenerateSalarySlip4All(newdata).then((resp2)=>{
            IsSalaryGeneratedReleased(newdata).then((resp)=>{        
                if(resp.data.is_released == 0 && resp.data.is_generated == 0) {
                    setIsGenerated(true)
                    setIsReleased(false)                    
                }
                else if(resp.data.is_released == 0 && resp.data.is_generated > 0) {
                    setIsGenerated(false)
                    setIsReleased(true)
                }
                else if(resp.data.is_released > 0 && resp.data.is_generated > 0) {
                    setIsGenerated(false)
                    setIsReleased(false)
                }                           
                
                if(resp.data.is_generated > 0) {
                  setDoneSuccess(true)
                  setMessage("Salary slips generated successfully.")
                  setTimeout(() => {
                    setDoneSuccess(false)
                    setMessage("")
                  }, 3000);
                } else {
                  setDoneFail(true)
                  setMessage("Salary slips couldn't be generated.")
                  setTimeout(() => {
                    setDoneSuccess(false)
                    setMessage("")
                  }, 3000);
                }
            }); 
        });         
    }
  };


  // handle on click release
  const handleClickReleaseSlip = async (e) => {    
    if(isDate) {
        ReleaseSalarySlip4All(newdata).then((resp)=>{
            IsSalaryGeneratedReleased(newdata).then((resp)=>{        
                if(resp.data.is_released == 0 && resp.data.is_generated == 0) {
                    setIsGenerated(true)
                    setIsReleased(false)
                }
                else if(resp.data.is_released == 0 && resp.data.is_generated > 0) {
                    setIsGenerated(false)
                    setIsReleased(true)
                }
                else if(resp.data.is_released > 0 && resp.data.is_generated > 0) {
                    setIsGenerated(false)
                    setIsReleased(false)
                }

                if(resp.data.is_released > 0) {
                  setDoneSuccess(true)
                  setMessage("Salary slips released successfully.")
                  setTimeout(() => {
                    setDoneSuccess(false)
                    setMessage("")
                  }, 3000);
                } else {
                  setDoneFail(true)
                  setMessage("Salary slips couldn't be released.")
                  setTimeout(() => {
                    setDoneSuccess(false)
                    setMessage("")
                  }, 3000);
                }
            }); 
        });         
    }
  };
    
  
  // handle on date change
  const handleChangeDate = (e) => {    
    let dd = selectedDate;
    if(e.target.name == "release_year") {
      dd.year = e.target.value;
      newdata.year = e.target.value;
    } else if(e.target.name == "release_month") {
      dd.month = e.target.value;
      newdata.month = e.target.value;
    }
    setSelectedDate(dd)

    if(dd.month && dd.year) {
      setIsDate(true)
    }   
        
    IsSalaryGeneratedReleased(newdata).then((resp)=>{                
      if(resp.data.is_released == 0 && resp.data.is_generated == 0) {
            setIsGenerated(true)
            setIsReleased(false)
        }
        else if(resp.data.is_released == 0 && resp.data.is_generated > 0) {
            setIsGenerated(false)
            setIsReleased(true)
        }
        else if(resp.data.is_released > 0 && resp.data.is_generated > 0) {
            setIsGenerated(false)
            setIsReleased(false)
        }
    }); 
  };

 
  let yearsList = [];
  let temp_dt = new Date();
  for(let i=temp_dt.getFullYear() - 10; i<=temp_dt.getFullYear() + 1; i++) {
    yearsList.push(i);
  }
  yearsList.reverse();

  return (
    <>
      <Sidenav />
      <section class="col-lg-10 InnerContent">
        <article class="breadcrumbs  pt-4" id="breadCrumbs">
          <div class="container">
            <div class="row">
              <div class="col-lg-7 col-md-6 col-sm-5 col-5 breadcrumbContent">
                <h2>Salary</h2>

                <nav aria-label="breadcrumb">
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Dashboard</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                      Release Salary
                    </li>
                  </ol>
                </nav>
              </div>
              
            </div>
          </div>
        </article>

        <article class="AttendancePunchIn">
          <div class="container">
            <div class="row">
              

              <div class="col-12 col-md-12">
                <div class="timesheet width text-center mb-4 w-100 d-flex flex-column align-items-center">
                  <p>
                    <strong>Generate Salary Slip /  Release Salary</strong>  {  }       
                  </p>
                  <div class="punchIn py-1 mb-2">  
                    <strong class="mb-2">Select Year and Month</strong>
                    {/*<input class="mt-2 mx-2 w-75" type="date" name="punch_date" id="punch_date" onChange={handleChangeDate} />*/}
                    
                    <select name="release_year" onChange={handleChangeDate}>
                      <option value="0">Choose Year</option>
                      {yearsList.map((data, index)=>(
                        <option value={data} selected={selectedDate.year == data ? true : false}>{data}</option>
                      ))}
                    </select>

                    <select name="release_month" className="mx-3" onChange={handleChangeDate}>
                      <option value="0">Choose Month</option>
                      {month.map((data, index)=>(
                        <option value={index+1} selected={selectedDate.month == index + 1 ? true : false}>{data}</option>
                      ))}
                    </select>
                  </div>
                  {!isDate && <div class="alert alert-warning p-1 m-0">Please select Year & Month to generate/release salary slip.</div>}
                  
                  <div class="col-12">
                  { !isGenerated 
                    ?                   
                    <button className="bg-success mt-2 mx-2 disabled">Generate Slip</button>
                    :
                    <button className="bg-success mt-2 mx-2" onClick={handleClickGenerateSlip}>Generate Slip</button>
                  }                  

                  { !isReleased 
                    ?
                    <button className="mt-2 mx-2 disabled">Release Salary</button>
                    :
                    <button className="mt-2 mx-2" onClick={handleClickReleaseSlip}>Release Salary</button>
                  }
                  </div>
                  <p class="text-start mt-3">
                    * Generate slip for selected month<br/>
                    ** Release salary after finalize changes to slips. Then slip is avaiable to user.
                  </p>
                  
                </div>                
              </div>
            </div>
          </div>
        </article>
        
        {(message && doneSuccess) && <div class="popupMessageBox alert alert-success alert-dismissible w-50" role="alert">
          {message}
          <a href="#">&times;</a>
        </div>}
        
        {(message && doneFail) && <div class="popupMessageBox alert alert-danger alert-dismissible w-50" role="alert">
          {message}
          <a href="#">&times;</a>
        </div>}
        
        
      </section>
    </>
  );
};

export default ReleaseSalary;
