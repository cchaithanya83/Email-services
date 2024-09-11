const nodemailer = require('nodemailer');
const Imap = require('imap-simple');
require('dotenv').config();

const gmailConfig = {
  email: process.env.EMAIL,        
  appPassword: process.env.APPPASS,      
};

const imapConfig = {
  imap: {
    user: gmailConfig.email,
    password: gmailConfig.appPassword,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false,
    },
    authTimeout: 3000,
  },
};

const getGmailEmails = async () => {
  return new Promise((resolve, reject) => {
    Imap.connect(imapConfig)
      .then((connection) => {
        return connection.openBox('INBOX').then(() => {
          const searchCriteria = ['UNSEEN'];
          const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: true, 
          };

          return connection.search(searchCriteria, fetchOptions).then((messages) => {
            const emails = messages.map((msg) => {
              const header = msg.parts.filter((part) => part.which === 'HEADER')[0];
              const body = msg.parts.filter((part) => part.which === 'TEXT')[0];
              return {
                from: header.body.from[0],
                subject: header.body.subject[0],
                body: body.body,
              };
            });
            resolve(emails);
          });
        });
      })
      .catch(reject);
  });
};

const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailConfig.email,
    pass: gmailConfig.appPassword,
  },
  tls: {
    rejectUnauthorized: false, 
  },
});

const sendGmailEmail = async (to, subject, body) => {
  const mailOptions = {
    from: gmailConfig.email,
    to,
    subject,
    text: body,
  };

  await smtpTransport.sendMail(mailOptions);
};


module.exports = { getGmailEmails, sendGmailEmail };