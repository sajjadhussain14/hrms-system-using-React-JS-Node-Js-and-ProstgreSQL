    
    import axios from 'axios';
    import React from "react";
    import apiURL from '../config'

    
    const client = axios.create({
      baseURL: apiURL + "leave-request"
    });
  
    
    
    const GetLeaveRequests = async (dataArg) => { 
      const respData = await client.post("/get", dataArg);
                  
        return respData
    }

    const GetPendingLeaveRequest = async (dataArg) => { 
      const respData = await client.post("/pending", dataArg);
                  
        return respData
    }

    const GetThisYearLeaves = async (dataArg) => { 
      const respData = await client.post("/this-year-leaves", dataArg);
                  
        return respData
    }

        
    const AddLeaveRequests = async (dataArg) => {       
      const respData = await client.post("/add", dataArg);
                  
        return respData
    }

    const ResponseToLeaveRequests = async (dataArg) => { 
      const respData = await client.post("/response", dataArg);
                  
        return respData
    }

    const GetApprovedLeaveRequest = async (dataArg) => { 
      const respData = await client.post("/approved", dataArg);
                  
        return respData
    }
    
    const DeleteLeaveRequests = async (dataArg) => {    
      const respData = await client.post("/delete", dataArg);
                
      return respData;      
    }


    const UpdateLeaveRequests = async (dataArg) => {    
      const respData = await client.put("/", dataArg);
                
      return respData;
    }
  

    export {
      GetLeaveRequests,
      AddLeaveRequests,
      ResponseToLeaveRequests,
      GetApprovedLeaveRequest,
      GetPendingLeaveRequest,
      GetThisYearLeaves, 
      UpdateLeaveRequests,
      DeleteLeaveRequests
    }


