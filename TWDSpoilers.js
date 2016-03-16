//Sam Gehly 2016

/*
By changing the following variable to true, by using this script, or by editing any of the functions below, 
you agree to the terms specified by AMC.com in regards to data access and rate limiting.

I claim no responsibility for any consequences resulting from the use of this script.

Don't overload AMC's servers using this. They are run on AWS, don't be a jerk.

This script is for educational use only.
*/
var termsAcceptance = false;

/*
You must fill these in before use by going to a story sync instance, openning up a javascript console, 
running "sync2.key" and "sync2.secret", and putting the values in below.
*/

var key = "";
var secret = "";


/*
This script requires bluebird and request-promise.
Simply install them using npm.
*/

//DO NOT EDIT BELOW THIS LINE UNLESS YOU KNOW WHAT YOU ARE DOING.

var Promise = require('bluebird');
var rp = require('request-promise');


function sendRequest(endpoint, data, passback){
	data.key = key;
	data.secret = secret;
	var opts = {uri: 'http://amc.com/sync.amctv/api/v2/'+endpoint, qs: data, json:true}
	return new Promise(function(res,rej){
		rp(opts).then(function(r){
			if(passback){
				r.passback = passback;
			}
			return res(r);
		})
		.catch(function(r){
			if(passback){
				r.passback = passback;
			}
			return rej(r);
		})
	})
}

function getImageData(barrel){
	sendRequest('ajax.get.barrel', {barrel_id: barrel.id, hash: barrel.hash})
	.then(function(r){
		barrel.image = r.data.barrel_background_image;
		barrel.caption = r.data.name;
		for (first in barrel.image) break;
		console.log({caption: barrel.caption, image: barrel.image[first]})
	})
}

function getLog(id, validate, vcb){
	sendRequest('ajax.get.schedule_log',{schedule_id: id}, id)
	.then(function(r){
		if(r.data.title){
			if(validate){
				return vcb("-=-=-=-=-"+r.passback+" FOUND-=-=-=-=-");
			}
			if(r.data.barrels.length == 0){
				console.error("No barrels found.");
				return;
			}
			for(i=0;i<r.data.barrels.length;i++){
				if(r.data.barrels[i].hash){
					getImageData(r.data.barrels[i])
				}
			}
		}else{
			if(validate){
				return vcb(r.passback+" not found.")
			}else{
				console.error("No slides found.")
				return;
			}
		}
	})
}

var args = process.argv;

if(!termsAcceptance){
	console.error("You must agree to the terms specified on the top of the script before use.");
	return;
}

if(!key || !secret){
	console.error("You must configure the script with a Story Sync key and secret. Read the script before using.")
}

if(args[2] == 'getImages'){
	getLog(args[3])
}
else if(args[2] == 'findShow'){
	for(i=args[3];i<args[4];i++){
		getLog(i, true, function(r){
			console.log(r);
		});
	}
}
else{
	console.error("Usage: getImages [Schedule ID], findShow [Start ID] [End ID], bruteForce [Year (4-digit)] [Month (2-digit)] [Season #] [Episode #] [Code Length]");
}


