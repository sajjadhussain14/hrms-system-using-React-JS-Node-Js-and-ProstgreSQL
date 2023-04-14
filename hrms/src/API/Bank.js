      
  import axios from 'axios';
  import React from "react";
  import apiURL from '../config'

  const client = axios.create({
    baseURL: apiURL + "bank"
  }); 
    
  const GetAllBank= async (dataArg) => { 
    const respData = await client.post("/get-all", dataArg);
                
      return respData
  }

  const GetBankById = async (dataArg) => { 
    const respData = await client.post("/get-by-id", dataArg);
                
      return respData
  }

  

  
  export {
    GetAllBank,
    GetBankById
  }