'use strict';

var requestImg = require('request').defaults({
    encoding: null
});
var api = {};
var fs = require('fs');

var logFile = '../debug.log';

/*
========== CONFIGURATION ============	
*/

//CONSTANTS
api.STATUS_OK = 'success';
api.STATUS_ERR = 'error';
api.STATUS_FAIL = 'fail';

//Directories
api.DIR_AVATAR = 'avatars/';
api.DIR_AVATAR_FULL = './public/img/' + api.DIR_AVATAR;

// Basic Response Time 
api.response = function (status, data, message) {
    var r = {
        status: status || api.STATUS_ERR,
        data: data || null,
        message: message
    };

    return r;
};

// Sugar Coated HTTP Response
api.res = function (err, data) {
    return err ? api.response(api.STATUS_ERR, err, data) : api.response(api.STATUS_OK, data, null);
};

/*
========== FUNCTIONS ============	
*/

/**
 * [p description] Quick Print
 * @type {String}
 * @type {Object}
 */
api.p = function (str, obj) {
    var d = new Date();
    var s =
        d.getFullYear() +
        '/' +
        (d.getMonth() + 1) +
        '/' +
        d.getDate() +
        ' ' +
        d.getHours() +
        ':' +
        d.getMinutes() +
        ':' +
        d.getSeconds();
    s += ' > ' + str;

    if (obj != undefined) s += JSON.stringify(obj);

    console.log(' ', s);
    fs.appendFile(logFile, '\n' + s, function (err) {
        //console.log('err: ',err);
    });
};

/**
 * COnverts an image url to Base64
 * @param {String} url - The Url of the image
 * @param {Function} cb - Teh Call back Function, in the standard format (err,data)
 */
api.Img2B64 = function (url, cb) {
    requestImg.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
            data = new Buffer(body).toString('base64');
            return cb(false, data);
        } else {
            return cb(true, error);
        }
    });
};

api.chunk = function (array, chunkSize) {
    var i,
        j,
        temparray = [];
    chunkSize = chunkSize != undefined ? chunkSize : 5;
    for (i = 0, j = array.length; i < j; i += chunkSize) {
        temparray.push(array.slice(i, i + chunkSize));
    }
    return temparray;
};

//Checks if a string is JSON or not. Returns json object or false
api.Json = function (str) {
    var json = null;
    try {
        json = JSON.parse(str);
    } catch (e) {
        return false;
    }
    return json;
};

//Soft copy properties and retuns new object
api.ObjCopy = function (obj1, obj2) {
    for (var attrname in obj2) {
        obj1[attrname] = obj2[attrname];
    }

    return obj1;
};

module.exports = api;
