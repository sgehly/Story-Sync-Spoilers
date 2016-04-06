var crypto = require('crypto');


function getCombinations(chars) {
  var result = [];
  var f = function(prefix, chars) {
    for (var i = 0; i < chars.length; i++) {
    	result.push(crypto.createHash('md5').update(prefix + chars[i]).digest("hex"))
    	result.push(crypto.createHash('md5').update(chars[i] + prefix).digest("hex"))
      	f(prefix + chars[i], chars.slice(i + 1));
      	f(chars[i] + prefix, chars.slice(i + 1));
    }
  }
  f('', chars);
  return result;
}



var args = process.argv;

args.shift()
args.shift()
var ref = args[args.length-1];
args.pop();
var combos = getCombinations(args);
if(combos.indexOf(ref) == -1){
	console.log("No dice.");
}else{
	console.log("SUCCESS");
}