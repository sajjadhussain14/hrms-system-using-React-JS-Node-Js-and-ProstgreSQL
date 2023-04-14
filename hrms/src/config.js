const base_url = window.location.origin;

let apiURL = "http://localhost:7000/api";

if (base_url == "http://localhost:3000") {
  apiURL = "http://localhost:7000/api/";
} else if (base_url.includes("http://localhost/hrms")){
  apiURL = "http://localhost:7000/api/";
} else {
  apiURL = "http://52.45.50.201/server/api/";
}

export default apiURL;