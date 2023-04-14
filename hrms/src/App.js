import React, {useState, useEffect} from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

import Home from "./pages/Home";
import AttendenceDetails from "./pages/Attendence-details";
import AttendenceOverview from "./pages/Attendence-overview";
import AttendenceScreen from "./pages/Attendence-screen";
import Employees from "./pages/Employees";
import ExEmployees from "./pages/Ex-employees";
import Holidays from "./pages/Holidays";
import LeavesRespondOnRequest from "./pages/Leaves-individual-request";
import LeavesIndividualDetails from "./pages/Leaves-individual-details"
import LeavesRequests from "./pages/Leaves-requests";
import LeavesIndividualDetail from "./pages/Leaves-individual-details";
import LeavesRecord from "./pages/Leaves-records";
import LeavesApplication from "./pages/Leaves-application";

import Login from "./pages/Login";
import ForgetPassword from "./pages/Forget-password";
import ResetPassword from "./pages/resetpass";
import ResetMemberPassword from "./pages/Reset-member-password";

import NoticeBoard from "./pages/Notice-board";
import Profile from "./pages/Profile";
import EditProfile from "./pages/edit-employee-profile";
import SalaryOverview from "./pages/Salary-overview";
import ReleaseSalary from "./pages/Release-salary";
import SalaryDetail from "./pages/Salary-detail";
import SalarySlip from "./pages/Salary-slip";
import EditSalarySlip from "./pages/edit-salary-slip";

import Logout from "./pages/Logout";
import Importcsv from "./pages/import-csv";
import Settings from "./pages/settings";

import DevelopedBy from "./pages/Developed-by";

import { GetEmployees } from "../src/API/Employee";
import { GetLeaveRequests } from "../src/API/LeaveRequest";

const base_url = window.location.origin;
console.log("base name", base_url);


let baseName = process.env.REACT_APP_BASE_NAME_TEMP
if (base_url == "http://localhost:3000") {
  baseName = process.env.REACT_APP_BASE_NAME_TEMP;
} else {
  baseName = process.env.REACT_APP_BASE_NAME;
}

localStorage.setItem("homeURL", base_url + baseName);



function App() {

  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [requestCount, setrequestCount] = useState(0)
  

  // Get id
  const getURL = window.location.toString();
  let URLarray = getURL.split("/")
  let id = isNaN(URLarray[URLarray.length - 2].toString()) == false ? URLarray[URLarray.length - 2] :  (isNaN(URLarray[URLarray.length - 1].toString()) == false ? URLarray[URLarray.length - 1] : "");
  id = isNaN(URLarray[URLarray.length - 3].toString()) == false ? URLarray[URLarray.length - 3] : id;

  // Set data  
  let login_id = { id: localStorage.getItem('id') };
  let login_role = { role_slug: localStorage.getItem('role_slug') };
  let newdata = { ...login_role, ...login_id };
  const roleArray = ["super_admin", "administrator", "manager"];


    
  
  useEffect(async() => {
  
    // Get login user
    if(id) {
      GetEmployees(newdata).then(r=>setSelectedEmployee(r.data)) 
    }

    // Get leaves request count
    let rdata = {...login_id, ...login_role, year: new Date().getFullYear(), status: "Pending" }
    if(login_role.role_slug == "member") {
      rdata = {...rdata, emp_id: id}
    }
    localStorage.setItem('totalLeavesRequest', 0)
    GetLeaveRequests(rdata).then(r=>{
      localStorage.setItem('totalLeavesRequest', r.data ? r.data.length : 0)
    })
  
  }, [])
  

      
  
  // Restrict URL access
  if(roleArray.includes(login_role.role_slug)) {
    // can access
  } else if(!id ) {
    // can access    
  } else if(id && id == login_id.id) {
    // can access
  } else if(id && selectedEmployee.teamlead_id && login_id.id == selectedEmployee.teamlead_id) {
    if(id && id != login_id.id && !URLarray.includes("salary-overview") && !URLarray.includes("salary-detail") && URLarray.includes("edit-salary-slip") && URLarray.includes("salary-slip")) {
      // can access
    } else {
      return (
        <>
          <p>URL Couldn't Not Found.</p>          
        </>
      )  
    }
  } else {
    return (
      <>
        <p>URL Couldn't Not Found.</p>          
      </>
    )
  }
 

  
  return (
    <>
      
      <div class="container-fluid">
        <div class="row">
          <BrowserRouter basename={baseName}>
            <Header />

            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/salary-slip/:id/slip/:payroll_id" element={<SalarySlip />} />
              <Route path="/edit-salary-slip/:id/slip/:payroll_id" element={<EditSalarySlip />} />
              <Route path="/salary-detail/:id" element={<SalaryDetail />} />
              <Route path="/salary-overview" element={<SalaryOverview />} />
              <Route path="/release-salary" element={<ReleaseSalary />} />
              <Route path="/employee-profile/:id" element={<Profile />} />
              <Route path="/edit-employee-profile/:id" element={<EditProfile />} />              
              <Route path="/notice-board" element={<NoticeBoard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/forget-password/:reset_email/:url" element={<ForgetPassword />} />
              <Route path="/reset-password/:reset_email" element={<ResetMemberPassword />} />
              <Route path="/reset/:url" element={<ResetPassword />} />
              <Route path="/leaves-record" element={<LeavesRecord />} />
              <Route
                path="/leaves-application"
                element={<LeavesApplication />}
              />

              <Route
                path="/leaves-individual-detail"
                element={<LeavesIndividualDetail />}
              />
              <Route path="/leaves-requests" element={<LeavesRequests />} />
              <Route path="/leaves-requests/:id" element={<LeavesRequests />} />
              <Route path="/leaves-individual-request/:id/request/:request_id" element={<LeavesRespondOnRequest />} />
              <Route
                path="/leaves-individual-details/:id"
                element={<LeavesIndividualDetails />}
              />
              <Route path="/holidays" element={<Holidays />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/ex-employees" element={<ExEmployees />} />
              <Route path="/attendence-screen" element={<AttendenceScreen />} />
              <Route path="/attendence-screen/:id" element={<AttendenceScreen />} />
              <Route path="/attendence-screen/:id/:attendance_id" element={<AttendenceScreen />} />
              <Route
                path="/attendence-overview"
                element={<AttendenceOverview />}
              />
              <Route
                path="/attendence-details/:id"
                element={<AttendenceDetails />}
              />
              <Route path="/logout" element={<Logout />} />
              <Route path="/add-employee" element={<Importcsv />} />
              <Route path="/setting" element={<Settings />} />

              <Route path="/developed-by" element={<DevelopedBy />} />
            </Routes>

            <Footer />
          </BrowserRouter>
        </div>
      </div>

      
    </>
  );
}

export default App;
