// npm install mongodb

var request = require('request');
var fs = require ("fs")
// IN MONGO exists a database `NYAAMeetings` with a collection `meetingdirectory`
var dbName = 'grace'; // name of Mongo database (created in the Mongo shell)
var collName = 'meetingdirectoryparsed'; // name of Mongo collection (created in the Mongo shell)

// Insert the list of meetings directory (contained in an array) in the Mongo collection
var addresses =JSON.parse(
       fs.readFileSync('../week-05/parsed-latlong.json') // this is the json file
   )

// Connection URL
var url = 'mongodb://cluster0-shard-00-00-rzdcl.mongodb.net:27017,cluster0-shard-00-01-rzdcl.mongodb.net:27017,cluster0-shard-00-02-rzdcl.mongodb.net:27017/grace?replicaSet=Cluster0-shard-0' + process.env.IP + ':27017/' + dbName;
var myQuery = [
    // {$match : {statusValue : "In Service"}}
    // {$match : {availableDocks : { $lt : 1 }}},
    // {$group : { _id : "$statusValue", avgBikes : {$avg : "$availableBikes"}} }
    // {$group: {_id: "$statusValue", statName : { $push : "$stationName"}}}
    {$match : {meetingtimes : {weekDay : "Tuesdays"}, time :  "8" }}, // to find meetings on Tuesdays after 7PM 
 ];
    
// Retrieve
var MongoClient = require('mongodb').MongoClient;


MongoClient.connect(url, function(err, db) {
    if (err) {return console.dir(err);}

    var collection = db.collection(collName);

    // write output 
    collection.aggregate( myQuery ).toArray(function(err, docs) {
        if (err) {console.log(err)}
        
        else {
            console.log("Writing", docs.length, "documents as a result of this aggregation.");
            fs.writeFileSync('mongo_aggregation_result_week05.JSON', JSON.stringify(docs, null, 4));
        }
        db.close();
        
    });

}); //MongoClient.connect