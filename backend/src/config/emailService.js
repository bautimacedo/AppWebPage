const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bmacedo197@alumnos.iua.edu.ar', // el correo desde el cual se enviarán los mails
    pass: 'mgaq qlhu qnxw eets', // la contraseña generada de 16 caracteres
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
        from: '"Local Hands" <bmacedo197@alumnos.iua.edu.ar>',
      to,
      subject,
      html,
    });
    console.log('Correo enviado:', info.messageId);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

module.exports = sendEmail;
