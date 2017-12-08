// npm install cheerio
var fs = require('fs');
var cheerio = require('cheerio');

// load the thesis text file into a variable, `content`

// load `content` into a cheerio object
var output = [];
var filenumbers = ['m01','m02','m03','m04','m05','m06','m07','m08','m09','m10'];
for (var i = 0; i < filenumbers.length; i++) {
    var filename = '../week-01/data/' + filenumbers[i] + '.txt';

var content = fs.readFileSync(filename);
var $ = cheerio.load(content);

// var temp;
var item = {};
// select the table row of each address
$('tbody tr[style = "margin-bottom:10px"]').each(function(i, elem) {
    var item = {};
    item.meetingname = $(elem).html().replace(/<b>/g, "").split('<br>')[1].trim().split("&apos;").join("'").split(/-/)[0].split(/\(/)[0].split("  ")[0];
    item.addressall = $(elem).html().split('<br>')[2].trim().split("&apos;").join("'");
    item.address = item.addressall.substring(0, item.addressall.indexOf(',')).split(/-/)[0] +','+ ' '+ "New York, NY";
    delete item.addressall; 
    item.wheelchair = $(elem).find('span').text().trim(); //printing wheelchair access
    item.details = $(elem).find('.detailsBox').text().trim(); //printing the details box
    // console.log(item.meetingname);

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
                    temp.weekDay = (function() { if(timeArr[j].match(/Mondays|Tuesdays|Wednesdays|Thursdays|Fridays|Saturdays|Sundays/gi) !== null){
                        return timeArr[j].match(/Mondays|Tuesdays|Wednesdays|Thursdays|Fridays|Saturdays|Sundays/gi)[0];
                    } else { return null } })()
                    // console.log(temp.weekDay)
                     // to get meeting time
        
                    temp.time = timeArr[j].match(/\d{1,2}[:]\d{2} [A|P]M/gi);
                    temp.time_start = temp.time[0]; 
                    temp.time_end = temp.time[1];
                    temp.time_starthour = temp.time[0].split(":",1)[0].trim() * 1; 
                    if (temp.time_start.match(/[p]/i) && temp.time_starthour < 12) {
                        temp.time_starthour = +temp.time_starthour + 12  
                                                }
                    // else {temp.time_starthour.match(/[a]/i)};
                                        // console.log(temp.time_start)

                    // console.log(temp.time_starthour)
                    
                    delete temp.time;
                     // to get meeting type
                    temp.type1 = timeArr[j + 1].slice(19, timeArr[j].length).trim().replace("</b>",""); 
                    temp.meetingtype = temp.type1.substring(temp.type1.indexOf('=')).replace("= ","");
                    delete temp.type1;
                //   console.log(temp)
                    // to get special interest
                    temp.special = (timeArr[j + 2].match(/special/gi) !== null)
                    temp.special = timeArr[j + 2].slice(23, timeArr[j].length).trim(); 
                                        item.meetingtimes.push(temp);
                  }
              }
          }
    output.push(item);
}

);
}
// console.log(JSON.stringify(output));  
fs.writeFileSync('aameetingsanslatlong.json',JSON.stringify(output),'utf8');