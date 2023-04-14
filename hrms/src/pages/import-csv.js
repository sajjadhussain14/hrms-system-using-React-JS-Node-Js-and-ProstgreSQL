import React, { useEffect, useState, useCallback } from "react";
import  {AddEmployee, AddEmployeeCSV, UpdateEmployee, DeleteEmployee, GetEmployees} from '../API/Employee';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';
import Sidenav from "../components/sidenav/Sidenav";

const Importcsv = () => {

  //let c = GetDepartment({"role_slug": "aaaaa"});
    
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isFileSelected, setIsFileSelected] = useState([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  // process CSV data
  const processData = dataString => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
 
    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      if (headers && row.length === headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] === '"')
              d = d.substring(1, d.length - 1);
            if (d[d.length - 1] === '"')
              d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }
         
        // remove the blank rows
        if (Object.values(obj).filter(x => x).length > 0) {
           list.push(obj);
        }
      }
    }
 
    // prepare columns list from headers
    const columns = headers.map(c => ({
      name: c,
      selector: c,
    }));
    
    setData(list);
    setColumns(columns);    
  }
 
  // handle file upload
  const handleFileUpload = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;      
      const wb = XLSX.read(bstr, { type: 'binary' });      
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];      
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */      
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  }

  
  // handle file upload
  const handleInsertCSV2DB = async e => {      
    
    if(!data.length) {
      //alert("Please select a CSV file!")
      setIsFileSelected(false)
      return
    } else {
      setIsFileSelected(true)
    }
    
    let records = data
    let user_role = {role_slug: "super_admin"}
    let newdata = {records, user_role}    
    AddEmployeeCSV(newdata).then(r=>{
      if(r.data.status == 200) setIsFileUploaded(true)
    })        
    

    newdata = {...data[0], ...user_role}    
    //let emp = AddEmployee(newdata)    
    
    newdata = {id:101, role_slug:"super_admin"}    
    //let emp = DeleteEmployee(newdata)   
    
    newdata = {...data[0], ...user_role}    
    //let emp = UpdateEmployee(newdata)    

    let id = {id:94}
    newdata = {...user_role, ...id}    
    GetEmployees(newdata).then(emp => {
      console.log(emp)      
    })    

    //console.log(id,'raza')
    
    //console.log(emp)
  }

  return (
    <>
      <Sidenav />
      <section class="col-lg-10 InnerContent">

      <article class="breadcrumbs  pt-4" id="breadCrumbs">
          <div class="container">
            <div class="row">
              <div class="col-lg-7 col-md-6 col-sm-5 col-5 breadcrumbContent">
                <h2> Add Employee </h2>

                <nav aria-label="breadcrumb">
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Dashboard</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                      Add Employee
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
                  <div class="timesheet mb-4 h-100 w-100 mw-100 ">
                    <p>
                      <strong>Select CSV to Upload Records</strong> 
                    </p>
                      
                    {!isFileSelected && <div class="alert alert-warning">Please select CSV file to upload.</div>}
                    {isFileUploaded && <div class="alert alert-success">CSV file uploaded Successfully!</div>}                    

                    <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
                    
                    { !isFileUploaded && <button onClick={handleInsertCSV2DB}>Upload CSV</button> }
                    { isFileUploaded && <button className="bg-secondary" disabled>Upload CSV</button> }
                    
                    <div class="punchIn h-auto w-100 mw-100">                        
                      
                      <DataTable
                        pagination
                        highlightOnHover
                        columns={columns}
                        data={data}
                      />

                    </div>
                    
                </div>                
              </div>

            </div>
          </div>
        </article>

        
      </section>
    </>
  );
};

export default Importcsv;