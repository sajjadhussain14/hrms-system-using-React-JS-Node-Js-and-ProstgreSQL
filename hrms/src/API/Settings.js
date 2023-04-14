import axios from "axios";
import React from "react";
import apiURL from "../config";

const client = axios.create({
  baseURL: apiURL + "setting",
});

const GetSetting = async (dataArg) => {
  const respData = await client.post("/get-setting", dataArg);
  return respData;
};

const UpdateSetting = async (dataArg) => {
    const respData = await client.post("/update-setting", dataArg);
    return respData;
};


const DeleteAllLeaves = async (dataArg) => {
  const respData = await client.post("/delete-all-leaves", dataArg);
  return respData;
};


const DeleteAllAttendance = async (dataArg) => {
  const respData = await client.post("/delete-all-attendance", dataArg);
  return respData;
};


const DeleteAllPayslip = async (dataArg) => {
  const respData = await client.post("/delete-all-payslip", dataArg);
  return respData;
};


const DeleteEmployeeById = async (dataArg) => {
  const respData = await client.post("/delete-employee", dataArg);
  return respData;
};


const ResetAllUsersPassword = async (dataArg) => {
  const respData = await client.post("/reset-all-password", dataArg);
  return respData;
};




export { 
  GetSetting, 
  UpdateSetting,
  DeleteAllLeaves,
  DeleteAllAttendance,
  DeleteAllPayslip,
  DeleteEmployeeById,
  ResetAllUsersPassword
};
