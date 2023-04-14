import axios from "axios";
import React from "react";
import apiURL from "../config";

const client = axios.create({
  baseURL: apiURL + "users",
});

const GetUser = async (dataArg) => {
  const respData = await client.post("/auth", dataArg);
  //console.log(respData," test...");
  return respData;
};

export { GetUser };
