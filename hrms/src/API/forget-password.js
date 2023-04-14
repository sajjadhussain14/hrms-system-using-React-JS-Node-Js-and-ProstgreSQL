import axios from "axios";
import React from "react";
import apiURL from "../config";

const client = axios.create({
  baseURL: apiURL + "fpass",
});

const FindEmail = async (dataArg) => {  
    const respData = await client.post("/find-email", dataArg); 
    return respData;
};


const CreateSalt = async (dataArg) => {  
    const respData = await client.post("/create-salt", dataArg);  
    return respData;
};


const ValidateSalt = async (dataArg) => {  
    const respData = await client.post("/validate-salt", dataArg);  
    return respData;
};


const UpdatePassword = async (dataArg) => {  
    const respData = await client.post("/update-password", dataArg);  
    return respData;
};

export { 
  FindEmail,
  CreateSalt,
  ValidateSalt,
  UpdatePassword
};
