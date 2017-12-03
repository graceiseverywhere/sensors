var request = require('request');
const { Client } = require('pg');

// PARTICLE PHOTON
var device_id = process.env.PHOTON_ID;
var access_token = process.env.PHOTON_TOKEN;
var particle_variable = 'json';

// var device_url = 'https://api.particle.io/v1/devices/' + device_id + '/' + particle_variable + '?access_token=' + access_token;

var device_url = 'https://api.particle.io/v1/devices/' + device_id + '/' + particle_variable + '?access_token=' + access_token;
// 'https://api.particle.io/v1/devices/1b003d000c47353136383631/json?access_token=a03b76e3abd06bd4d0f65b1d1ec05e7989293309';
console.log (device_url);

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'grace';
db_credentials.host = 'datastructures.cqg9canqxxtt.us-east-2.rds.amazonaws.com';
// process.env.AWSRDS_EP;
// db_credentials.host = 'mypostgresql.c6c8mwvfdgv0.us-west-2.rds.amazonaws.com';

db_credentials.database = 'sensors';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

var getAndWriteData = function() {
    // Make request to the Particle API to get sensor values
    request(device_url, function(error, response, body) {
        console.log(body)
        // Store sensor values in variables
        var device_json_string = JSON.parse(body).result;
        // var weightvalue = JSON.parse(device_json_string).analogval_fsr;
        var weightvalue = JSON.parse(device_json_string).fsr;
        // var emotionvalue = JSON.parse(device_json_string).analogval_potentiometer;
        var emotionvalue = JSON.parse(device_json_string).potentiometer;

        // Connect to the AWS RDS Postgres database
        const client = new Client(db_credentials);
        client.connect();

        // Construct a SQL statement to insert sensor values into a table
        // Try this single instead
        // var thisQuery = "INSERT INTO gracesensors VALUES (" + weightvalue + "," + "'"emotionvalue) + ", DEFAULT);";
        
        var thisQuery = "INSERT INTO gracesensors VALUES (" + weightvalue + ",'" + emotionvalueToBoolean(emotionvalue) + "', DEFAULT);";
//  Hi! var thisQuery = "INSERT INTO gracesensors VALUES (" + weightvalue + ",'" + emotionvalueToBoolean(emotionvalue) + "'', DEFAULT);";
        function emotionvalueToBoolean(emotionvalue) {
            if (emotionvalue >= 700) {
                return "Motivated";
            } else { return "Unmotivated"}
};
        console.log(thisQuery); // for debugging

        // Connect to the AWS RDS Postgres database and insert a new row of sensor values
        client.query(thisQuery, (err, res) => {
            console.log(err, res);
            client.end();
        });
    });
};

// write a new row of sensor data every minute
setInterval(getAndWriteData, 60000);