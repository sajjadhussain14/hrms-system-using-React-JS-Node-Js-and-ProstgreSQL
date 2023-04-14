import axios from "axios";
import React from "react";
import apiURL from "../config";

const client = axios.create({
  baseURL: apiURL + "leave",
});

const GetLeaves = async (dataArg) => {
  const respData = await client.post("/get", dataArg);
  console.log(respData);
  return respData;
};

const AddLeave = async (dataArg) => {
  const respData = await client.post("/add", dataArg);
  console.log(respData);
  return respData;
};

const DeleteLeave = async (dataArg) => {
  const respData = await client.post("/delete", dataArg);
  console.log(respData);
  return respData;
};

const UpdateLeave = async (dataArg) => {
  const respData = await client.post("/edit-leave", dataArg);
  return respData;
};

export { GetLeaves, AddLeave, UpdateLeave, DeleteLeave };
