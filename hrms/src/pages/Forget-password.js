import React, { useEffect, useReducer, useState } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import { SendEmail } from "../API/mailer";
import { FindEmail, CreateSalt, ValidateSalt, UpdatePassword } from "../API/forget-password";


const formReducer = (state, event) => {
  return {
    ...state,
    ['login_email']: event.login_email,
    ['login_pass']: event.login_pass
  }
 }


const ForgetPassword = () => {
  
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

  
  const handleSubmit = event => {
    event.preventDefault();
    
    if(!validEmail) {
      setError("Invalid email address.")
      return
    }
   
    try {
      
      // Set mail parameters
      let maildata = {
        to_email: user, 
        from_email: "no-reply@asterisksolutions.com", 
        from_name: "Asterisk Solutions", 
        subject_email: "Forget Password", 
        body_email: ""
      }
            
      // API call find email
      FindEmail({email: user}).then((resp)=>{   
        if(resp.data && resp.data.length >= 1) {          
          let argData = {emp_id: resp.data[0].emp_id, email: resp.data[0].email1, name: resp.data[0].first_name}          
          // API call create salt
          CreateSalt(argData).then((resp2)=>{
            // set email body
            maildata.body_email = ("<div>Dear " + argData.name + ", <br></br><br></br>" +
                                    "Click below link to reset you account password. <br></br><br></br>" +                  
                                    "<a href='" + localStorage.getItem("homeURL") + "/reset/" + resp2.data.url + "'><b>Reset Password</b></a> <br></br><br></br>" +  
                                    "Thank you,<br></br>" +
                                    "Admin Asterisk Solutions.</div>")                 
            // API call send email
            SendEmail(maildata).then((resp3)=>{
              console.log(resp3.data)
              if(resp3.status == 200) setIsSubmitted(true)
            });                    
          });        
        } else {
          setError("Email does not exist.")
        }
      });
      
    } catch(error) {      
      setUser([]);
    }
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
      UpdatePassword({email: reset_email, password: pass, url: url}).then((resp)=>{
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
      <section id="login">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 col-md-6 col-sm-10 col-12 mx-auto">
            
              <article className="loginFormContent">                
                {
                (url && url != undefined) && (reset_email && reset_email != undefined) 
                ?                                
                <form >
                  <h2>Change Password</h2>
                  { error && <div className="alert alert-danger p-2">{error}</div> }
                  
                  {                  
                  isSubmitted
                  ?
                  <div className="alert alert-success p-2">Passwored has been updated successfully. You can login to your account.<br></br><br></br>Thank you.</div> 
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
                  <div className="mb-3 p-0 form-check text-muted text-decoration-underline">                        
                    <Link className="form-check-label text-success under-line" to={'/login'}>Login</Link>
                  </div>        
                </form>
                :
                <form >
                  <div className="mb-3">
                  <h2>Reset Password</h2>
                    { error && <div className="alert alert-danger p-2">{error}</div> }
                    {!isSubmitted &&
                      <>
                      <label htmlFor="exampleInputEmail1" className="form-label">
                        Username
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        aria-describedby="emailHelp"
                        placeholder='Email: name@domain.com'
                        onChange={handleOnChangeInput}
                      />
                    </>
                    }
                  </div>                  
                  {
                    isSubmitted
                    ?
                    <div className="alert alert-success p-2">Rest link has sent to <b>{user}</b>. Please check the email address.<br></br><br></br>Thank you.</div> 
                    : 
                    <button
                      id="btn_login"                    
                      className="btn btn-primary"            
                      onClick={handleSubmit}                    
                    >
                      Submit
                    </button>
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

export default ForgetPassword;
