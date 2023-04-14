    
  import axios from 'axios';
  import React from "react";
  import apiURL from '../config'

  const client = axios.create({
    baseURL: apiURL + "holidays"
  }); 
    
  const GetHolidays = async () => { 
    const respData = await client.get("/");
      return respData
  }

  const AddHoliday = async (dataArg) => { 
    const respData = await client.post("/add-holiday", dataArg);
      return respData
  }

  const DeleteHoliday = async (dataArg) => { 
    const respData = await client.post("/delete-holiday", dataArg);
      return respData
  }

  export {
    GetHolidays,
    AddHoliday,
    DeleteHoliday
  }