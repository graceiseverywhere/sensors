// npm install mongodb
var fs = require("fs");  // create variable for the fs module
var request = require('request'); // npm install request

var dbName = 'grace'
var collName = 'meetingdirectory'; // name of Mongo collection (created in the Mongo shell)

var addresses =JSON.parse(
       fs.readFileSync('../week-11/final_lat_long/parsedlatlong01.json') // this is the json file
   )

   // Connection URL
   var url = 'mongodb://cluster0-shard-00-00-rzdcl.mongodb.net:27017,cluster0-shard-00-01-rzdcl.mongodb.net:27017,cluster0-shard-00-02-rzdcl.mongodb.net:27017/grace?replicaSet=Cluster0-shard-0';

   // Retrieve
   var MongoClient = require('mongodb').MongoClient;

   MongoClient.connect(url, function(err, db) {
       if (err) {return console.dir(err);}

       var collection = db.collection(collName);

       // THIS IS WHERE THE DOCUMENT(S) IS/ARE INSERTED TO MONGO:
       collection.insert(addresses);
       db.close();

   }); //MongoClient.connect

// }); //request 