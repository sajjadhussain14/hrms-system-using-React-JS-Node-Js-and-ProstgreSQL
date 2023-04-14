import axios from "axios";
import React from "react";
import apiURL from "../config";

const client = axios.create({
  baseURL: apiURL + "mailer",
});

const SendEmail = async (dataArg) => {  
  const respData = await client.post("/send-email", dataArg);  
  return respData;
};

export { 
  SendEmail 
};
