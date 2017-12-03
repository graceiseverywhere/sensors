// npm install cheerio
var fs = require('fs');
var cheerio = require('cheerio');

// load the thesis text file into a variable, `content`
var content = fs.readFileSync('../week-01/data/m10.txt');


// load `content` into a cheerio object
var $ = cheerio.load(content);
var output = [];
// var temp;
var item = {};
// select the table row of each address
$('tbody tr[style = "margin-bottom:10px"]').each(function(i, elem) {
    var item = {};
    item.addressall = $(elem).html().split('<br>')[2].trim().split("&apos;").join("'");
    item.address = item.addressall.substring(0, item.addressall.indexOf(',')).split(/-/)[0] +','+ ' '+ "New York, NY";
    delete item.addressall; 
    item.wheelchair = $(elem).find('span').text().trim(); //printing wheelchair access
    item.details = $(elem).find('.detailsBox').text().trim(); //printing the details box
    // console.log(item.addressclean);

     //print meeting times as an array of objects
     item.meetingtimes = [];
     if($(elem).find(".td"['style'] == 'border-bottom:1px solid #e3e3e3; width:350px;'))
     {
            var timeArr = $(elem).html().trim().split('<br>'); 
            // an array for days, times, type, and special interest
            // if(timeArr[elem]){ 
                for (var j = 0; j < timeArr.length; j++) {    
                  if(timeArr[j].match(/ From/g) !== null) {
                    var temp = {}; //create an object variable for the items 
                    temp.weekDay = timeArr[j].match(/Mondays|Tuesdays|Wednesdays|Thursdays|Fridays|Saturdays|Sundays/gi);
                     // to get meeting time
                    temp.time = timeArr[j].match(/\d{1,2}[:]\d{2} [A|P]M/gi);
                    temp.time_start = temp.time[0]; 
                    temp.time_end = temp.time[1];
                    delete temp.time;
                     // to get meeting type
                    temp.type = timeArr[j + 1].slice(19, timeArr[j].length).trim().replace("</b>",""); 
                //   console.log(temp)
                    // to get special interest
                    temp.special = (timeArr[j + 2].match(/special/gi) !== null)
                    temp.special = timeArr[j + 2].slice(23, timeArr[j].length).trim(); 
                                        item.meetingtimes.push(temp);
                  }
              }
          }
    output.push(item);
});

// console.log(JSON.stringify(output))  
fs.writeFileSync('aameetingsclean10.json',JSON.stringify(output),'utf8');