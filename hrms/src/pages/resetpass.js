import React, { useEffect, useReducer, useState } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import { FindEmail, CreateSalt, ValidateSalt, UpdatePassword } from "../API/forget-password";


const ResetPassword = () => {
  
  const [user, setUser] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { url } = useParams();
  const navigate = useNavigate();



  useEffect(() => {
    
    // API call validate reset url
    ValidateSalt({url: url}).then((resp)=>{
        if(resp.data && resp.data.length >= 1) {          
            navigate('/forget-password/' + resp.data[0].email1 + '/' + url, { replace: true })           
        } else {
          setError("Sorry! the reset password link is expired. Try again to get the link. Thank You.")
        }
      });
    
  }, [])
  

  
  return (error &&
    <>
      <section id="login">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 col-md-6 col-sm-10 col-12 mx-auto">            
                <article className="loginFormContent">                
                  <div className="mb-3">
                    <h2>Reset Password</h2>
                    { <div className="alert alert-danger p-2">{error}</div> }
                    </div>                    
                </article>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResetPassword;
