var request = require('request');
var fs = require('fs');
var base_url = 'http://visualizedata.github.io/datastructures/data/m';
var j; 
var i =1;
function weblist () {
  if (i<10) {
      j = "0" + i;
  }
  else{
    j = "" +i;
};
  console.log(base_url + j + '.html')
    request(base_url + j + '.html', function (error, response, body) {
    
      if (!error && response.statusCode == 200) {
        
        fs.writeFileSync('./data/m' + j + '.txt', body);
        i++;
        
        if(i<=10){
          weblist();
        }
        if (i>10){
          return;
        }
      }
      else {console.error('request failed')}
    });
}

weblist()