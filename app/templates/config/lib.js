var requestImg = require('request').defaults({ encoding: null });
var api={};
var fs=require('fs');

var logFile='../debug.log';



/*
========== CONFIGURATION ============	
*/

//Uncomment as per usage
api.config={
	version:'0.0.1',
	homepage:'http://something.com'
};


/*
========= [ CORE SPECS ] =========
*/
//status:success,error,fail
/*
  Always use this response object only, not custom json response objects.

Example : 

>>  var r = new response('success',{name:'fultooshi'});
>>  res.status(200).json(r.out());

This conforms to the jSend spec for returning json responses.
Optionally, you can use the head ans meta fileds to store hhtp statuses and etc.
 */
api.ResponseClass=function (status,data,message,head,meta){
  this.body={status:'error',data:null,message:null};
  this.head={};
  this.meta={};

  this.body.status=status;
  this.body.data=data;
  this.body.message=message;
};

api.ResponseClass.prototype.out=function(){
  return this.body;
};

api.ResponseClass.prototype.full=function(){
  return {body:this.body,head:this.head,meta:this.meta};
};

api.ResponseClass.prototype.clean=function(){
  this.body=this.head=this.meta={};
};



/** Callback Helper
 * @param  {Function} - Callback Function
 * @param  {Object} - The Error Object
 * @param  {Object} - Data Object
 * @return {Function} - Callback
 */
 
api.responseCallback=function(cb,err,data){
  if(cb && cb!==undefined && typeof(cb)=='function'){
    var r={};
    if(err)
      r=new api.ResponseClass('error',data,err);
    else
      r=new api.ResponseClass('success',data,null);

    return cb(r.out());
  }else{
    console.log('ERROR: Invalid callback/response object');
    return null;
  }
};


/*
Quick Response Object
 * @param  {Object} - Express Response Object as parameter
 * @param  {Object} - ResponseClass object.out() data
 */
api.response=function(expressResParam,responseData){
  if(expressResParam!=null && responseData!=null){
    var status=200;
    if(responseData.status!='success')
      status=500;
    return expressResParam.status(status).json(responseData);
  }else{
    return expressResParam.status(500).json(new api.ResponseClass('error','Invalid Express Res Param and/or response data object','Error in response parameters').out());
  }
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
 }

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
function IsJsonString(str) {
  var json=null;
  try {
    json=JSON.parse(str);
  } catch (e) {
    return false;
  }
  return json;
}

//Soft copy properties and retuns new object
function ObjCopy(obj1,obj2){
  for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }

    return obj1;  
};


 module.exports=api;