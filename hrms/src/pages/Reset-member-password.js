import React, { useEffect, useReducer, useState } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import { SendEmail } from "../API/mailer";
import { FindEmail, CreateSalt, ValidateSalt, UpdatePassword } from "../API/forget-password";
import Sidenav from '../components/sidenav/Sidenav';


const formReducer = (state, event) => {
  return {
    ...state,
    ['login_email']: event.login_email,
    ['login_pass']: event.login_pass
  }
 }


const ResetMemberPassword = () => {
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCPass] = useState("");
  const [error, setError] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { reset_email, url } = useParams();
  const navigate = useNavigate();

  
  useEffect(() => {
    // Loader Delay
    setTimeout(() => {
      setLoading(false);
    }, 250);
  }, [])


    // Loader
    if(loading){return (
      <div class="loader">
        <div class="spinner-grow text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-success" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-danger" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-warning" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-info" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-light" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-dark" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-center">Loading please wait...</p>
      </div>)
    }
   
   

  const handleChangePassword = async event => {
    event.preventDefault();
    
    if(!pass || !cpass) {
      setError("Passwords are required.")
      return
    }
    if(pass != cpass) {
      setError("Password and Confirm Password are different.")
      return
    }
        
    try {
            
      // API call email
      UpdatePassword({email: reset_email, password: pass, url: 'reset_password_no_url'}).then((resp)=>{
        if(resp.data.status == 200) {
          setIsSubmitted(true)
          setError("")   
        } else {
          setError(resp.data.msg)   
        }
      });      
      
    } catch {   
      setError("Error in submitting.")   
      setPass("");
      setCPass("");
    }
  }

  const handleOnChangeInput = event =>{

    if(event.target.name == "email") {      
      if(!isValidEmail(event.target.value)) {
        setError("Invalid email address.")
        setValidEmail(false)
      } else {
        setError("")
        setValidEmail(true)
      }
      setUser(event.target.value)      
    }
    if(event.target.name == "pass") {
      if(event.target.value.length < 5) {
        setError("Password should be minimum 5 characters long.")
      } else {
        setError("")
      }      
      setPass(event.target.value)
    }
    if(event.target.name == "cpass") {
      if(event.target.value !== pass) {
        setError("Password and Confirm Password are different.")
      } else {
        setError("")       
      }      
      setCPass(event.target.value)
    } 
    
  }


  const isValidEmail = email => {
    return /\S+@\S+\.\S+/.test(email);
  }

  
  
  return (
    <>
      <Sidenav />
      <section id="memreset" class="col-12 col-lg-10">
        <div className="container-fluid">
          <div className="row">          
            <div className="col-lg-8 col-md-8 col-sm-10 col-12 mx-auto">            
              <article className="ResetFormContent">                
                {                
                <form >
                  <h2>Reset Password</h2>
                  { error && <div className="alert alert-danger p-2">{error}</div> }
                  
                  {                  
                  isSubmitted
                  ?
                  <div className="alert alert-success p-2">Your account passwored has been changed successfully.</div> 
                  :
                  <>
                  <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                      Username
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={reset_email}
                      placeholder='Email: name@domain.com'
                      onChange={handleOnChangeInput}
                      disabled={true}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="pass"
                      onChange={handleOnChangeInput}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="cpass"
                      onChange={handleOnChangeInput}
                    />
                  </div>
                  <hr />
                  <button
                    id="btn_login"                    
                    className="btn btn-primary"            
                    onClick={handleChangePassword}                    
                  >
                    Change Password
                  </button>                  
                  </>
                  }        
                       
                </form>
                
                }
              </article>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResetMemberPassword;
