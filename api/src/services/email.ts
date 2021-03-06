const sendGrid = require('@sendgrid/mail');
sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

const defaultFrom = 'My Green Vault';

module.exports.sendEmail = (email: any, subject: any, html: any) => {
  const message = {
    to: email,
    from: 'test@example.com',
    subject: subject,
    html: html
  };

  sendGrid.send(message);
};
