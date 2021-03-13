
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
    if (error) {
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

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  // ...
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords["latitude"]}&lon=${coords["longitude"]}`,(error, response, body)=>{
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching rise times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body).response;
    callback(error, data);
  });
};


const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip)=>{
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, loc)=>{
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(loc, (error, nextPasses)=>{
        if (error) {
          callback(error, null);
          return;
        }
        callback(null, nextPasses);
      });
    });
  });
};


module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};