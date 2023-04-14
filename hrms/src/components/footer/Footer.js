import React from 'react';
import { Link } from "react-router-dom";

import DevelopedBy from '../../pages/Developed-by';

const Footer = () => {

 
  let imageURL = localStorage.getItem("homeURL") + "/images/";
  

  return (
    <footer>
      
      <div class="container-fluid bg-transparent">
        <div class="row border-top">
            <div class="col-12 py-0 d-none">
                <a href="##" class="text-dark px-4 text-decoration-none">
              </a>
            </div>
        </div>
        <div class="row border-top">
            <div class="col-lg-4 col-md-5 col-12 py-2 companyName">
              <p>                
                <span>Asterisk Solutions Pvt Ltd.</span>
              </p>
            </div>
            <div class="col-lg-4 col-md-3 col-12 py-3 px-0 text-center">
              <p class="text-dark mb-0">All copyrights reserved © 2022.</p>
            </div>
            <div class="col-lg-4 col-md-4 col-12 py-2 text-end">
                <div class="footerlinks text-end">                
                    <Link to="/developed-by" class="text-dark px-4 text-decoration-none"><u>Developed By</u></Link>                    
                </div>
            </div>
        </div>
    </div>
    </footer>
  );
};



export default Footer;
