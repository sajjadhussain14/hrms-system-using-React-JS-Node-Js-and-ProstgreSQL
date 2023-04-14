import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate, Link} from "react-router-dom";
import { GetUser } from "../API/auth";
import { SendEmail } from '../API/mailer';
import { GetSetting } from '../API/Settings';


const formReducer = (state, event) => {
  return {
    ...state,
    ['login_email']: event.login_email,
    ['login_pass']: event.login_pass
  }
 }


const Login = () => {
  
  const [user, setUser] = useState([]);
  const [formData, setFormData] = useReducer(formReducer, {});
  const [submitting, setSubmitting] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [setting, setSetting] = useState({})
  const navigate = useNavigate();

  localStorage.removeItem('role_slug')
  localStorage.removeItem('id')
  localStorage.removeItem('emp_id')
  localStorage.removeItem('email')
  localStorage.removeItem('name')
  localStorage.removeItem('desig_title')

 

  const handleSubmit = async event => {
    event.preventDefault();    
    let email = event.target.login_email.value
    let pass = event.target.login_pass.value
    
    if(!email || !pass) {
      setErrorMessages({ message: "Username/Password should not be empty." });
      return
    }

    try {
      let credentials = {login_email:email.replace(" ","").replace(" ","").replace(" ",""), login_pass:pass}
      let userData = await GetUser(credentials)
      
      let isLogin = false      
      if(userData && userData.data.emp_id > 0) {
        localStorage.setItem('id', userData.data.emp_id)
        localStorage.setItem('role_slug', userData.data.role_slug)
        localStorage.setItem('email', email)
        localStorage.setItem('name', userData.data.first_name + " " + userData.data.last_name) 
        localStorage.setItem('desig_title', userData.data.desig_title)        
        isLogin = true
                   
        //setIsSubmitted(true);
        window.location.href ="/hrms/"
       // window.location('/', { replace: true })
      } else {
        setErrorMessages({ message: "Invalid Username/Password" });        
      }           
      
    } catch {
      
      setUser([]);
    }
  }

  
  const renderErrorMessage = () =>
      errorMessages.message && (
      <div className="alert alert-danger">{ errorMessages.message }</div>
  );
  
  
  const renderForm = (
    <article className="loginFormContent">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            {renderErrorMessage()}
            <label htmlFor="exampleInputEmail1" className="form-label">
              Username
            </label>
            <input
              type="email"
              className="form-control"
              name="login_email"
              aria-describedby="emailHelp"
              placeholder='Email: name@domain.com'
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              name="login_pass"
            />
          </div>
          <button
            id="btn_login"
            type="submit"
            className="btn btn-primary"            
          >
            Log In
          </button>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
            />
            <label className="form-check-label " htmlFor="exampleCheck1">
              Remember me
            </label>
            <br></br>

            <Link className="form-check-label text-danger float-left under-line" to={'/forget-password'}>Forget Password</Link>
          </div>
          <hr />
        </form>
      </article> )
  
  
  return (
    <>
      <section id="login">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 col-md-6 col-sm-10 col-12 mx-auto">
            
            {isSubmitted ? <div>User is successfully logged in</div> : renderForm}

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
