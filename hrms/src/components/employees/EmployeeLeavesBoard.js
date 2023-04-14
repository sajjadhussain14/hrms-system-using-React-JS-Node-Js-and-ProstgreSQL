import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GetLeaveRequests, GetApprovedLeaveRequest } from "../../API/LeaveRequest";
import {GetTodayAttendance} from "../../API/Attendance"
import {GetEmployees, GetEmployees4Count, GetEmployeeByIDs} from "../../API/Employee"



const EmployeeLeavesBoard = (props) => {

  const [pendingLeavesCount, setPendingLeavesCount] = useState(0);
  const [approvedLeavesCount, setApprovedLeavesCount] = useState(0);
  const [numberOfDaysCount, setNumberOfDaysCount] = useState(0);
  const [roleSlug, setRoleSlug] = useState(props.role_slug ? props.role_slug : "member");
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [workFromHomeCount, setWorkFromHome] = useState(0);
  const [shortLeavesCount, setShortLeavesCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [thisMonth, setthisMonth] = useState(new Date().getMonth() + 1);
  const [thisYear, setthisYear] = useState(new Date().getFullYear());
  const [thisDate, setthisDate] = useState(new Date().getDate());
  const [loading, setLoading] = useState(true);
  const [personsWorkFromHome, setPersonsWorkFromHome] = useState([]);
  const [personShortLeaves, setPersonShortLeaves] = useState([]);
  const [personLeaves, setPersonLeaves] = useState([]);
  const [personPresent, setPersonPresent] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({});
  const { id } = useParams();

  let login_id = { id: props.emp_id ? props.emp_id : localStorage.getItem('id') };
  let login_role = { role_slug: props.role_slug ? props.role_slug : localStorage.getItem('role_slug')};
  let newdata = { ...login_role, ...login_id };
  const month =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]


  useEffect(async () => {
    try {
      
      if(props.year && props.year != undefined) setthisYear(props.year);
      if(props.month && props.month != undefined) setthisMonth(props.month);
      if(props.role_slug && props.role_slug != undefined) setRoleSlug(props.role_slug);
      if(props.emp_id && props.emp_id != undefined) {
        newdata = {...newdata, emp_id: props.emp_id }  
      }
      
      // set Date
      let date = {year: thisYear, month: thisMonth, date: thisDate, status:'Present'}
      newdata = {...newdata, ...date}

      // Pending Leaves
      newdata.status = 'Pending'
      GetLeaveRequests(newdata).then(r=>setPendingLeavesCount(r.data && r.data.length ? r.data.length : 0))
      
      // Pending Leaves
      newdata.status = 'Approved'
      GetLeaveRequests(newdata).then(r=>{
        var total_no_days = 0
        if(r.data && r.data.length) {
          r.data.map(d=>{            
            total_no_days += parseInt(d.no_of_days);
          })
          setNumberOfDaysCount(total_no_days)                  }        
      })
      
       // Get emplopyees count
      let data_temp = {role_slug: props.role_slug ? props.role_slug : localStorage.getItem('role_slug'), id: props.id ? props.id : localStorage.getItem('id')}
      GetEmployees4Count(data_temp).then(r=>{        
        // Get Attendance
        data_temp = {...data_temp, ...date}
        GetTodayAttendance(data_temp).then(r1=>{           
          let leave_count = 0
          let shortLeave_count = 0
          let present_count = 0
          let fromHome_count = 0          
          var person_present = []
          var person_leaves = []
          var person_short_leaves = []
          var person_work_home = []
          
          r1.data.map((d)=>{
            if((d.emp_status == "Present" || d.emp_status == "Work from home" || d.emp_status == "Short Leave") && r.data.find(({emp_id}) => emp_id == d.emp_id) != undefined) {
              present_count++;
              if(!person_present || person_present.find(({emp_id})=> emp_id == d.emp_id) == undefined) {
                person_present.push({emp_id: d.emp_id});                                  
              }
            }
            if(d.emp_status == "Leave" && r.data.find(({emp_id}) => emp_id == d.emp_id) != undefined )  {
                leave_count++; 
                if(!person_leaves || person_leaves.find(({emp_id})=> emp_id == d.emp_id) == undefined) {
                    person_leaves.push({emp_id: d.emp_id, count: 1});                    
                } else {
                    person_leaves.map((d1, index)=>{ if(d1.emp_id == d.emp_id) person_leaves[index].count++ })
                }
            }
            if(d.emp_status == "Short Leave" && r.data.find(({emp_id}) => emp_id == d.emp_id) != undefined ) {
                shortLeave_count++; 
                if(!person_short_leaves || person_short_leaves.find(({emp_id})=> emp_id == d.emp_id) == undefined) {
                    person_short_leaves.push({emp_id: d.emp_id, day: d.in_day, month: d.in_month, year: d.in_year, count: 1});                    
                } else {
                    person_short_leaves.map((d1, index)=>{ if(d1.emp_id == d.emp_id) person_short_leaves[index].count++ })
                }
            }
            if(d.emp_status == "Work from home" && r.data.find(({emp_id}) => emp_id == d.emp_id) != undefined ) {
                fromHome_count++; 
                if(!person_work_home || person_work_home.find(({emp_id})=> emp_id == d.emp_id) == undefined) {
                    person_work_home.push({emp_id: d.emp_id, count: 1});                    
                } else {
                    person_work_home.map((d1, index)=>{ if(d1.emp_id == d.emp_id) person_work_home[index].count++ })
                }
            } 
          })
          
         
          // set emp values for present
          person_present && person_present.map((d)=> {
            GetEmployeeByIDs({role_slug: "administrator", ids: d.emp_id}).then(r3=>{
                let data_temp = {role_slug: "administrator", id: d.emp_id, emp_id: d.emp_id, year: d.year, status: "Approved"}                      
                GetLeaveRequests(data_temp).then(r4=>{    
                  let temp = person_present.map((d1, index)=>{ 
                    if(d1.emp_id == d.emp_id) return {...d1, first_name: r3.data[0].first_name, last_name: r3.data[0].last_name, desig_title: r3.data[0].desig_title};
                    else return d1; 
                  });           
                  person_present = temp;     
                  setPersonPresent(temp.sort((s1,s2) => s1.first_name < s2.first_name ? -1 : (s1.first_name > s2.first_name ? 1 : 0)));
                })                
            });
          });

          // set emp values for short leaves
          person_short_leaves && person_short_leaves.map((d)=> {
            GetEmployeeByIDs({role_slug: "administrator", ids: d.emp_id}).then(r3=>{
                let data_temp = {role_slug: "administrator", id: d.emp_id, emp_id: d.emp_id, year: d.year, status: "Approved"}                      
                GetLeaveRequests(data_temp).then(r4=>{                  
                  let duration = {}
                  r4.data.map((dd)=>{
                    let start_t = dd.leaves_start_time.split(":")[0] > 12 ? (dd.leaves_start_time.split(":")[0] - 12) + ":" + dd.leaves_start_time.split(":")[1] + " PM" : (dd.leaves_start_time.split(":")[0] == 0 ? "12:" + dd.leaves_start_time.split(":")[1] + " AM" : dd.leaves_start_time + " AM")
                    let end_t = dd.leaves_end_time.split(":")[0] > 12 ? (dd.leaves_end_time.split(":")[0] - 12) + ":" + dd.leaves_end_time.split(":")[1] + " PM" : (dd.leaves_end_time.split(":")[0] == 0 ? "12:" + dd.leaves_end_time.split(":")[1] + " AM" : dd.leaves_end_time + " AM")
                    if(dd.request_from_day == d.day && dd.request_from_month == d.month && dd.request_from_year == d.year) duration = {dur1: start_t, dur2: end_t }                    
                  });
                  let temp = person_short_leaves.map((d1, index)=>{ 
                    if(d1.emp_id == d.emp_id) return {...d1, empName: r3.data[0].first_name + " " + r3.data[0].last_name, first_name: r3.data[0].first_name, last_name: r3.data[0].last_name, desig_title: r3.data[0].desig_title, start: duration.dur1, end: duration.dur2};
                    else return d1; 
                  });           
                  person_short_leaves = temp;     
                  setPersonShortLeaves(temp.sort((s1,s2) => s1.first_name < s2.first_name ? -1 : (s1.first_name > s2.first_name ? 1 : 0)));
                })                
            });
          });
          
          // set emp values for work from home
          person_work_home.length && person_work_home.map((d)=> {
            GetEmployeeByIDs({role_slug: "administrator", ids: d.emp_id}).then(r3=>{
                let temp = person_work_home.map((d1, index)=>{ 
                  if(d1.emp_id == d.emp_id) return {...d1, empName: r3.data[0].first_name + " " + r3.data[0].last_name, first_name: r3.data[0].first_name, last_name: r3.data[0].last_name, desig_title: r3.data[0].desig_title};
                  else return d1; 
                })        
                person_work_home = temp;        
                setPersonsWorkFromHome(temp.sort((s1,s2) => s1.first_name < s2.first_name ? -1 : (s1.first_name > s2.first_name ? 1 : 0)));
            });
          });
          
          // set emp values for leaves
          person_leaves.length && person_leaves.map((d)=> {
            GetEmployeeByIDs({role_slug: "administrator", ids: d.emp_id}).then(r3=>{
                let data_temp = {role_slug: "administrator", id: d.emp_id, emp_id: d.emp_id, year: thisYear, status:'Approved'}
                GetLeaveRequests(data_temp).then(r4=>{
                  let from_date = r4.data[r4.data.length - 1].request_from_day + '-' + month[r4.data[r4.data.length - 1].request_from_month - 1] + '-' + thisYear;   
                  let to_date = r4.data[r4.data.length - 1].request_to_day + '-' + month[r4.data[r4.data.length - 1].request_to_month - 1] + '-' + thisYear;   
                  let count = r4.data[r4.data.length - 1].no_of_days
                  
                  let temp = person_leaves.map((d1, index)=>{ 
                      if(d1.emp_id == d.emp_id) return {...d1, empName: r3.data[0].first_name + " " + r3.data[0].last_name, first_name: r3.data[0].first_name, last_name: r3.data[0].last_name, desig_title: r3.data[0].desig_title, from: from_date, to: to_date, count: count};
                      else return d1; 
                    }) 
                    person_leaves = temp;  
                    setPersonLeaves(temp.sort((s1,s2) => s1.first_name < s2.first_name ? -1 : (s1.first_name > s2.first_name ? 1 : 0)));
                });
            });
          });
          
          // set count values
          setPresentCount(present_count)
          setApprovedLeavesCount(leave_count)
          setShortLeavesCount(shortLeave_count)
          setWorkFromHome(fromHome_count)
          setAbsentCount(r.data.length - present_count - leave_count)       
        });
        
        setTotalCount(r.data ? r.data.length : 0)        
      });            

      
      // Loader Delay
      setTimeout(() => {
          setLoading(false);
      }, 500);


    } catch(e) {
      setPresentCount(0)
      setApprovedLeavesCount(0)
      setShortLeavesCount(0)
      setWorkFromHome(0)
      setNumberOfDaysCount(0) 
      setAbsentCount(0)  
      setLoading(false)    
      setDialogContent({})
    }
  }, []);

  // Loader
  if(loading){return (
    <div class="loader mt-5">
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




  //////////////////// *** Dashboard Dialog
  

  
  // handle display total 
  const handleDisplayTotal = async () => {
    let data_temp = {role_slug: props.role_slug ? props.role_slug : localStorage.getItem('role_slug'), id: props.id ? props.id : localStorage.getItem('id')}
    GetEmployees(data_temp).then(r=>{      
      let temp = r.data.profile.sort((s1, s2) => (s1.first_name < s2.first_name) ? -1 : (s1.first_name > s2.first_name ? 1 : 0))
      setDialogContent({title: "All Employees", url: "/employee-profile/", data: r.data.profile});      
    });
    setShowDialog(true);    
  }

  // handle display present 
  const handleDisplayPresent = async () => {
    setDialogContent({title: "Present Employees", url: "/attendence-details/", data: personPresent});    
    setShowDialog(true);    
  }

  // handle display present 
  const handleDisplayAbsent = async () => {
    let data_temp = {role_slug: props.role_slug ? props.role_slug : localStorage.getItem('role_slug'), id: props.id ? props.id : localStorage.getItem('id')}
    GetEmployees(data_temp).then(r=>{      
      let temp = r.data.profile
      personPresent.map((d1)=>{
        let index = temp.findIndex(({emp_id})=>emp_id == d1.emp_id)                        
        temp.splice(index, 1)
      });
      personLeaves.map((d1)=>{
        let index = temp.findIndex(({emp_id})=>emp_id == d1.emp_id)                        
        temp.splice(index, 1)
      });
      temp = temp.sort((s1,s2) => s1.first_name < s2.first_name ? -1 : (s1.first_name > s2.first_name ? 1 : 0))      

      setDialogContent({title: "Absent Employees", url: "/attendence-details/", data: temp});      
    });
    setShowDialog(true);    
  }

  // handle display present 
  const handleDisplayLeaves = async () => {
    setDialogContent({title: "Employees on Leave", url: "/leaves-individual-details/", data: personLeaves});    
    setShowDialog(true);    
  }

  // handle display work from home
  const handleDisplayWorkFromHome = () => {
    setDialogContent({title: "Employees Work from Home", url: "/leaves-individual-details/", data: personsWorkFromHome});    
    setShowDialog(true);    
  }

  // handle display short leaves
  const handleDisplayShortLeaves = () => {
    setDialogContent({title: "Employees On Short Leaves", url: "/leaves-individual-details/", data: personShortLeaves});    
    setShowDialog(true);    
  }
  
  // handle cancel
  const handleCancel = () => {
    setShowDialog(false);
    setDialogContent({});
  }
  
  

  

  return (
    <article id="employeeLeaveRecord" class="leavesnumber">
        <div class="container">
            
            {roleSlug != "member" && <div class="dashboard-header my-1 row">
              <div class="content-header-left col-md-6 col-12 mb-2 breadcrumb-new">
                <h3 class="content-header-title mb-0 d-inline-block">Today's Detail</h3>                
              </div>
              <div class="content-header-right col-md-6 col-12">
                
              </div>
            </div>}          

            <div class="row">
              {roleSlug != "member" && <>
              <div class="dashboard col-lg-4 col-md-6 col-12">
                <div class="card pull-up">
                    <div class="card-content">
                        <div class="card-body">
                            <div class="media d-flex">
                                <div class="media-body text-left">
                                    <h3 class="info">{totalCount}</h3>
                                    <h6>Total Employees <button type="button" onClick={handleDisplayTotal}><i class="fa fa-eye"></i></button></h6>
                                </div>
                                <div>
                                    <i class="fa fa-users info font-large-2 float-right"></i>
                                </div>
                            </div>
                            <div class="progress progress-sm mt-3 mb-0 box-shadow-2">
                                <div class="progress-bar bg-gradient-x-info" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style={{width:'100%'}}></div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>  

              <div class="dashboard col-lg-4 col-md-6 col-12">
                <div class="card pull-up">
                    <div class="card-content">
                        <div class="card-body">
                            <div class="media d-flex">
                                <div class="media-body text-left">
                                    <h3 class="success">{presentCount}</h3>
                                    <h6>Present <button type="button" onClick={handleDisplayPresent}><i class="fa fa-eye"></i></button></h6>
                                </div>
                                <div>
                                    <i class="fa fa-user-check success font-large-2 float-right"></i>
                                </div>
                            </div>
                            <div class="progress progress-sm mt-3 mb-0 box-shadow-2">
                                <div class="progress-bar bg-gradient-x-success" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style={{width:((presentCount/totalCount)*100) + "%" }}></div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>  

              <div class="dashboard col-lg-4 col-md-6 col-12">
                <div class="card pull-up">
                    <div class="card-content">
                        <div class="card-body">
                            <div class="media d-flex">
                                <div class="media-body text-left">
                                    <h3 class="danger">{absentCount}</h3>
                                    <h6>Absent <button type="button" onClick={handleDisplayAbsent}><i class="fa fa-eye"></i></button></h6>
                                </div>
                                <div>
                                    <i class="fa fa-user-times danger font-large-2 float-right"></i>
                                </div>
                            </div>
                            <div class="progress progress-sm mt-3 mb-0 box-shadow-2">
                                <div class="progress-bar bg-gradient-x-danger" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style={{width: ((absentCount/totalCount)*100) + "%"}}></div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
              </>}  

              <div class="dashboard col-lg-4 col-md-6 col-12">
                <div class="card pull-up">
                    <div class="card-content">
                        <div class="card-body">
                            <div class="media d-flex">
                                <div class="media-body text-left">
                                    <h3 class="warning">{workFromHomeCount}</h3>
                                    <h6>Work from Home {roleSlug != "member" && <button type="button" onClick={handleDisplayWorkFromHome}><i class="fa fa-eye"></i></button>}</h6>
                                </div>
                                <div>
                                    <i class="fa fa-house-user warning font-large-2 float-right"></i>
                                </div>
                            </div>
                            <div class="progress progress-sm mt-3 mb-0 box-shadow-2">
                                <div class="progress-bar bg-gradient-x-warning" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style={{width: ((workFromHomeCount/presentCount)*100) + "%"}}></div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>  
              
              <div class="dashboard col-lg-4 col-md-6 col-12">
                <div class="card pull-up">
                    <div class="card-content">
                        <div class="card-body">
                            <div class="media d-flex">
                                <div class="media-body text-left">
                                    <h3 class="warning">{shortLeavesCount}</h3>
                                    <h6>Short Leaves {roleSlug != "member" && <button type="button" onClick={handleDisplayShortLeaves}><i class="fa fa-eye"></i></button>}</h6>
                                </div>
                                <div>
                                    <i class="fa fa-user-clock warning font-large-2 float-right"></i>
                                </div>
                            </div>
                            <div class="progress progress-sm mt-3 mb-0 box-shadow-2">
                                <div class="progress-bar bg-gradient-x-warning" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style={{width: ((shortLeavesCount/totalCount)*100) + "%"}}></div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>  

              <div class="dashboard col-lg-4 col-md-6 col-12">
                <div class="card pull-up">
                    <div class="card-content">
                        <div class="card-body">
                            <div class="media d-flex">
                                <div class="media-body text-left">
                                    <h3 class="warning">{roleSlug == "member" ? (numberOfDaysCount - shortLeavesCount) : approvedLeavesCount}</h3>
                                    <h6>Full Leaves {roleSlug != "member" && <button type="button" onClick={handleDisplayLeaves}><i class="fa fa-eye"></i></button>}</h6>
                                </div>
                                <div>
                                    <i class="fa fa-calendar-check warning font-large-2 float-right"></i>
                                </div>
                            </div>
                            <div class="progress progress-sm mt-3 mb-0 box-shadow-2">
                                <div class="progress-bar bg-gradient-x-warning" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style={{width: ((approvedLeavesCount/totalCount)*100) + "%"}}></div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>              
            </div>


          {roleSlug != "member" && <>
            <div class="dashboard-header my-1 row">
              <div class="content-header-left col-md-6 col-12 mb-2 breadcrumb-new">
                <h3 class="content-header-title mb-0 d-inline-block">Overall Detail</h3>                
              </div>
              <div class="content-header-right col-md-6 col-12">
                <div class="btn-group float-end">
                  <button class="btn btn-info dropdown-toggle mb-1" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Filter</button>
                  <div class="dropdown-menu arrow">
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="dashboard col-lg-4 col-md-6 col-12">
                <div class="card2" >
                  <div class="card-header">
                    <h4 class="card-title">Work from Home</h4>
                    <a class="heading-elements-toggle"><i class="la la-ellipsis-h font-medium-3"></i></a>
                        <div class="heading-elements">
                      <ul class="list-inline mb-0">
                        <li><a id="collapsible"><i class="fa fa-minus"></i></a></li>
                        <li><a class="close"><i class="fa fa-times"></i></a></li>
                      </ul>
                    </div>
                  </div>
                  <div class="card-content collapse show">
                    <div class="card-body pt-0">
                      <ul class="list-group">
                        {
                        personsWorkFromHome.length 
                        ?
                        personsWorkFromHome.map((d5)=>(
                            <li class="list-group-item">
                            <span class="badge badge-primary badge-pill float-right">{d5.count}</span>
                            {d5.empName}
                          </li>
                        ))
                        :
                        <p class="text-danger">No records available.</p>
                        }
                      </ul>                      
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="dashboard col-lg-4 col-md-6 col-12">
                <div class="card2" >
                  <div class="card-header">
                    <h4 class="card-title">Short Leaves</h4>
                    <a class="heading-elements-toggle"><i class="la la-ellipsis-h font-medium-3"></i></a>
                        <div class="heading-elements">
                      <ul class="list-inline mb-0">
                        <li><a class="collapsible"><i class="fa fa-minus"></i></a></li>
                        <li><a class="close"><i class="fa fa-times"></i></a></li>
                      </ul>
                    </div>
                  </div>
                  <div class="card-content collapse show">
                    <div class="card-body pt-0">                                            
                      <ul class="list-group">
                        {
                        personShortLeaves.length 
                        ?
                        personShortLeaves.map((d5)=>(                          
                            <li class="list-group-item">
                              <div class="duration">{d5.start} <i class="fa fa-caret-right mx-1"></i> {d5.end}</div>
                              <span class="badge badge-primary badge-pill float-right">{d5.count}</span>
                              {d5.empName}                               
                            </li>
                        ))
                        :
                        <p class="text-danger">No records available.</p>
                        }                        
                      </ul>                      
                    </div>
                  </div>
                </div>
              </div>

              <div class="dashboard col-lg-4 col-md-6 col-12">
                <div class="card2" >
                  <div class="card-header">
                    <h4 class="card-title">Full Leaves</h4>
                    <a class="heading-elements-toggle"><i class="la la-ellipsis-h font-medium-3"></i></a>
                    <div class="heading-elements">
                      <ul class="list-inline mb-0">
                        <li><a class="collapsible"><i class="fa fa-minus"></i></a></li>
                        <li><a class="close"><i class="fa fa-times"></i></a></li>
                      </ul>
                    </div>
                  </div>
                  <div class="card-content collapse show">
                    <div class="card-body pt-0">                      
                      <ul class="list-group">                        
                        {personLeaves.length 
                        ? 
                        personLeaves.map(({count, empName, from, to})=>(
                            <li class="list-group-item">
                              <span class="badge badge-primary badge-pill float-right">{count}</span>
                              <div>
                                {empName}
                                {from && <div class="date">{from} <i class="fa fa-caret-right mx-1"></i> {to}</div>}
                              </div>
                              
                            </li>
                        ))
                        :
                        <p class="text-danger">No records available.</p>
                        }
                      </ul>                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>}
            

        
        {showDialog && <>
          <div class="modal fade in d-block confirmModal dashboardDialog" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="false" id="mi-modal">
            <div class="modal-dialog ">
              <div class="modal-content card text-dark bg-light">
                <div class="modal-header">
                  <button onClick={handleCancel} type="button" class="close " data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 class="modal-title " id="myModalLabel">{dialogContent.title} <small>{dialogContent.data && "(" + dialogContent.data.length + ")"}</small></h4>
                </div>
                <div class="modal-body card-body px-0">
                  {!dialogContent.data && <div class="text-center">
                    <div class="spinner-border" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>}
                  <ul>
                    {dialogContent.data && dialogContent.data.map((d)=>(
                      <li>
                        {d.count && <span class="count">{d.count}</span>} 
                        <Link to={dialogContent.url + d.emp_id}>{d.first_name} {d.last_name}</Link> 
                        <span class="title">{d.desig_title}</span> 
                        {d.from && <span class="date">{d.from} <i class="fa fa-caret-right mx-1"></i> {d.to}</span>}
                        {d.start && <span class="date">{d.start} <i class="fa fa-caret-right mx-1"></i> {d.end}</span>}
                      </li>
                    ))}                                    
                  </ul>                  
                </div>
                
              </div>
            </div>
          </div>
          <div class="alert" role="alert" id="result"></div>
        </>}        


        </div>
      </article>
      
  );
};

export default EmployeeLeavesBoard;
