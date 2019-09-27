const debug = require('debug')('App:Plugin');

const API = {};

API.rawConfig = {};
API.config = {};
API.provider = {};

API.Init = async (Config) => {
  API.rawConfig = Config;
  API.UseSystem(Config.defaultSystem);
  debug('Loading Plugin : Email');
};

// Used for Dual Usage ( chaning mail provider dynamically)
API.UseSystem = (system) => {
  API.config = API.rawConfig.systems[system];
  API.provider = require('./' + system);

  return API.provider.Init(API.rawConfig);
};

API.SendMail = async (mailOptions) => {
  return API.provider.SendMail(mailOptions);
};

API.SendMailWithTemplate = async (template, mailOptions) => {
  return API.provider.SendMailWithTemplate(template, mailOptions);
};

API.MailOptions = class {
  constructor (to, subject, body, data, template) {
    this.to = to;
    this.subject = subject;
    this.body = body;
    this.data = data;

    if (template) {
      this.template = template;
    }
  }

  AddAttachment (...files) {
    this.attachtments = files;
  }

  toString () {
    return `to:${this.to} || subject : ${this.subject} || data: ${JSON.stringify(this.data)} `;
  }
};

module.exports = API;
