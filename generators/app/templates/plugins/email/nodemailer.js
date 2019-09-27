'use strict';
const path = require('path');
const nodemailer = require('nodemailer');
const Email = require('email-templates');
const API = {};

API.transporter = {};
API.config = {};
API.templateExtension = 'hbs';

API.Init = async (Config) => {
  API.config = Config;
  API.templateDir = Config.templatePath || './';

  if (Config.service !== 'local') {
    API.transporter = nodemailer.createTransport({
      service: Config.service,
      auth: {
        user: Config.user,
        pass: Config.pass
      }
    });
  } else {
    API.transporter = nodemailer.createTransport(Config.options);
  }
};

API.SendMail = async (options) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
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
    return API.transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        reject(err);
      } else {
        resolve(info.response);
      }
    });
  });
};

API.SendMailWithTemplate = async (templatePath, options) => {
  return new Promise((resolve, reject) => {
    const email = new Email({
      transport: API.transport,
      views: {
        root: path.resolve(API.templateDir),
        options: {
          extension: API.templateExtension
        }
      }
    });

    return email
      .render(templatePath, options.data)
      .then(html => {
        var mailOptions = {
          from: options.from,
          to: options.to,
          subject: options.subject,
          // text: results.text,
          body: html
        };

        // send mail with defined transport object
        return API
          .SendMail(mailOptions)
          .then(resolve, reject)
          .catch(reject);
      })
      .catch(err => {
        reject(err);
      });
  });
};

module.exports = API;
