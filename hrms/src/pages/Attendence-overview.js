import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import parse from 'html-react-parser'
import Sidenav from "../components/sidenav/Sidenav";
import { GetMonthlyAttendance , GetEmployeeAttendance } from "../API/Attendance";
import { GetEmployees } from "../API/Employee";
import ReactTooltip from "react-tooltip";



const AttendenceOverview = () => {

  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [employeeAttendance, setEmployeeAttendance] = useState({});
  const [dateSelected, setDateSelected] = useState(new Date());
  const [filterMonth, setFilterMOnth] = useState(new Date().getMonth()+1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const month =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thrusday","Friday","Saturday"]
  const days_short = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
  const fullmonth = ["January","February","March","April","May","June","July","August","September","October","November","December"]

  let login_id = { id: localStorage.getItem('id') };
  let login_role = { role_slug: localStorage.getItem('role_slug')};
  let newdata = { ...login_role, ...login_id };
  let imageURL = localStorage.getItem("homeURL") + "/images/";

  useEffect(async () => {
    try {
      // prep data
      let allow_punch = {allow_punch: "Yes"}
      // today's date
      let d = new Date()
      let year = d.getFullYear()
      let month = d.getMonth() + 1 
      let dat = d.getDate()    
      let time = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
      let date = {year: year, month: month, date: dat, time: time}
      // combine all
      newdata = {...newdata, ...allow_punch, ...date}
      
      // API call get attendance
      let attendance = await GetMonthlyAttendance(newdata)
      setEmployeeAttendance(attendance.data)
      
      // API call get employee details
      let emp = await GetEmployees(newdata)
      setEmployeeDetails(emp.data.profile)      
      
      // Loader Delay
      setTimeout(() => {
        setLoading(false);
      }, 250);

    } catch {
      setEmployeeAttendance([]);
      setEmployeeDetails([]);
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
  
  
  function showEmployee(props) {
    
    let profile_pic = ""
    if(props.emp_pic) {
      profile_pic = props.emp_pic.replace("-l","-s")
    } else {
      profile_pic = props.gender.toLowerCase() + ".png"
    }

    const percent = (props.attendanceCount/props.daysCount*100).toFixed(0)
    const badge = percent + "%"
    let bgcolor = "bg-success"
    if(percent > 80 & percent < 91) {
      bgcolor = "bg-primary"
    } else if(percent > 70 & percent < 81) {
      bgcolor = "bg-info"
    } else if(percent > 60 & percent < 71) {
      bgcolor = "bg-warning"
    } else if(percent < 51) {
      bgcolor = "bg-danger"
    }

    return (      
      <tr>        
        <td>
          <h2 class="table-avatar">
          <Link to={"/attendence-details/" + props.emp_id} class="avatar">
              <img
                alt="employee picture"
                src={imageURL + profile_pic}
              />
            </Link>
            <Link to={"/attendence-details/" + props.emp_id}>
              {props.first_name + " " + props.last_name} <span>{props.desig_title}</span>
            </Link>
          </h2>          
        </td>
        <td>
          <span className={"attendance-badge " + bgcolor}>{badge}</span>
        </td>
        {parse(props.body)}        
      </tr>        
    );
  }
  

  let bodyTemplate = []
  let headTemplate = []    
  let daysInMonth = new Date(filterYear, filterMonth, 0).getDate();  
  let date_2day = new Date()
  if(filterYear == date_2day.getFullYear() && filterMonth == date_2day.getMonth()+1) {
    daysInMonth = date_2day.getDate()    
  }   
  
  if(employeeDetails.length) {
    for(let i=0; i<employeeDetails.length; i++) {  
      let attendanceCount = 0
      let daysCount = 0
      let head = ''  
      let body = ''  
      for(let z=daysInMonth; z>=1; z--) {
        let tag = ""
        let ee_month = ""
        for(let j=0; j<employeeAttendance.length; j++) {          
          // In Date/Time for tooltip
          let attendance_status = 'Date: ' + z + '/' + employeeAttendance[j].in_month + '/' + employeeAttendance[j].in_year
          
          if(employeeAttendance[j].emp_id === employeeDetails[i].emp_id && employeeAttendance[j].in_day === z) {
            if(employeeAttendance[j].is_present && employeeAttendance[j].emp_status === "Present") {
              // get duty details
              let duty_hour = parseInt(employeeDetails[i].duty_start_time.split(":")[0])
              let duty_minute = parseInt(employeeDetails[i].duty_start_time.split(":")[1].replace("PM","").replace("AM","").replace(" ",""))
              let duty_pm = employeeDetails[i].duty_start_time.includes("PM") ? true : false
              // get punch in details
              let in_hour = parseInt(employeeAttendance[j].in_time.split(":")[0])
              let in_minute = parseInt(employeeAttendance[j].in_time.split(":")[1].replace("PM","").replace("AM","").replace(" ",""))
              let in_pm = employeeAttendance[j].in_time.includes("PM") ? true : false              
              // convert to 24h format
              if(duty_pm) duty_hour +=12;
              if(in_pm) in_hour +=12;
                                          
              //<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top" >Tooltip</button>
              
              // In Date/Time for tooltip
              attendance_status += '<br>Time: ' + employeeAttendance[j].in_time

              if(in_hour == duty_hour && in_minute <= duty_minute) { //present 
                attendance_status += '<br>Status: Present On-Time'
                body += '<td class="Anumber" data-bs-html="true" data-bs-toggle="tooltip" data-bs-placement="top" title="' + attendance_status + '"><span class="timeBadge">' + employeeAttendance[j].in_time + '</span><span><i class="fas fa-check text-success"></i></span></td>'
                attendanceCount++;
              } else if(in_hour == duty_hour && in_minute > duty_minute) { //late present 
                attendance_status += '<br>Status: Present Late'
                body += '<td class="Anumber" data-bs-html="true" data-bs-toggle="tooltip" data-bs-placement="top" title="' + attendance_status + '"><span class="timeBadge">' + employeeAttendance[j].in_time + '</span><span><i class="fas fa-check text-warning"></i></span></td>'
                attendanceCount++;
              } else if(in_hour > duty_hour) { //late present 
                attendance_status += '<br>Status: Present Late'
                body += '<td class="Anumber" data-bs-html="true" data-bs-toggle="tooltip" data-bs-placement="top" title="' + attendance_status + '"><span class="timeBadge">' + employeeAttendance[j].in_time + '</span><span class="d-flex flex-column"><i class="fas fa-check text-warning"></i></span></td>'
                attendanceCount++;
              } else if(in_hour < duty_hour) { //early present 
                attendance_status += '<br>Status: Present On-Time'
                body += '<td class="Anumber" data-bs-html="true" data-bs-toggle="tooltip" data-bs-placement="top" title="' + attendance_status + '"><span class="timeBadge">' + employeeAttendance[j].in_time + '</span><span class="d-flex flex-column"><i class="fas fa-check text-success"></i></span></td>'
                attendanceCount++;
              } 
              
              tag = "yes"
            } else if(employeeAttendance[j].emp_status == "Absent") {
              attendance_status += '<br>Status: Absent'
              body += '<td class="Anumber" data-bs-html="true" data-bs-toggle="tooltip" data-bs-placement="top" title="' + attendance_status + '"><span class="statusBadge">Present</span><span class="absent"><i class="fas fa-times"></i><i class="fas fa-times"></i></span></td>'
              tag = "yes"
            } else if(employeeAttendance[j].emp_status == "Work from home") {
              attendance_status += '<br>Status: Work from home'
              body += '<td class="Anumber" data-bs-html="true" data-bs-toggle="tooltip" data-bs-placement="top" title="' + attendance_status + '"><span class="timeBadge">' + employeeAttendance[j].in_time + '</span><span class="statusBadge">Remote Work</span><span class="present"><i class="fa fa-globe text-success"></i></span></td>'
              tag = "yes"
              attendanceCount++;
            } else if(employeeAttendance[j].emp_status == "Short Leave") {
              attendance_status += '<br>Status: Short-Leave'
              body += '<td class="Anumber" data-bs-html="true" data-bs-toggle="tooltip" data-bs-placement="top" title="' + attendance_status + '"><span class="timeBadge">' + employeeAttendance[j].in_time + '</span><span class="statusBadge">Short Leave</span><span><i class="fa fa-user-clock text-success"></i></span></td>'              
              tag = "yes"            
              attendanceCount++;
            } else if(employeeAttendance[j].emp_status == "Leave") {
              attendance_status += '<br>Status: On-Leave'
              body += '<td class="Anumber" data-bs-html="true" data-bs-toggle="tooltip" data-bs-placement="top" title="' + attendance_status + '"><span class="statusBadge">Leave</span><span><img src="' + imageURL + 'Group 151.png" alt="Leave"></span></td>'              
              tag = "yes"            
              attendanceCount++;
            } else {
              //body += '<td class="Anumber" data-bs-html="true" data-bs-toggle="tooltip" data-bs-placement="top" title="No attendance available"></td>'                        
            }             
          }  
          ee_month = employeeAttendance[j].in_month;             
        }
        const dd_2 = new Date(filterYear + "-" + filterMonth + "-" + z)
        console.log(dd_2)
        // if not tag - show cross/empty        
        if(!tag) {                   
          const dd = new Date()
          const dd_month = parseInt(dd.getMonth()) + 1          
          if(ee_month){
            if(dd_2.getDay() == 0 || dd_2.getDay() == 6) {
              body += '<td class="Anumber offDay"><span class="weekend">' + (dd_2.getDay() == 0 ? 'Sunday' : 'Saturday') + '</span> <i class="fa fa-calendar"></i></td>'
            } else {
              if(parseInt(ee_month) < dd_month && z <= daysInMonth) {
                body += '<td class="Anumber" data-bs-html="true" data-bs-toggle="tooltip" data-bs-placement="top" title="No attendance available"><i class="fas fa-times "></i></td>'
              } else if(parseInt(ee_month) == dd_month && z <= dd.getDate()) {
                body += '<td class="Anumber" data-bs-html="true" data-bs-toggle="tooltip" data-bs-placement="top" title="No attendance available"><i class="fas fa-times "></i></td>'
              } else {
                body += '<td class="Anumber">&nbsp;</td>'
              }   
            }
          } else {
            if(filterMonth < dd_month && z <= daysInMonth) {
              body += '<td class="Anumber" data-bs-html="true" data-bs-toggle="tooltip" data-bs-placement="top" title="No attendance available"><i class="fas fa-times "></i></td>'
            } else if(filterMonth == dd_month && z <= dd.getDate()) {
              body += '<td class="Anumber" data-bs-html="true" data-bs-toggle="tooltip" data-bs-placement="top" title="No attendance available"><i class="fas fa-times "></i></td>'
            } else {
              body += '<td class="Anumber">&nbsp;</td>'
            }
            daysCount++;
          }
        }
        
        // count sat/sun to exclude
        var hdate = new Date(filterYear + "-" + filterMonth + "-" + z);
        if(hdate.getDay() == 0 || hdate.getDay() == 6) daysCount--;   

        // head of the records
        head = <th scope="col"> <span class="day">{days_short[hdate.getDay()]}</span>{z}</th>
        headTemplate[z-1] = head
        daysCount++
             
      }
            
      employeeDetails[i].body = body;      
      bodyTemplate[i] = showEmployee({...employeeDetails[i], attendanceCount: attendanceCount, daysInMonth: daysInMonth, daysCount: daysCount})
    }    
  }


  // set years for dropdown
  let years = []
  const dat = new Date()
  for(let i=dat.getFullYear(); i>dat.getFullYear()-20; i--) {
    years.push(i)
  }


  const handleChangeValue = async event => {
    // prep data
    let searchData = {...newdata}    
    let searchyear = {year: filterMonth}
    let searchmonth = {month: filterYear}
    // set month/year
    if(event.target.name === "search_month") {      
      setFilterMOnth(event.target.value)
      searchyear.year = filterYear
      searchmonth.month = event.target.value      
    } else if(event.target.name === "search_year") {      
      setFilterYear(event.target.value)
      searchyear.year = event.target.value
      searchmonth.month = filterMonth
    } 
    searchData = {...searchData, ...searchmonth, ...searchyear} 
    
    // API call get attendance
    let attendance = await GetMonthlyAttendance(searchData)
    setEmployeeAttendance(attendance.data)    
  }
  

  
  return (
    <>
      <Sidenav />
      <section class="col-lg-10 InnerContent">
        <article class="breadcrumbs  pt-4" id="breadCrumbs">
          <div class="container">
            <div class="row">
              <div class="col-lg-7 col-md-6 col-sm-5 col-5 breadcrumbContent">
                <h2>Attendance Overview</h2>
                <nav aria-label="breadcrumb">
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Dashboard</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                      Attendances
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                      {month[filterMonth-1]} {filterYear}
                    </li>
                  </ol>
                </nav>
              </div>
              <div class="col-lg-5 col-md-6 col-sm-7 col-7 menuButton text-end">
                
              </div>
            </div>
          </div>
        </article>
        <article id="filter">
          <div class="container">
            <div class="row">
              <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-2">
                <select class="form-select" name="search_month" aria-label="Default select example" onChange={handleChangeValue}>
                  <option selected value="">Filter By Month</option>
                  {fullmonth.map((m,i)=>(
                    <option value={i+1} selected={filterMonth == i+1 ? 'selected' : ''}>{m}</option>
                  ))}                  
                </select>
              </div>
              <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-2">
                <select class="form-select" name="search_year" aria-label="Default select example" onChange={handleChangeValue}>
                  <option selected value="">Filter By Year</option>
                    {years.map((y)=>(                    
                      <option value={y} selected={filterYear == y ? 'selected' : ''}>{y}</option>
                    ))}
                </select>
              </div>
              <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-2 position-relative">
                {/*<input type="date" placeholder="From" />
                <a href="##">
                  <img
                    src="/images/calendar2-date.png"
                    class="img-fluid"
                    alt=""
                  />
                    </a>*/}
              </div>
              <div class="col-lg-3 col-md-4 col-sm-6 col-6 mb-2 position-relative">
                {/*<input type="date" placeholder="To" />
                <a href="##">
                  <img
                    src="/images/calendar2-date.png"
                    class="img-fluid"
                    alt=""
                  />
                  </a>*/}
              </div>
            </div>
          </div>
          
        </article>
        <section id="EmployeeattendanceLeave" class="employeeLeaveTable">
          <div class="container">
            <div class="row">
              <div class="col-12 mt-4 table-responsive">                

                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Employee</th>
                      <th scope="col">%age</th>
                      { headTemplate.reverse() }
                    </tr>
                  </thead>
                  <tbody>
                    {bodyTemplate}
                  </tbody>
                </table>                
                
              </div>
            </div>
          </div>
        </section>
      </section>

      <div
        class="modal fade"
        id="staticBackdrop1"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttendenceOverview;
