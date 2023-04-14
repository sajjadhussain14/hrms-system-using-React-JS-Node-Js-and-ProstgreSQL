import React from "react";
import Sidenav from "../components/sidenav/Sidenav";

const NoticeBoard = () => {
  return (
    <>
      <Sidenav />
      <section class="col-lg-10 InnerContent">
        <article id="employeeProfile" class="employeeLeaveDetailProfile">
          <div class="container p-0">
            <div class="row">
              <div class="col-12 d-flex align-items-center h-100 info">
                <img src="./images/Ellipse 59.png" class="img-fluid" alt="" />
                <p>
                  <span class="name d-block">Sajjad Hussain</span>
                  <span class="designation">Manager web Team</span>
                </p>
              </div>
            </div>
          </div>
        </article>
        <section id="employeeDashboard">
          <div class="container">
            <div class="row">
              <div class="col-lg-8 col-md-8 col-sm-12 col-12 mb-3">
                <div class="row">
                  <div class="col-12 mb-3 mt-4">
                    <h3 class="my-3">TODAY</h3>
                    <div class="col-12 mb-3">
                      <div class="d-flex justify-content-between align-items-center contentHolder">
                        <span class="active">
                          <img
                            src="./images/hourglass.png"
                            class="img-fluid"
                            alt=""
                          />
                          <strong>Mubashir Qyyum is off sick today</strong>
                        </span>
                        <span class="text-end">
                          <img
                            src="./images/Ellipse 52.png"
                            class="img-fluid"
                            alt=""
                          />
                        </span>
                      </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center contentHolder">
                      <span>
                        <img
                          src="./images/briefcase-fill.png"
                          class="img-fluid"
                          alt=""
                        />
                        <strong class="innerText">
                          You are available today
                        </strong>
                      </span>
                      <span class="text-end">
                        <img
                          src="./images/Ellipse 52.png"
                          class="img-fluid"
                          alt=""
                        />
                      </span>
                    </div>
                  </div>
                  <div class="col-12 mb-3">
                    <div class="d-flex justify-content-between align-items-center contentHolder">
                      <span>
                        <img
                          src="./images/calculator-fill.png"
                          class="img-fluid"
                          alt=""
                        />
                        <strong class="innerText">
                          Sajjad Hussaian will be away in 2nd half
                        </strong>
                      </span>
                      <span class="text-end">
                        <img
                          src="./images/Ellipse 52.png"
                          class="img-fluid"
                          alt=""
                        />
                      </span>
                    </div>
                  </div>

                  <div class="col-12 mb-3">
                    <h3 class="my-3">TODAY</h3>
                    <div class="d-flex justify-content-between align-items-center contentHolder">
                      <span>
                        <img
                          src="./images/hourglass.png"
                          class="img-fluid"
                          alt=""
                        />
                        <strong class="innerText">
                          Mubashir Qyyum is off sick today
                        </strong>
                      </span>
                      <span class="text-end">
                        <img
                          src="./images/Ellipse 52.png"
                          class="img-fluid"
                          alt=""
                        />
                      </span>
                    </div>
                  </div>
                  <div class="col-12 mb-3">
                    <h3 class="my-3">TODAY</h3>
                    <div class="d-flex justify-content-between align-items-center contentHolder">
                      <span>
                        <img
                          src="./images/hourglass.png"
                          class="img-fluid"
                          alt=""
                        />
                        <strong class="innerText">
                          Mubashir Qyyum is off sick today
                        </strong>
                      </span>
                      <span class="text-end">
                        <img
                          src="./images/Ellipse 52.png"
                          class="img-fluid"
                          alt=""
                        />
                        <img
                          src="./images/Ellipse 52.png"
                          class="img-fluid"
                          alt=""
                        />
                      </span>
                    </div>
                  </div>
                  <div class="col-12 mb-3">
                    <div class="d-flex justify-content-between align-items-center contentHolder">
                      <span>
                        <img
                          src="./images/hourglass.png"
                          class="img-fluid"
                          alt=""
                        />
                        <strong class="innerText">
                          Mubashir Qyyum is off sick today
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-12 col-12 leavesRecord mt-4">
                <div class="row">
                  <div class="col-12 my-3">
                    <h3>YOUR LEAVE</h3>
                  </div>
                  <div class="col-12 mb-2">
                    <div class="d-flex justify-content-between applyforLeave">
                      <div class="text-center leaverecord1">
                        <strong>4</strong>
                        <b>LEAVE TAKEN</b>
                        <button
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop"
                        >
                          Apply Now
                        </button>
                      </div>
                      <div class="text-center">
                        <strong>4</strong>
                        <b>LEAVE TAKEN</b>
                        <button>Apply Now</button>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 my-4">
                    <h3 class="mb-2">UPCOMING HOLIDAY</h3>
                    <p class="applyforLeave">Mon 5 Feb 2021 - Kashmir Day</p>
                  </div>
                  <div class="col-12 my-4">
                    <h3 class="mb-2">
                      <img
                        src="./images/Path 148.png"
                        class="img-fluid"
                        alt=""
                      />
                      ANNOUNCEMENT FROM ADMIN
                    </h3>
                    <p class="applyforLeave">
                      Busy schedule - Starting from 1st March
                    </p>
                  </div>
                  <div class="col-12 my-4">
                    <h3 class="mb-2">
                      <img
                        src="./images/Path 148.png"
                        class="img-fluid"
                        alt=""
                      />
                      ANNOUNCEMENT FROM ADMIN
                    </h3>
                    <p class="applyforLeave">
                      Busy schedule - Starting from 1st March
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default NoticeBoard;
