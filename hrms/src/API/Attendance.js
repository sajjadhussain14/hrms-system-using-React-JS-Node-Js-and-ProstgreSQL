    
  import axios from 'axios';
  import React from "react";
  import apiURL from '../config'

  const client = axios.create({
    baseURL: apiURL + "attendance"
  }); 
    
  const GetAttendanceById = async (dataArg) => { 
    const respData = await client.post("/get-by-id", dataArg);
                
      return respData
  }

  const GetAttendanceByEmpId = async (dataArg) => { 
    const respData = await client.post("/get-by-emp", dataArg);
                
      return respData
  }

  const GetMonthlyAttendance = async (dataArg) => { 
    const respData = await client.post("/get-this-month", dataArg);
                
      return respData
  }

  const PunchIn = async (dataArg) => { 
    const respData = await client.post("/punchin", dataArg);
                
      return respData
  }

  const GetTodayAttendance = async (dataArg) => { 
    const respData = await client.post("/get-today-attendance", dataArg);
                
      return respData
  }

  
  const GetEmployeeAttendance = async (dataArg) => { 
    const respData = await client.post("/get-by-emp", dataArg);
                
      return respData
  }


  const AddAttendanceArray = async (dataArg) => { 
    const respData = await client.post("/add-attendance-array", dataArg);
                
      return respData
  }

  

  export {
    GetMonthlyAttendance,
    GetAttendanceById,
    GetAttendanceByEmpId,
    PunchIn,
    GetTodayAttendance,
    GetEmployeeAttendance,
    AddAttendanceArray
  }