'use strict';

var requestImg = require('request').defaults({ encoding: null });
var api={};
var fs=require('fs');

var logFile='../debug.log';



/*
========== CONFIGURATION ============	
*/

//Uncomment as per usage
api.config=JSON.parse(fs.readFileSync('server_config.json', 'utf8'));

/*
//FIND THE CONFIG JSON in ./server_config.json
api.config={
	version:'0.0.1',
  server_ip:'0.0.0.0',
	homepage:'http://something.com',
  server_port:3001, 
  external_ip:'35.185.191.253',
  redisPort:6379, //if using auth
  jwtSecret:'this.is.5|_|p3R.#$@~S3(R3T~@$#.D0.(H^NG3.TH15', //if using auth
  sendgrid:'SG.LeKiJCIWTadfdflKw.v-J9euF-Q7gadfadfWXrFDojvhtR_EbgAadfcBEM',
  admin:{
    resetPasswordHost:null, //e.g. 'http://domain.com'. Default takes server's host
    resetPasswordRoute:null, //e.g. '/api/auth/password/reset/'. Default takes this e.g. only. Note, / is important on both start and end of this route
    resetPasswordEmail:'admin@domain.com',
    errorEmail:'admin@domain.com'
  }
  
};
*/


//Checking for development mode
if (fs.existsSync('.localrc')) {
  console.log('Mode > .localrc file found. Changing to Development Mode');
  api.config.server_ip='0.0.0.0';
}else{
  console.log('Mode > .localrc NOT found. Changing to Production Mode');
}



//CONSTANTS

api.REQUIRE_ADMIN='Admin';
api.REQUIRE_MANAGER='Manager';
api.REQUIRE_Member='Member';

api.STATUS_OK='success';
api.STATUS_ERR='error';
api.STATUS_FAIL='fail';


//Directories
api.DIR_AVATAR='avatars/';
api.DIR_AVATAR_FULL='./public/img/'+api.DIR_AVATAR;

 /*
  {
    status: <status> , 
    data: {Actual Data Object} , 
    message: 'optional message' 
  }
  */
 
api.response=function (status,data,message) {
   var r={
      status:status || api.STATUS_ERR,
      data:data || null,
      message:message 
    };

    return r;
};



/*
========== FUNCTIONS ============	
*/

/**
 * [p description] Quick Print
 * @type {String} 
 * @type {Object} 
 */
 api.p=function(str,obj){

  var d=new Date();
  var s=d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
  s+=' > '+str;

  if(obj!=undefined)
    s+=JSON.stringify(obj);

  console.log(' ',s);
  fs.appendFile(logFile, "\n"+s, function (err) {
    //console.log('err: ',err);
  });
 };

/**
 * COnverts an image url to Base64
 * @param {String} url - The Url of the image
 * @param {Function} cb - Teh Call back Function, in the standard format (err,data)
 */
 api.Img2B64=function (url,cb){
 	requestImg.get(url, function (error, response, body) {
 		if (!error && response.statusCode == 200) {
 			//data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
 			data = new Buffer(body).toString('base64');
 			return cb(false,data);
 		}else{
 			return cb(true,error);
 		}
 	});
 };


 api.chunk=function(array,chunkSize){
 	var i,j,temparray=[];
 	chunkSize=(chunkSize!=undefined)?chunkSize:5;
 	for (i=0,j=array.length; i<j; i+=chunkSize) {
 		temparray.push(array.slice(i,i+chunkSize));
 	}
 	return temparray;
 };


//Checks if a string is JSON or not. Returns json object or false
api.Json=function(str) {
  var json=null;
  try {
    json=JSON.parse(str);
  } catch (e) {
    return false;
  }
  return json;
}

//Soft copy properties and retuns new object
api.ObjCopy=function(obj1,obj2){
  for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }

    return obj1;  
};


 module.exports=api;