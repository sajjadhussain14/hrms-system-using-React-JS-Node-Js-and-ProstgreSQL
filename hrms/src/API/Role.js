    
    import axios from 'axios';
    import React from "react";
    import apiURL from '../config'

    const client = axios.create({
      baseURL: apiURL + "role"
    });
  
     
    
    const GetRole = async (dataArg) => { 
      const respData = await client.post("/get", dataArg);
                  
        return respData
    }



    export {
      GetRole
    }