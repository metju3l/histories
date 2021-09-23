import nodemailer from 'nodemailer';

const { MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD } = process.env;

const SendEmail = async (subject: string, html: string, target: string) => {
  const transport = nodemailer.createTransport({
    host: MAIL_HOST,
    port: parseInt(MAIL_PORT!),
    secure: false,
    auth: {
      user: MAIL_USERNAME,
      pass: MAIL_PASSWORD,
    },
  });

  try {
    await transport.sendMail({
      from: `hiStories <${MAIL_USERNAME}>`,
      to: target,
      subject,
      html,
    });
  } catch (error) {
    console.log(error);
  }
};

export default SendEmail;
