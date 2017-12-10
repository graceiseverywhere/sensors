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
             
             sum (CASE WHEN potentsensor = 'Motivated' THEN 1 ELSE 0 END) as total_motivated, 
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

    console.log(url);
    console.log("========");
    MongoClient.connect(url, function(err, db) {
        if (err) {return console.dir(err);}
        
        // var dateTimeNow = new Date();
        // var dateTimeNow = moment(new Date ());

        // dateTimeNow.tz("2014-06-01 12:00", "America/New_York");
        var today = moment.tz(new Date(), "America/New_York").days();
        // console.log(today);
        console.log(db);
        var currentDay;
        var tomorrow;
        if (today == 0) {currentDay = 'Sundays'; tomorrow = 'Mondays'}
        else if (today == 1) {currentDay = 'Mondays'; tomorrow = 'Tuesdays'}
        else if (today == 2) {currentDay = 'Tuesdays'; tomorrow = 'Wednesdays'}
        else if (today == 3) {currentDay = 'Wednesdays'; tomorrow = 'Thursdays'}
        else if (today == 4) {currentDay = 'Thursdays'; tomorrow = 'Fridays'}
        else if (today == 5) {currentDay = 'Fridays'; tomorrow = 'Saturdays'}
        else if (today == 6) {currentDay = 'Saturdays'; tomorrow = 'Sundays'};
        
        var currentHour = moment.tz(new Date(), "America/New_York").hours();
        var lastHour = 4;

        
        var collection = db.collection(collName);
        
        collection.aggregate([ // start of aggregation pipeline
            // match by day and time so it matches to the current time and 4 am the next day 
            
            { $unwind : "$meetingtimes"}, 
            
            { $match : 
                { $or : [
                    { $and: [
                        { "meetingtimes.weekDay" : currentDay } , { "meetingtimes.time_starthour" : { $gte: currentHour } }
                    ]},
                    { $and: [
                        { "meetingtimes.weekDay" : tomorrow } , { "meetingtimes.time_starthour" : { $lte: lastHour } }
                    ]}
                ]}
            },
            
            // group by meeting group
            { $group : { _id : {
                latLong : "$latLong",
                meetingname : "$meetingname",
                address : "$address",
                // meetingAddress2 : "$meetingAddress2",
                // borough : "$borough",
                details : "$details",
                wheelchair : "$wheelchair",
                },
                    meetingDay : { $push : "$meetingtimes.weekDay" },
                    meetingStartTime : { $push : "$meetingtimes.time_start" }, 
                    meetingEndTime : { $push : "$meetingtimes.time_end" }, 
                    meetingType : { $push : "$meetingtimes.meetingtype" }
                    
            }
            },
            
            // group meeting groups by latLong
            {
                $group : { _id : { 
                    latLong : "$_id.latLong"},
                    meetingtimes : { $push : {groupInfo : "$_id", meetingDay : "$meetingDay", meetingStartTime : "$meetingStartTime", meetingEndTime : "$meetingEndTime", meetingType : "$meetingType", details : "$details",}}
                }
            }
        
            ]).toArray(function(err, docs) { // end of aggregation pipeline
            if (err) {console.log(err)}
            
            else {
                // console.log("aa")
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

app.listen(8080, function() {
    console.log('Server listening...');
    
});