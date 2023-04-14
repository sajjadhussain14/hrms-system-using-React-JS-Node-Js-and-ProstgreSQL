import React, { useEffect, useState } from "react";
import Sidenav from "../components/sidenav/Sidenav";
import { GetEmployees } from "../API/Employee"; 
import { useParams, Link, useNavigate } from "react-router-dom";
import EditableInput from "../components/elements/EditableInput";
import {EditEmployeePayroll, GetPayrollByID} from "../API/Payroll"
import { GetBankById } from "../API/Bank";

const EditSalarySlip = () => {

  const [employeeDetail, setEmployeeDetail] = useState([]);
  const [payrollDetail, SetPayrollDetail] = useState({});  
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [bank, setBank] = useState({});
  const { id, payroll_id } = useParams();
  const navigate = useNavigate();
  const month =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]


  let login_id = { id: localStorage.getItem('id') };
  let login_role = { role_slug: "super_admin" };
  let emp_id = { emp_id: id };
  let payrollId = { payroll_id: payroll_id };
  let newdata = { ...login_role, ...login_id, ...emp_id,  ...payrollId};
 

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
    
  useEffect(() => {
    try {
      // API CALLS
      apiCalls()

      // Loader Delay
      setTimeout(() => {
        setLoading(false);
      }, 250);

    } catch {
      setEmployeeDetail([]);      
      SetPayrollDetail([]);
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


    
    // handle editable input value
    const handleChangeEditableInput = data => {
        payrollDetail[data.key] = data.value;       
        setEditing(true);
    };
        
    // handle save
    const handleSave = async data => {
        let data_tem = { ...login_role, ...login_id, ...emp_id,  ...payrollDetail};
        data_tem.pay_gross = parseFloat(payrollDetail.tax_deducted) + parseFloat(payrollDetail.eobi_contribution) + parseFloat(payrollDetail.net_pay_transferred)        
        EditEmployeePayroll(data_tem).then((resp)=>{
            if(resp.status && resp.status == 200) navigate("/salary-detail/" + id)              
        });         
    };

    // handle cancel
    const handleCancel = data => {
        if(editing) {
        alert("Data is changed")      
        }
    };
  
  return (payrollDetail.pay_basic!=undefined &&
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
                      Edit Employee Salary
                    </li>
                  </ol>
                </nav>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-7 col-7 menuButton text-end">                
                {
                  editing 
                  ?
                  <a className="btn btn-secondary employee mx-1"  onClick={handleSave }>
                    <i className="fa fa-check"></i> Save Details
                  </a>
                  :
                  <a className="btn btn-secondary employee mx-1 disabled" aria-disabled>
                    <i className="fa fa-check"></i> Save Details
                  </a>
                }
                <Link className="btn btn-secondary bg-danger employee" to={"/salary-detail/" + id}>
                  <i className="fa fa-times"></i> Cancel
                </Link>
              </div>
            </div>
          </div>
        </article>

        <section id="payslip" class="pdf">
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
                  <h3 class="mb-2">GROSS SALARY: RS. {payrollDetail.pay_gross.toFixed(2)}</h3>
                  <p>
                    Salary Month: {month[payrollDetail.pay_month-1] + ", " + payrollDetail.pay_year}
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
                  <strong>Basic Salary</strong> 
                  <span class="d-flex">Rs.&nbsp; <EditableInput type="number" width="100px" name="pay_basic" text={parseFloat(payrollDetail.pay_basic).toFixed(2)} handleChangeEditableInput={handleChangeEditableInput} /></span>
                </p>
                <p>
                  <strong>House Rent Allowance</strong>
                  <span class="d-flex">Rs.&nbsp;  <EditableInput type="number" width="100px" name="house_allowance" text={parseFloat(payrollDetail.house_allowance).toFixed(2)} handleChangeEditableInput={handleChangeEditableInput} /></span>
                </p>
                <p>
                  <strong>Conveyance</strong> 
                  <span class="d-flex">Rs.&nbsp;  <EditableInput type="number" width="100px" name="conveyance_allowance" text={parseFloat(payrollDetail.conveyance_allowance).toFixed(2)} handleChangeEditableInput={handleChangeEditableInput} /></span>
                </p>
                <p>
                  <strong>Utility Allowance</strong> 
                  <span class="d-flex">Rs.&nbsp;  <EditableInput type="number" width="100px" name="utility_allowance" text={parseFloat(payrollDetail.utility_allowance).toFixed(2)} handleChangeEditableInput={handleChangeEditableInput} /></span>
                </p>
                <p>
                  <strong>Medical</strong> 
                  <span class="d-flex">Rs.&nbsp;  <EditableInput type="number" width="100px" name="medical_allowance" text={parseFloat(payrollDetail.medical_allowance).toFixed(2)} handleChangeEditableInput={handleChangeEditableInput} /></span>
                </p>
                <p>
                  <strong>Overtime</strong> 
                  <span class="d-flex">Rs.&nbsp;  <EditableInput type="number" width="100px" name="overtime" text={parseFloat(payrollDetail.overtime).toFixed(2)} handleChangeEditableInput={handleChangeEditableInput} /></span>
                </p>
                <p>
                  <strong>Bonus</strong> 
                  <span class="d-flex">Rs.&nbsp;  <EditableInput type="number" width="100px" name="pay_bonus" text={parseFloat(payrollDetail.pay_bonus).toFixed(2)} handleChangeEditableInput={handleChangeEditableInput} /></span>
                </p>
                <p>
                  <strong>Other Allowance</strong> 
                  <span class="d-flex">Rs.&nbsp;  <EditableInput type="number" width="100px" name="other_allowance" text={parseFloat(payrollDetail.other_allowance).toFixed(2)} handleChangeEditableInput={handleChangeEditableInput} /></span>
                </p>
              </div>

              <div class="col-lg-6 salaryInfo">
                <p>
                  <strong>Taxable Income</strong> 
                  <span class="d-flex">Rs.&nbsp;  <EditableInput type="number" width="100px" name="tax_able" text={parseFloat(payrollDetail.tax_able).toFixed(2)} handleChangeEditableInput={handleChangeEditableInput} /></span>
                </p>
                <p>
                  <strong>Tax Deducted</strong> 
                  <span class="d-flex">Rs.&nbsp;  <EditableInput type="number" width="100px" name="tax_deducted" text={parseFloat(payrollDetail.tax_deducted).toFixed(2)} handleChangeEditableInput={handleChangeEditableInput} /></span>
                </p>
                <p>
                  <strong>EOBI Contribution</strong> 
                  <span class="d-flex">Rs.&nbsp;  <EditableInput type="number" width="100px" name="eobi_contribution" text={parseFloat(payrollDetail.eobi_contribution).toFixed(2)} handleChangeEditableInput={handleChangeEditableInput} /></span>
                </p>
                <p>
                  <strong>Net Pay Transferred</strong>
                  <span class="d-flex">Rs.&nbsp;  <EditableInput type="number" width="100px" name="net_pay_transferred" text={parseFloat(payrollDetail.net_pay_transferred).toFixed(2)} handleChangeEditableInput={handleChangeEditableInput} /></span>
                </p>
                <p>
                  <strong>Account No.</strong> <span>{employeeDetail.account_number}</span>
                </p>
                <p>
                  <strong>Bank</strong>
                  <span>{bank.bank_name}, {bank.bank_address}.</span>
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

export default EditSalarySlip;
