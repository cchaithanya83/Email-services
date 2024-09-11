require('dotenv').config(); 
const nodemailer = require('nodemailer');
const Imap = require('imap-simple');


const outlookConfig = {
  email: process.env.OUTLOOK_EMAIL,         
  password: process.env.OUTLOOK_PASSWORD,   
};


const imapConfig = {
  imap: {
    user: outlookConfig.email,
    password: outlookConfig.password,
    host: 'outlook.office365.com',
    port: 993,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false, 
    },
    authTimeout: 3000,
  },
};


const getOutlookEmails = async (maxEmails = 5) => {
  return new Promise((resolve, reject) => {
    Imap.connect(imapConfig)
      .then((connection) => {
        return connection.openBox('INBOX').then(() => {
          const searchCriteria = ['UNSEEN'];
          const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: true, 
            struct: true,
          };

          return connection.search(searchCriteria, fetchOptions).then((messages) => {
            const recentMessages = messages.slice(-maxEmails);

            const recentEmails = recentMessages.map((msg) => {
                // console.log(msg.parts)
              const header = msg.parts.filter((part) => part.which === 'HEADER')[0];
              const body = msg.parts.filter((part) => part.which === 'TEXT')[0];
            //   console.log(body)
              return {
                from: header.body.from[0],
                subject: header.body.subject[0],
                body: body.body,
                date: header.body.date[0],
              };
            });
            resolve(recentEmails);
          });
        });
      })
      .catch(reject);
  });
};


const smtpTransport = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: outlookConfig.email,
    pass: outlookConfig.password,
  },
  tls: {
    rejectUnauthorized: false, 
  },
});


const sendOutlookEmail = async (to, subject, body) => {
  const mailOptions = {
    from: outlookConfig.email,
    to,
    subject,
    text: body,
  };

  await smtpTransport.sendMail(mailOptions);
};


module.exports = { getOutlookEmails, sendOutlookEmail };