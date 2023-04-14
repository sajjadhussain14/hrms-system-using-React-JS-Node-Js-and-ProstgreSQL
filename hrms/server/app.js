const express = require("express");

const app = express();
var cors = require("cors");

const port = 7000;


var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50000mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50000mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(
  express.urlencoded({
    limit: "50000mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(express.json());

app.use(express.text());

var whitelist = [
  "http://localhost:5500",
  "http://localhost:3001",
  "http://localhost",
  "http://localhost:3000",
  "http://localhost/test",
  "https://asterisksolutions.com",
  "http://asterisksolutions.com",
  "http://asterisksolutions.com/api/",
  "http://asterisksolutions.com/api",  
]; //white list consumers

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
};

//adding cors middleware to the express with above configurations
app.use(cors(corsOptions)); 


app.get("/", (request, response) => {
  console.log("i am here api")  
  response.json("Server is running on port 7000");  
});

// EMPLOYEE ROUTES
const employeeRoute = require("./routers/employee");
app.use("/api/employee", employeeRoute);

// DEPT ROUTES
const deptRoute = require("./routers/department");
app.use("/api/department", deptRoute);

// DESIG ROUTES
const desigRoute = require("./routers/designation");
app.use("/api/designation", desigRoute);

// ROLE ROUTES
const roleRoute = require("./routers/role");
app.use("/api/role", roleRoute);

// Holiday ROUTES
const holidayRoute = require("./routers/holiday");
app.use("/api/holidays", holidayRoute);

// Holiday ROUTES
const payrollRoute = require("./routers/payroll");
app.use("/api/payroll", payrollRoute);

// BANK ROUTES
const bankRoute = require("./routers/bank");
app.use("/api/bank", bankRoute);

// INVENTORY ROUTES
const inventRoute = require("./routers/inventory");
app.use("/api/inventory", inventRoute);

// REQUEST ROUTES
const reqRoute = require("./routers/leave-request");
app.use("/api/leave-request", reqRoute);

// LEAVE ROUTES
const leaveRoute = require("./routers/leave");
app.use("/api/leave", leaveRoute);

// Announcement ROUTES
const announceRoute = require("./routers/announce");
app.use("/api/announcement", announceRoute);

// Attendance ROUTES
const attendanceRoute = require("./routers/attendance");
app.use("/api/attendance", attendanceRoute);


// Attendance ROUTES
const usersRoute = require("./routers/users");
app.use("/api/users", usersRoute);

// Mailer ROUTES
const mailerRoute = require("./routers/mailer");
app.use("/api/mailer", mailerRoute);

// Forget-Password ROUTES
const forgetPassword = require("./routers/forget-password");
app.use("/api/fpass", forgetPassword);

// Setting ROUTES
const setting = require("./routers/settings");
app.use("/api/setting", setting);

app.listen(port, (req, res) => {
  console.log(`App running on port ${port}.`);
  
  let yourString = "Desh Seprated Slug";
  yourString = yourString.toLowerCase().replace(/ /g, "_");
  console.log(`App running on port ${yourString}.`);
});
