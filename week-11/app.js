var express = require('express'),
    app = express();
var fs = require('fs');
var moment = require('moment-timezone');

// Postgres
const { Pool } = require('pg');
var db_credentials = new Object();
db_credentials.user = 'grace';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'sensors';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Mongo
var collName = 'meetings';
var MongoClient = require('mongodb').MongoClient;
var url = process.env.ATLAS;

// HTML wrappers for AA data
var index1 = fs.readFileSync("../week-11/index1.txt");
var index3 = fs.readFileSync("../week-11/index3.txt");

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
             
    client.connect();
    client.query(q, (qerr, qres) => {
        res.send(qres.rows);
        console.log('responded to request');
    });
    client.end();
});

app.get('/aa', function(req, res) {

    MongoClient.connect(url, function(err, db) {
        if (err) {return console.dir(err);}
        
        var dateTimeNow = new Date();
        var newYork    = moment.tz("2014-06-01 12:00", "America/New_York");
        var today = dateTimeNow.getDay();
        var tomorrow;
        if (today == 0) {tomorrow = 1;}
        else {tomorrow = today + 1}
        
        var hour = dateTimeNow.getHours();
        var lasthour = 4; 
        var collection = db.collection(collName);
    
        collection.aggregate([ // start of aggregation pipeline
            // match by day and time so it matches to othe current time and 4 am the next day 
            { $match : 
                { $or : [
                    { $and: [
                        { dayQuery : today } , { hourQuery : { $gte: hour } }
                    ]},
                    { $and: [
                        { dayQuery : tomorrow } , { hourQuery : { $lte: lasthour } }
                    ]}
                ]}
            },
            
            // group by meeting group
            { $group : { _id : {
                latLong : "$latLong",
                meetingName : "$meetingName",
                address : "$adddress",
                // meetingAddress2 : "$meetingAddress2",
                // borough : "$borough",
                details : "$details",
                wheelchair : "$wheelchair",
                },
                    meetingDay : { $push : "$weekday" },
                    meetingStartTime : { $push : "$time_start" }, 
                    meetingEndTime : { $push : "$time_end" }, 
                    meetingType : { $push : "$type" }
            }
            },
            
            // group meeting groups by latLong
            {
                $group : { _id : { 
                    latLong : "$_id.latLong"},
                    meetingGroups : { $push : {groupInfo : "$_id", meetingDay : "$meetingDay", meetingStartTime : "$meetingStartTime", meetingType : "$meetingType" }}
                }
            }
        
            ]).toArray(function(err, docs) { // end of aggregation pipeline
            if (err) {console.log(err)}
            
            else {
                res.writeHead(200, {'content-type': 'text/html'});
                res.write(index1);
                res.write(JSON.stringify(docs));
                res.end(index3);
            }
            db.close();
        });
    });
    
});

// app.listen(process.env.PORT, function() {
app.listen(3000, function() {
    console.log('Server listening...');
});