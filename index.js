const { fetchMyIP } = require('./iss');
const { fetchCoordsByIP } = require('./iss');
const { fetchISSFlyOverTimes } = require('./iss');

/*fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned IP:' , ip);
  IP += ip
});*/


/*fetchCoordsByIP('173.183.99.167', (error, data)=>{
  if (error) {
    console.log(`it didn't work! ${error}`);
  } else {
    console.log(data);
  }
  
 
//console.log(error)
//console.log(data)
});
*/
 
fetchISSFlyOverTimes({ latitude: 49.2643, longitude: -123.0961 }, (error, data)=>{
  if (error) {
    console.log(`it didn't work! ${error}`);
  } else {
    console.log(data.response);
  }
});

