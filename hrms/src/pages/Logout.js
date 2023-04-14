import React, { useEffect, useState } from "react";
import { useNavigate,Redirect} from "react-router-dom";
import Sidenav from "../components/sidenav/Sidenav";
import apiURL from '../config'
import axios from 'axios';

const Logout = () => {

  const navigate = useNavigate();
  
  useEffect(async () => {
    try {
      localStorage.removeItem('role_slug')
      localStorage.removeItem('id')
      localStorage.removeItem('emp_id')
      localStorage.removeItem('email')
      localStorage.removeItem('name')
      localStorage.removeItem('desig_title')    
    } catch {   
    }
    navigate('/login', { replace: true })    
  }, []);

  return (
    <>   
    </>
  );
};

export default Logout;
