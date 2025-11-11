const Brevo = require('@getbrevo/brevo')
const { signUpTemplate } = require('../utils/emailTemplate')

exports.emailSender = async (options) => {
  try {
    const apikey = process.env.brevo
    const apiInstance = new Brevo.TransactionalEmailsApi()
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apikey)
    const sendSmtpEmail = new Brevo.SendSmtpEmail()
    sendSmtpEmail.subject = `${options.subject}`
    sendSmtpEmail.to = [{ email: options.email }]
    sendSmtpEmail.sender = { name: 'Eventiq', email: 'udumag51@gmail.com' }
    sendSmtpEmail.htmlContent = signUpTemplate(options.otp, options.firstName)
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
  } catch (error) {
    throw new Error('error sending email')
  }
}
