      
  import axios from 'axios';
  import React from "react";
  import apiURL from '../config'

  const client = axios.create({
    baseURL: apiURL + "inventory"
  }); 
    

  const GetInventoryByEmpId = async (dataArg) => { 
    const respData = await client.post("/get-by-emp-id", dataArg);
                
      return respData
  }
 

  
  export {
    GetInventoryByEmpId
  }