    
    import axios from 'axios';
    import React from "react";
    import apiURL from '../config'

    const client = axios.create({
      baseURL: apiURL + "employee"
    });
  
       
    
    
    const GetEmployees4Count = async (dataArg) => { 
      const respData = await client.post("/get-employees-count", dataArg);
                  
        return respData
    }


    const GetEmployees = async (dataArg) => { 
      const respData = await client.post("/get", dataArg);
               
        return respData
    }

    const GetEmployeeByID = async (dataArg) => { 
      const respData = await client.post("/get-by-id", dataArg);
                  
        return respData
    }

    const getReportToByID = async (dataArg) => { 
      const respData = await client.post("/get-report-to", dataArg);
                  
        return respData
    }

    
    const getAllReportTo = async (dataArg) => { 
      const respData = await client.post("/get-all-report-to", dataArg);
                  
        return respData
    }

    const GetEmployeeReportTo = async (dataArg) => { 
      const respData = await client.post("/get-emp-report-to", dataArg);
                  
        return respData
    }
    

    const GetEmployeeByIDs = async (dataArg) => { 
      const respData = await client.post("/get-employee-by-ids", dataArg);
                  
        return respData
    }

    
    const AddEmployee = async (dataArg) => { 
      const respData = await client.post("/add", dataArg);
                  
        return respData
    }
    

    const AddEmployeeCSV = async (dataArg) => { 
        const respData = await client.post("/add-csv", dataArg);
                  
        return respData;
    }
        
    
    const DeleteEmployee = async (dataArg) => {    
      const respData = await client.post("/delete", dataArg);
                
      return respData;      
    }


    const EditEmployeeProfile = async (dataArg) => {       
      let respData = await client.post("/edit-profile", dataArg);      
      return respData
    }

    const AcceptEmployeeResignation = async (dataArg) => { 
      const respData = await client.post("/accept-resignation", dataArg);
                  
        return respData
    }
  

    export {
      GetEmployees4Count,
      GetEmployees,
      GetEmployeeByID,
      getReportToByID,
      getAllReportTo,
      GetEmployeeReportTo,
      GetEmployeeByIDs,
      AddEmployee, 
      AddEmployeeCSV,      
      DeleteEmployee,
      EditEmployeeProfile,
      AcceptEmployeeResignation
    }


