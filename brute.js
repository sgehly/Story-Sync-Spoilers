var http = require('https');

function request(i, cb){
  http.get('https://images.amcnetworks.com/amc.com/wp-content/uploads/2016/03/the-walking-dead-episode-616-glenn-yeun-'+i+'.jpg', (res) => {
    if(res.statusCode !== 403){
      console.log(res);
      cb()
    }else{
      console.log("[Code "+i+" does not exist]");
      cb()
    }

  })
}

function loopThru(index){
  request(index, function(){
    loopThru(index+1);
  })
}
loopThru(0)