import React, { useEffect, useState, useCallback, useRef } from "react";

import Sidenav from "../components/sidenav/Sidenav";


const DevelopedBy = () => {

  const [loading, setLoading] = useState(true);
    
  
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
 
  let width = 'col-12 col-lg-12'
  if(localStorage.getItem("role_slug") && localStorage.getItem("id")){
    width = "col-12 col-lg-10"
  }
  
  return ( 
    <>
      {
        localStorage.getItem("role_slug") && localStorage.getItem("id")
        ?
          <Sidenav />          
        :        
          ''
      }
      
      <div class={width}>
        <h2 class="text-center py-3 display-4  text-uppercase">Contributors</h2>      
        <div class="container py-2 mt-4 mb-4">      
          <div class="row">
              <div class="col-auto text-center flex-column d-none d-sm-flex">
                <div class="row h-50">
                  <div class="col border-right">&nbsp;</div>
                  <div class="col">&nbsp;</div>
                </div>
                <h5 class="m-2">
                  <span class="badge badge-pill bg-light border">&nbsp;</span>
                </h5>
                <div class="row h-50">
                  <div class="col border-right">&nbsp;</div>
                  <div class="col">&nbsp;</div>
                </div>
              </div>
              <div class="col py-2">
                <div class="card">
                  <div class="card-body">
                    <h4 class="card-title">Backend Development:</h4>
                    <div class="float-right ">Sajjad Hussain , Muhammad Raza</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-auto text-center flex-column d-none d-sm-flex">
                <div class="row h-50">
                  <div class="col">&nbsp;</div>
                  <div class="col">&nbsp;</div>
                </div>
                <h5 class="m-2">
                  <span class="badge badge-pill bg-light border">&nbsp;</span>
                </h5>
                <div class="row h-50">
                  <div class="col border-right">&nbsp;</div>
                  <div class="col">&nbsp;</div>
                </div>
              </div>
            
              <div class="col py-2">
                <div class="card">
                  <div class="card-body">
                    <h4 class="card-title">Designs:</h4>
                    <div class="float-right ">Muhammad Nawaz</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-auto text-center flex-column d-none d-sm-flex">
                <div class="row h-50">
                  <div class="col border-right">&nbsp;</div>
                  <div class="col">&nbsp;</div>
                </div>
                <h5 class="m-2">
                  <span class="badge badge-pill bg-light border">&nbsp;</span>
                </h5>
                <div class="row h-50">
                  <div class="col border-right">&nbsp;</div>
                  <div class="col">&nbsp;</div>
                </div>
              </div>
              <div class="col py-2">
                <div class="card">
                  <div class="card-body">
                    <h4 class="card-title">Frontend Development:</h4>
                    <div class="float-right ">Muhammad Abbas , Moin udin Hashmi</div>
                  </div>
                </div>
              </div>
            </div>
                  
            
            <div class="row">
              <div class="col-auto text-center flex-column d-none d-sm-flex">
                <div class="row h-50">
                  <div class="col border-right">&nbsp;</div>
                  <div class="col">&nbsp;</div>
                </div>
                <h5 class="m-2">
                  <span class="badge badge-pill bg-light border">&nbsp;</span>
                </h5>
                <div class="row h-50">
                  <div class="col">&nbsp;</div>
                  <div class="col">&nbsp;</div>
                </div>
              </div>
              <div class="col py-2">
                <div class="card">
                  <div class="card-body">
                  <h4 class="card-title">IT Support:</h4>
                    <div class="float-right  ">Ali Hassan</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-auto text-center flex-column d-none d-sm-flex">
                <div class="row h-50">
                  <div class="col border-right">&nbsp;</div>
                  <div class="col">&nbsp;</div>
                </div>
                <h5 class="m-2">
                  <span class="badge badge-pill bg-light border">&nbsp;</span>
                </h5>
                <div class="row h-50">
                  <div class="col">&nbsp;</div>
                  <div class="col">&nbsp;</div>
                </div>
              </div>
              <div class="col py-2">
                <div class="card">
                  <div class="card-body">
                    <h4 class="card-title">Technologies:</h4>
                    <div class="float-right ">Node JS, React JS, Redux, Axios, Javascript, Bootstrap 5, HTML, and CSS</div>
                                </div>
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-auto text-center flex-column d-none d-sm-flex">
                <div class="row h-50">
                  <div class="col border-right">&nbsp;</div>
                  <div class="col">&nbsp;</div>
                </div>
                <h5 class="m-2">
                  <span class="badge badge-pill bg-light border">&nbsp;</span>
                </h5>
                <div class="row h-50">
                  <div class="col">&nbsp;</div>
                  <div class="col">&nbsp;</div>
                </div>
              </div>
              <div class="col py-2">
                <div class="card">
                  <div class="card-body">
                    <h4 class="card-title">Database:</h4>
                    <div class="float-right ">PostgreSQL</div>                    
                  </div>
                </div>
              </div>
            </div>
          
        </div>
      </div>
    </>
  );
};

export default DevelopedBy;
