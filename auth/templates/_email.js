api = {},
l=require('../config/lib');

var sg = require('sendgrid')(l.config.sendgrid);


api.sendmail=function(fromId,toId,subject,body,callback){
	var request = sg.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: {
			personalizations: [
			{
				to: [
				{
					email: toId
				}
				],
				subject: subject
			}
			],
			from: {
				email: fromId
			},
			content: [
			{
				type: 'text/html',
				value: body
			}
			]
		}
	});

	sg.API(request)
	.then(function (response) {
		return callback(false,response);
	})
	.catch(function (error) {
	    return callback(error.response,error.response.statusCode);
	});
};


module.exports = api;