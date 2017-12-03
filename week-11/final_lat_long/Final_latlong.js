var fs = require("fs");  // create variable for the fs module
var request = require('request'); // npm install request
var async = require('async'); // npm install async

// SETTING ENVIRONMENT VARIABLES (in Linux): 
// export NEW_VAR="Content of NEW_VAR variable"
// printenv | grecdp NEW_VAR
var apiKey = process.env.googlekey;
// process.env.GMAKEY;
// console.log(apiKey)

var meetingsData = [];
var address =JSON.parse(
        fs.readFileSync('../aameetingsclean10.json') // this is from the cleaned json files  
    )

// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(address, function(value, callback) {
    var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value.address.split(' ').join('+') + '&key=' + apiKey;
   var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value.address.split(' ').join('+') + '&key=' + apiKey;
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        if(JSON.parse(body).status !== "ZERO_RESULTS"){
            value.latLong = JSON.parse(body).results[0].geometry.location;   
        }
    });
    setTimeout(callback, 2000);
}, function() {
    fs.writeFileSync('parsedlatlong10.json',JSON.stringify(address),'utf8');
    
});