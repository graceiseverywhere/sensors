# week-08
week 8 assignment
# data-structures
This includes: 
   1.  an articulation of my data model
   2.  the SQL code I used to create your table(s) and insert a row of values into the table(s)
   
   
   
   

An articulation of my data model
FSR Sensor The sensor will be used to document how long I run for. I will place an object onto the sensor at the beginning my run and take off at the end of my run to document how long I ran for. The FSR gives values as numbers as decimals, but instead, I'd like to translate that data into period of time (using the amount of the time the object is on the censor). 

Potentiometer Sensor: This sensor will be used to monitor my motivation. Before each run I will turn the knob a lot or slightly to generate two values (motivated and unmotivated). The potentiometer gives values as numbers, but I will configure it so it translates into strings. 

Data Model: 
One table will contain the following values: FSRSENSOR (int), POTENTSENSOR (varchar(20)), sensortime (date/time)

Data Frequency: 
Calls will be made to photo device every minute and data will be written to an AWS-hosted SQL database. 

Data Aggregation: 
A visualization of small multiples will be made daily to show the relationship between motivation and running time. 


![alt text](https://github.com/graceiseverywhere/data-structures/blob/master/MSDV_DataStructures_grace_sensors_mockdesign.png
 "Initial Mockup design")





The SQL code you used to create your table(s) and insert a row of values into the table(s)

\\\create connection to AWS hosted db in cloud9 terminal

psql --host=datastructures.cqg9canqxxtt.us-east-2.rds.amazonaws.com --port=5432 --username=grace --password --dbname=sensors

\\\create table in cloud9 terminal 

CREATE TABLE gracesensors 
(
FSRSENSOR int, 
POTENTSENSOR varchar(20), 
sensortime timestamp DEFAULT current_timestamp);

CREATE TABLE gracesensors (FSRSENSOR int, POTENTSENSOR varchar(20), sensortime timestamp DEFAULT current_timestamp);

\\\insert statements into gracesensors 
sensors=> INSERT INTO gracesensors VALUES (1, 'motivated', DEFAULT);
sensors=> INSERT INTO gracesensors VALUES (5, 'unmotivated', DEFAULT);
sensors=> INSERT INTO gracesensors VALUES (8, 'motivated', DEFAULT);
sensors=> INSERT INTO gracesensors VALUES (9, 'motivated', DEFAULT);
![alt text](https://github.com/graceiseverywhere/data-structures/blob/master/Grace_Sensors_Insert.png
 "Insert Statements")


\\\verifying table is there 
sensors=> \d
           List of relations
 Schema |     Name     | Type  | Owner 
--------+--------------+-------+-------
 public | gracesensors | table | grace
(1 row)

![alt text](https://github.com/graceiseverywhere/data-structures/blob/master/Grace_Sensors_Verify.png "Verify ScreenGrab")


\\\select statement
sensors=> SELECT * from gracesensors;
 fsrsensor | potentsensor |         sensortime         
-----------+--------------+----------------------------
         1 | motivated    | 2017-10-23 17:23:51.702079
         5 | unmotivated  | 2017-10-23 17:24:53.893031
         8 | motivated    | 2017-10-23 17:25:01.295956
         9 | motivated    | 2017-10-23 17:25:07.760505
(4 rows)
![alt text](https://github.com/graceiseverywhere/data-structures/blob/master/Grace_Sensors_Select.png
 "Select Statement Used")


