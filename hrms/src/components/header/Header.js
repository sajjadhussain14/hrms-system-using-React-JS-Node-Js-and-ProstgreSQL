import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams, Link } from "react-router-dom";
import { GetLeaveRequests } from "../../API/LeaveRequest";

const Header = () => {

  const [accountMenu, setAccountMenu] = useState({show:false});
  const [isLogin, setIsLogin] = useState(false);
  const [employeeLeaves, setEmployeeLeaves] = useState([])
  let imageURL = localStorage.getItem("homeURL") + "/images/";
  const [loggedIn, setLoggedIn] = useState(false);

  let uId=window.location.href

  useEffect(() => {
    if(localStorage.getItem("role_slug") && localStorage.getItem("id")) {
      setLoggedIn(true)    
    } else { 
      setLoggedIn(false)    
    }

    let newdata = {id: localStorage.getItem("id"),role_slug: localStorage.getItem("role_slug"), year: new Date().getFullYear(), status: 'Pending'}      
    GetLeaveRequests(newdata).then(r=>setEmployeeLeaves(r.data))
    

  }, [uId])
    
  console.log(employeeLeaves)

  return (
    <header>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2 col-md-3 col-sm-3 col-3 mainLogo">
            <Link to="/">
              <img src={imageURL + "Image 2.png"} alt="" />
            </Link>
          </div>
          <div className="col-lg-8 col-md-6 col-sm-9 col-9 companyName">
            <p>
            <img src={imageURL + "Path 82.png"} alt="" />
              {
                localStorage.getItem('name') && localStorage.getItem('desig_title')
                ?
                <span>Welcome, {localStorage.getItem('name')} : <i>{localStorage.getItem('desig_title')}</i></span>
                :
                ''
              }
            </p>
          </div>
          <div className="col-lg-2 col-md-3 col-12">
            <div className="headerIcons notifications">
            { 
              loggedIn && loggedIn==true
              ?
              <>
                <span className='dropdown'>
                  <img src={imageURL + "bell.png"} alt="" />
                  <b>{employeeLeaves && employeeLeaves.length ? employeeLeaves.length : '0'}</b>
                  <div class="dropdown-content">
                    <p class="head my-2">Notifications</p>
                    {employeeLeaves && employeeLeaves.length 
                      ? 
                      employeeLeaves.map(d=>(
                        <Link to={'/leaves-individual-request/' + d.emp_id +'/request/' + d.request_id}>Leaves request from {d.first_name} {d.last_name} for {d.no_of_days} {d.no_of_days > 1 ? 'days' : 'day'}</Link>
                      ))
                      :
                      <p>No notification is available.</p>}                                        
                  </div>
                  
                </span>
                <span>
                  <img src={imageURL + "Path 87.png"} alt="" />
                  <b>0</b>
                </span>
              </>
              :
              ''
              }  
              
              {
                loggedIn && loggedIn==true
               ?              
                <span>
                    <img src={imageURL + "Ellipse 16.png"} alt="" />
                    Admin
                    <img src={imageURL + "chevron-down.png"} alt="" />
                    <ul class="drop-down">
                      <li><Link to={'/employee-profile/' + localStorage.getItem("id")}>Profile</Link></li>
                      <li><a href='/hrms/logout'>Log Out</a></li>
                    </ul>
                </span>
               :
                ''              
              }

              {
                !loggedIn && loggedIn==false
               ?
                <span>                   
                    <img src={imageURL + "Group 67.png"} alt="" />
                    <a className='account mx-2' href={'/hrms/login'}>Account Login</a>                    
                </span> 
               :
                ''             
              }
              
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};



export default Header;
