'use strict';

/*
Directly Fetched from https://github.com/vikz91/ezmailer
*/

var path = require('path');
var templatesDir = path.join(__dirname, '..', 'emailTemplates');

var Promise = require('promise');

var nodemailer = require('nodemailer');
const Email = require('email-templates');

var sg, mailgun;

let api = {};
api.transporter = {};
api.templateDir = './';
api.templateExtension = 'hbs';
api.defaultSystem = 'mailer';

api.use = (configData, dSystem, dTemplatePath) => {
    //Sanity Check for Data
    if (!configData || !configData.mailer) {
        throw new Error('Config Value not set! ');
    }

    api.defaultSystem = dSystem || 'mailer';
    api.templateDir = dTemplatePath || configData.templatePath || './';

    api.transporter = nodemailer.createTransport({
        service: configData.mailer.service,
        auth: {
            user: configData.mailer.user,
            pass: configData.mailer.pass
        }
    });

    sg = require('sendgrid')(configData.sendgrid);

    mailgun = require('mailgun-js')({
        apiKey: configData.mailgun.apiKey,
        domain: configData.mailgun.domain
    });
};

api.sendMail = options => {
    return new Promise((resolve, reject) => {
        if (api.defaultSystem === 'mailer') {
            api.sendMailUsing
                .nodemailer(options)
                .then(resolve, reject)
                .catch(reject);
        } else if (api.defaultSystem === 'sendgrid') {
            api.sendMailUsing
                .sendgrid(options)
                .then(resolve, reject)
                .catch(reject);
        } else if (api.defaultSystem === 'mailgun') {
            api.sendMailUsing
                .mailgun(options)
                .then(resolve, reject)
                .catch(reject);
        } else {
            reject('No Default Mail System Selected');
        }
    });
};

api.sendMailTemplate = (templatePath, options) => {
    //templatePath=path.join(templatePath,'/');
    return new Promise((resolve, reject) => {
        const email = new Email({
            transport: api.transport,
            views: {
                root: path.resolve(api.templateDir),
                options: {
                    extension: api.templateExtension
                }
            }
        });

        email
            .render(templatePath, options.data)
            .then(html => {
                var mailOptions = {
                    from: options.from,
                    to: options.to,
                    subject: options.subject,
                    //text: results.text,
                    body: html
                };

                // send mail with defined transport object
                api
                    .sendMail(mailOptions)
                    .then(resolve, reject)
                    .catch(reject);
            })
            .catch(err => {
                reject(err);
            });
    });
};

api.sendMailUsing = {
    nodemailer: options => {
        return new Promise((resolve, reject) => {
            let mailOptions = {
                from: options.from,
                to: options.to,
                subject: options.subject
            };

            if (options.body.text) {
                mailOptions.html = options.body.html;
                mailOptions.text = options.body.text;
            } else {
                mailOptions.html = options.body;
            }

            // send mail with defined transport object
            return api.transporter.sendMail(mailOptions, function(err, info) {
                if (err) {
                    reject(err);
                } else {
                    resolve(info.response);
                }
            });
        });
    },

    sendgrid: options => {
        var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: {
                personalizations: [
                    {
                        to: [
                            {
                                email: options.to
                            }
                        ],
                        subject: options.subject
                    }
                ],
                from: {
                    email: options.from
                },
                content: [
                    {
                        type: 'text/html',
                        value: options.body
                    }
                ]
            }
        });

        return new Promise((resolve, reject) => {
            sg
                .API(request)
                .then(function(response) {
                    resolve(false, response);
                })
                .catch(function(error) {
                    reject(error.response, error.response.statusCode);
                });
        });
    },

    mailGun: options => {
        var data = {
            from: options.from,
            to: options.to,
            subject: options.subject,
            html: options.body
        };

        return new Promise((resolve, reject) => {
            mailgun
                .messages()
                .send(data)
                .then(function(response) {
                    resolve(response);
                })
                .catch(function(error) {
                    reject(error.response, error.response.statusCode);
                });
        });
    }
};

module.exports = api;
