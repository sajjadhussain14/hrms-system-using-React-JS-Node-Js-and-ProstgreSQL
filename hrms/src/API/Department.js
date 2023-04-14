    
import axios from 'axios';
import React from "react";
import apiURL from '../config'

const client = axios.create({
  baseURL: apiURL + "department"
});



const GetDepartment = async (dataArg) => { 
  const respData = await client.get("/", dataArg);
            
  return respData
}

        

export {
  GetDepartment
}