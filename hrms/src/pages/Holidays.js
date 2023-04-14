import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidenav from "../components/sidenav/Sidenav";
import { GetHolidays, AddHoliday, DeleteHoliday } from "../API/Holiday";
import EditableInput from "../components/elements/EditableInput";

const Holidays = () => {

  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doneSuccess, setDoneSuccess] = useState(false);
  const [doneFail, setDoneFail] = useState(false);  
  const [message, setMessage] = useState("");  
  const [messageCancelYes, setMessageCancelYes] = useState("");  
  const [showDialog, setShowDialog] = useState(false);
  const [holidayID, setHolidayID] = useState(0);
  const [roleSlug, setRoleSlug] = useState(localStorage.getItem("role_slug"));
  const [selectedHoliday, setSelectedHoliday] = useState({holiday_title:"Input your text", holiday_day:0, holiday_month:0, no_of_days:1});
  const month =["January","February","March","April","May","June","July","August","September","October","November","December"]
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thrusday","Friday","Saturday"]
  const roleArray = ["super_admin","administrator","manager"]
  


  useEffect(async () => {          
    try {            
      
      // API calls
      apiCalls();
                
      // Loader Delay
      setTimeout(() => {
        setLoading(false);
      }, 250);

    } catch(e) {
      setHolidays([])     
      setLoading(false);       
    }
  }, []);


  // All API
  const apiCalls = async => {
    // Get all holiday
    GetHolidays().then((r)=>setHolidays(r.data))           
  }


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
  
  
  // handle editable input value
  const handleChangeEditableInput = data => {
    let hday = selectedHoliday;
    hday[data.key] = data.value;    
    setSelectedHoliday(hday);   
     
  };

  // handle change select
  const handleChangeSelect = event => {
    let hday = selectedHoliday;
    hday[event.target.name] = event.target.value;    
    setSelectedHoliday(hday);    
  };


  // handle add record
  const handleAddRecord = async event => {
    if(selectedHoliday.holiday_title !="Input your text") {
      let data = {role_slug: roleSlug, ...selectedHoliday}
      AddHoliday(data).then(r=>{          
        if(r.data.status == 200) {          
          GetHolidays().then(r1=>setHolidays(r1.data))          
          // set message dialog
          setDoneSuccess(true)
          setMessageCancelYes("Holiday Record added successfully.")          
          setTimeout(() => {
            setDoneSuccess(false)
            setMessageCancelYes("")
          }, 3000);
        } else {
          // set message dialog
          setDoneFail(true)
          setMessageCancelYes(r.data.msg)          
          setTimeout(() => {
            setDoneFail(false)
            setMessageCancelYes("")
          }, 3000);
        }
      })
    } else {
       // set message dialog
       setDoneFail(true)
       setMessageCancelYes("Fields cannot be empty.")       
       setTimeout(() => {
         setDoneFail(false)
         setMessageCancelYes("")
       }, 3000);
    }  
  }


  // Handle dialog
  const handleDialog = async (event) => {
    // set values
    setMessage({title:"Delete", mesg:"Are you sure you want to delete Holiday record permenently?"})
    setShowDialog(true)
    setHolidayID(event.holiday_id)
    
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
  }


  // Handle Yes 
  const handleYes = () => {
    let data = {role_slug: roleSlug, holiday_id: holidayID}
    if(holidayID > 0) {
      DeleteHoliday(data).then(r=>{
        if(r.data.status == 200) {
          GetHolidays().then(r1=>setHolidays(r1.data)) 
          // set message dialog
          setShowDialog(false)
          setDoneSuccess(true)
          setMessageCancelYes("Holiday record deleted successfully.")          
          
          setTimeout(() => {            
            setDoneSuccess(false)
            setMessageCancelYes("")
          }, 2000);
        }
      })
    }    
  }
  
  
  
  // days array
  const datesArray = []
  for (let i = 1; i <= 31; i++) {
    datesArray.push(i)
  }
  // set day
  if(holidays.length) {
    for(let i=0; i<holidays.length; i++) {
      let d = new Date();
      let year = d.getFullYear();
      d = new Date(holidays[i].holiday_month + " " + holidays[i].holiday_day + ", " + year);
      holidays[i].day = days[d.getDay()]           
    }    
  }
  
  return (
    <>
      <Sidenav />
      <section class="col-lg-10 InnerContent">
        <article class="breadcrumbs pt-4" id="breadCrumbs">
          <div class="container">
            <div class="row">
              <div class="col-lg-7 col-md-6 col-sm-5 col-5 breadcrumbContent">
                <h2>Holidays</h2>

                <nav aria-label="breadcrumb">
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Dashboard</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                    Holidays
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
                  <i class="fas fa-plus"></i>Add Holiday
                </button>*/}
              </div>
            </div>
          </div>
        </article>
        <section id="EmployeeHolidaysTable">
          <article>
            <div class="container">
              <div class="row">
                <div class="col-12 mt-4 table-responsive">
                  <table class="table table-striped text-nowrap">
                    <thead>
                      <tr>
                        <th scope="col" class="text-center">
                          # of Days
                        </th>
                        <th scope="col">Title</th>
                        <th scope="col">Holiday Date</th>
                        <th scope="col">Day</th>
                        {roleArray.includes(roleSlug) && <th scope="col" class="text-end">
                          Action
                        </th>}
                      </tr>
                    </thead>
                    <tbody>                      
                      
                      {holidays && holidays.map(h=>(                    
                        <tr>
                          <td class="number">
                            <span>{h.no_of_days}</span>
                          </td>
                          <td>
                            <span> {h.holiday_title}</span>
                          </td>
                          <td>
                            <span> {h.holiday_month > 0 && h.holiday_day > 0 ? h.holiday_day + " " + month[h.holiday_month-1] : 'N/A'}</span>
                          </td>
                          <td>
                            <span>{h.day ? h.day : 'N/A'}</span>
                          </td>
                          {roleArray.includes(roleSlug) && <td class="text-end">                            
                            <button onClick={()=>handleDialog({holiday_id: h.holiday_id})} class="viewButton mx-auto text-center bg-danger">
                              <i class="fas fa-close"></i> Delete
                            </button>          
                          </td>}
                        </tr>
                      ))}
                        
                    </tbody>

                    {roleArray.includes(roleSlug) && <tfoot >
                      <tr>
                        <td class="number">
                          <span><EditableInput width="50px" name="no_of_days" text={selectedHoliday.no_of_days.toString()} handleChangeEditableInput={handleChangeEditableInput} /> </span>
                        </td>
                        <td class="number text-start">
                          <span><EditableInput width="130px" name="holiday_title" text={selectedHoliday.holiday_title} handleChangeEditableInput={handleChangeEditableInput} /> </span>
                        </td>
                        <td class="number text-start">
                          <select name="holiday_month" onChange={handleChangeSelect}>
                            <option value="0">Holiday Month</option>
                            {month.map((data, index)=>(
                              <option value={index+1}>{data}</option>
                            ))}
                          </select>
                        </td>
                        <td class="number text-start">
                          <select name="holiday_day" onChange={handleChangeSelect}>
                            <option value="0">Holiday Date</option>
                            {datesArray.map((data, index)=>(
                              <option value={data}>{data}</option>
                            ))}
                          </select>
                        </td>                          
                        <td class="text-end">                                                
                          <button onClick={handleAddRecord} class="viewButton mx-auto text-center">
                          <i class="fas fa-plus"></i> Add
                          </button>                            
                        </td>
                      </tr>
                    </tfoot>}

                  </table>
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
                    <button onClick={handleYes} type="button" class="btn btn-danger" id="modal-btn-yes">Yes</button>
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

export default Holidays;
