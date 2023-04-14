    
import axios from 'axios';
import React from "react";
import apiURL from '../config'

const client = axios.create({
  baseURL: apiURL + "designation"
});



const GetDesignation = async (dataArg) => { 
  const respData = await client.get("/", dataArg);
            
  return respData
}




export {
  GetDesignation
}