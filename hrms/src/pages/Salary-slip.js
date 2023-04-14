import React, { useEffect, useState, useRef } from "react";
import Sidenav from "../components/sidenav/Sidenav";
import { GetEmployees } from "../API/Employee"; 
import { useParams, Link, useNavigate } from "react-router-dom";
import EditableInput from "../components/elements/EditableInput";
import {EditEmployeePayroll, GetPayrollByID} from "../API/Payroll"
import { GetBankById } from "../API/Bank";
import jsPDF from 'jspdf'; 
import { useReactToPrint } from "react-to-print"


const SalarySlip = () => {

  const [employeeDetail, setEmployeeDetail] = useState([]);
  const [payrollDetail, SetPayrollDetail] = useState({});  
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [bank, setBank] = useState({});
  const { id, payroll_id } = useParams();
  const componentRef = useRef();
  const month =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]


  let login_id = { id: localStorage.getItem('id') };
  let login_role = { role_slug: "super_admin" };
  let emp_id = { emp_id: id };
  let payrollId = { payroll_id: payroll_id };
  let newdata = { ...login_role, ...login_id, ...emp_id,  ...payrollId};

  


  const handlePrint = useReactToPrint({
    content: ()=>componentRef.current,
    documentTitle: 'Salary-Slip',
    onAfterPrint: ()=>console.log("print success")
    
  });


  
  useEffect(() => {
    try {
      // API CALLS
      apiCalls()

      // Loader Delay
      setTimeout(() => {
        setLoading(false);
      }, 250);

    } catch {
      setEmployeeDetail({});      
      SetPayrollDetail([]);
      setBank({});
      setLoading(false);
    }
  }, []);

  

  const apiCalls = async (e) => {    
    
    // API call get employee details
    GetEmployees(newdata).then((resp)=>{
        // API call to get bank info
        const data = {...newdata, bank_id: resp.data.bank_id} 
        GetBankById(data).then((resp)=>{
          setBank(resp.data);               
        });
        setEmployeeDetail(resp.data); 
    });
    
    // API call get payroll 
    GetPayrollByID(newdata).then((resp)=>{
        SetPayrollDetail(resp.data);                           
    });        
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

  
  const toPDF = (event) => {        
    let doc = new jsPDF("l", 'pt', 'a4',true);         
    doc.html(document.getElementById('payslip'), {
      callback: () => {
        doc.save("PayStub-" + month[employeeDetail.pay_month] + "-" + employeeDetail.pay_year );
      }
    });    
  }

  const print = (event) => {    
    let doc = new jsPDF("l", 'pt', 'a4',true);         
    doc.html(document.getElementById('payslip'), {
      callback: () => {
        doc.autoPrint()
        doc.output("dataurlnewwindow");
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
              <div class="col-lg-6 col-md-6 col-sm-5 col-5 breadcrumbContent">
                <h2>Employee Salary</h2>

                <nav aria-label="breadcrumb">
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Dashboard</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                      Employee Salary
                    </li>
                  </ol>
                </nav>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-7 col-7 menuButton text-end">
                
                <div class="btn-group mx-2" role="group" aria-label="Basic example">
                  <button type="button" class="btn" onClick={handlePrint}>
                    PDF
                  </button>
                  <button type="button" class="btn" onClick={handlePrint}>
                    <i class="fas fa-print"></i> Print
                  </button>
                  <a type="button" class="btn" href={"mailto:" + employeeDetail.emp_email}>
                    <i class="fas fa-paper-plane"></i> Send
                  </a>
                </div>
                <Link type="button" class="btn btn-primary employee mb-1" to={'/salary-detail/' + id}>
                  <i class="fas fa-chevron-left"></i> Go Back
                </Link>
              </div>
            </div>
          </div>
        </article>

        <section id="payslip" className="pdf" ref={componentRef} >
          <div class="container payslipinner" id="payslipdiv">
            <div class="row">
              <div class="col-12">
                <h2>PAYSLIP FOR THE MONTH OF {month[employeeDetail.pay_month] + " " + employeeDetail.pay_year}</h2>
              </div>
              <div class="col-12 d-flex justify-content-between mb-4 payslipContentHolder">
                <div class="leftside">
                  <img src="./images/Image 2.png" class="img-fluid" alt="" />
                  <span class="address">Asterisk Solutions Pvt. Ltd.</span>
                  <span class="address">
                    565, St # 35, NPF, E-11/3, Islamabad 44000, Pakistan
                    <br />
                    Tel: 92-51-2318-234 <br />
                    Fax: 92-51-2318-235
                  </span>
                  <strong>{employeeDetail.first_name} {employeeDetail.last_name}</strong>
                  <p>
                  {employeeDetail.desig_title} <br />
                    ID: {employeeDetail.emp_number} <br />
                    Joining Date: {employeeDetail.joining_date} {/*1 Jan 2007*/}
                  </p>
                </div>
                <div class="rightside">
                  <h3>PAYSLIP #{payroll_id}</h3>
                  <h3 class="mb-2">GROSS SALARY: RS. {parseFloat(payrollDetail.pay_gross).toFixed(2)}</h3>
                  <p>
                    Salary Month: {month[employeeDetail.pay_month] + ", " + employeeDetail.pay_year}
                    <span class="d-block"> Tax No.: {employeeDetail.emp_ntn}</span>
                    <span class="d-block">Terms: Bank Transfer</span>
                  </p>
                </div>
              </div>
              <div class="col-12">
                <h4>Earnings</h4>
              </div>
              <div class="col-lg-6 salaryInfo">
                <p>
                  <strong>Basic Salary</strong> <span>Rs. {parseFloat(payrollDetail.pay_basic).toFixed(2)}</span>
                </p>
                <p>
                  <strong>House Rent Allowance</strong>
                  <span>Rs. {parseFloat(payrollDetail.house_allowance).toFixed(2)}</span>
                </p>
                <p>
                  <strong>Conveyance</strong> <span>Rs. {parseFloat(payrollDetail.conveyance_allowance).toFixed(2)}</span>
                </p>
                <p>
                  <strong>Utility Allowance</strong> <span>Rs. {parseFloat(payrollDetail.utility_allowance).toFixed(2)}</span>
                </p>
                <p>
                  <strong>Medical</strong> <span>Rs. {parseFloat(payrollDetail.medical_allowance).toFixed(2)}</span>
                </p>
                <p>
                  <strong>Overtime</strong> <span>Rs. {parseFloat(payrollDetail.overtime).toFixed(2)}</span>
                </p>
                <p>
                  <strong>Bonus</strong> <span>Rs. {parseFloat(payrollDetail.pay_bonus).toFixed(2)}</span>
                </p>
                <p>
                  <strong>Other Allowance</strong> <span>Rs. {parseFloat(payrollDetail.other_allowance).toFixed(2)}</span>
                </p>
              </div>

              <div class="col-lg-6 salaryInfo">
                <p>
                  <strong>Taxable Income</strong> <span>Rs. {parseFloat(payrollDetail.tax_able).toFixed(2)}</span>
                </p>
                <p>
                  <strong>Tax Deducted</strong> <span>Rs. {parseFloat(payrollDetail.tax_deducted).toFixed(2)}</span>
                </p>
                <p>
                  <strong>EOBI Contribution</strong> <span>Rs. {parseFloat(payrollDetail.eobi_contribution).toFixed(2)}</span>
                </p>
                <p>
                  <strong>Net Pay Transferred</strong>
                  <span>Rs. {parseFloat(payrollDetail.net_pay_transferred).toFixed(2)}</span>
                </p>
                <p>
                  <strong>Account No.</strong> <span>{employeeDetail.account_number}</span>
                </p>
                <p>
                  <strong>Bank</strong>
                  <span>{bank.bank_name} {bank.bank_address}.</span>
                </p>
              </div>
              <div class="col-12 commentpart">
                <p>
                  <strong>COMMENTS:</strong> Comments will be show…
                </p>
              </div>
            </div>
          </div>
        </section>

      </section>
    </>
  );
};

export default SalarySlip;
