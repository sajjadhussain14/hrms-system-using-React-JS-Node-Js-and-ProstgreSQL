    
    import axios from 'axios';
    import React from "react";
    import apiURL from '../config'

    const client = axios.create({
      baseURL: apiURL + "payroll"
    });
  
    
    const GetPayrolls = async (dataArg) => {       
      const respData = await client.post("/get", dataArg);
                  
        return respData
    }
        
    const GetPayrollsByEmployeeId = async (dataArg) => { 
      const respData = await client.post("/get", dataArg);
                  
        return respData
    }

    
    const AddPayroll = async (dataArg) => { 
      const respData = await client.post("/add", dataArg);
                  
        return respData
    }


    const GenerateSalarySlip4All = async (dataArg) => { 
      const respData = await client.post("/generate-salary-slip", dataArg);
                  
        return respData
    }


    const ReleaseSalarySlip4All = async (dataArg) => { 
      const respData = await client.post("/release-salary-slip", dataArg);
                  
        return respData
    }

    
    const IsSalaryGeneratedReleased = async (dataArg) => { 
      const respData = await client.post("/is-salary-generated-released", dataArg);
                  
        return respData
    }


    
    const EditEmployeePayroll = async (dataArg) => {    
      const respData = await client.post("/edit-emp-payroll", dataArg);
                
      return respData;
    }

    const GetPayrollByID = async (dataArg) => {    
      const respData = await client.post("/get-payroll-by-id", dataArg);
                
      return respData;
    }

    
    const DeletePayroll = async (dataArg) => {    
      const respData = await client.post("/delete", dataArg);
                
      return respData;      
    }


     

    export {
      GetPayrolls,
      GetPayrollsByEmployeeId,
      GetPayrollByID,
      GenerateSalarySlip4All,
      ReleaseSalarySlip4All,
      IsSalaryGeneratedReleased,
      AddPayroll, 
      EditEmployeePayroll,
      DeletePayroll
    }


