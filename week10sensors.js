var express = require('express'),
    app = express();
var moment = require('moment');
require("moment-duration-format");
const { Pool } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'grace';
db_credentials.host = 'datastructures.cqg9canqxxtt.us-east-2.rds.amazonaws.com';
// db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'sensors';
db_credentials.password = 'gracie22';
// process.env.AWSRDS_PW;
db_credentials.port = 5432;

app.get('/', function(req, res) {
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query
    var q = `SELECT EXTRACT(DAY FROM sensortime AT TIME ZONE 'America/New_York') as sensorday, 
             EXTRACT(MONTH FROM sensortime AT TIME ZONE 'America/New_York') as sensormonth, 
             count(*) as num_obs, 
             
             sum (CASE WHEN potentsensor = 'motivated' THEN 1 ELSE 0 END) as total_motivated, 
             sum (CASE WHEN fsrsensor >= 15 THEN 1 ELSE 0 END) as running_time 

             
             FROM gracesensors 
             GROUP BY sensormonth, sensorday;`;
             
             
             var q = `SELECT * FROM gracesensors;`
    client.connect();
    client.query(q, (qerr, qres) => {
        res.send(qres.rows);
        console.log('responded to request');
    });
    client.end();
});

app.listen(3000, function() {
    console.log('Server listening...');
});

            //  sum (count(if weightvalue => 15)) as running_time,
            //  sum (moment.duration().asMinutes()) if weightvalue >= 15 as running_time, 
//   SELECT potentsensor FROM gracesensors WHERE potentsensor = 'motivated',
//              SELECT potentsensor FROM gracesensors WHERE potentsensor = 'unmotivated',
//              SELECT fsrsensor FROM gracesensors WHERE fsrsensor >= 15 