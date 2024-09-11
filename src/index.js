const { Queue, Worker } = require('bullmq');
const { getGmailEmails, sendGmailEmail } = require('./gmail');
const { getOutlookEmails, sendOutlookEmail } = require('./outlook');
const { categorizeEmail, generateResponse } = require('./ai');

const emailQueue = new Queue('emailQueue', {
  connection: { host: 'localhost', port: 6379 }
});

const emailWorker = new Worker('emailQueue', async job => {
  const email = job.data;
  
  const category = await categorizeEmail(email.body);
  const response = await generateResponse(email.body, category);

  if (email.provider === 'gmail') {
    await sendGmailEmail(email.from, 'Re: ' + email.subject, response);
  } else if (email.provider === 'outlook') {
    await sendOutlookEmail(email.from, 'Re: ' + email.subject, response);
  }
}, {
  connection: { host: 'localhost', port: 6379 }
});

const pollEmails = async () => {
  try {
    const [gmailEmails, outlookEmails] = await Promise.all([
      getGmailEmails(),
      getOutlookEmails()
    ]);

    const allEmails = [
      ...gmailEmails.map(email => ({ ...email, provider: 'gmail' })),
      ...outlookEmails.map(email => ({ ...email, provider: 'outlook' }))
    ];
    console.log(allEmails)

    for (const email of allEmails) {
      await emailQueue.add('processEmail', email);
    }
  } catch (error) {
    console.error('Error fetching emails:', error);
  }
};

setInterval(pollEmails, 60 * 1000); // checks every 6 sec
