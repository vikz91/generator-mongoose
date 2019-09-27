'use strict';
const API = {};
API.transporter = require('@sendgrid/mail');
API.config = {};
API.address = [];

API.Init = async (Config) => {
  API.config = Config.systems.sendgrid;
  API.address = Config.address;
  API.transporter.setApiKey(API.config.API);
};

API.SendMail = async (options) => {
  const msg = {
    to: options.to,
    from: API.address.default,
    subject: options.subject,
    html: options.body
  };

  return API.transporter.send(msg);
};

API.SendMailWithTemplate = async (templateId, options) => {
  const msg = {
    to: options.to,
    from: API.address.default,
    subject: options.subject,
    templateId: options.template,
    dynamic_template_data: options.data
  };

  return API.transporter.send(msg);
};

module.exports = API;
