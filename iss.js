
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');

const fetchMyIP = function(callback) {
  request(`https://api64.ipify.org/?format=json%27{%22ip%22:%222001:569:7c20:9600:4899:287d:5d64:2cd0%22}`, (error, response, body) =>{
    const ip = body;
    if (ip === undefined || ip === null) {
      error = "Uh oh! No ip address found.";
    }
    // inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ip. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    // if we get here, all's well and we got the data
    callback(error, ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  let data = {};
  request(`https://freegeoip.app/json/${ip}`, (error, response, body)=>{
    if(error){
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    data.latitude = JSON.parse(body)["latitude"];
    data.longitude = JSON.parse(body)["longitude"];
    callback(error, data);
  });
  
};



module.exports = {
  fetchMyIP,
  fetchCoordsByIP
};