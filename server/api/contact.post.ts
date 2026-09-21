import * as brevo from '@getbrevo/brevo'

// Types TypeScript
interface ContactRequest {
  name: string
  email: string
  subject: string
  message: string
}

interface ContactResponse {
  success: boolean
  message: string
}

// Validation email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export default defineEventHandler(async (event): Promise<ContactResponse> => {
  if (getMethod(event) !== 'POST') {
    setResponseStatus(event, 405)
    return {
      success: false,
      message: 'Method not allowed'
    }
  }

  const config = useRuntimeConfig()
  const body = await readBody(event) as ContactRequest
  const { name, email, subject, message } = body

  // Validation des champs
  if (!name || !email || !subject || !message) {
    setResponseStatus(event, 400)
    return {
      success: false,
      message: 'All fields are required'
    }
  }

  if (!isValidEmail(email)) {
    setResponseStatus(event, 400)
    return {
      success: false,
      message: 'Invalid email format'
    }
  }

  // Vérifier que la clé API Brevo est configurée
  if (!config.brevoApiKey) {
    console.error('❌ [Contact] BREVO_API_KEY not configured')
    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Contact service not configured'
    }
  }

  // Récupérer les informations de la requête
  const clientIP = getHeader(event, 'x-forwarded-for') || 
                   getHeader(event, 'x-real-ip') || 
                   getHeader(event, 'cf-connecting-ip') || 
                   'unknown'

  try {
    // 1. Vérifier si l'utilisateur a déjà un message non traité
    const contactsApi = new brevo.ContactsApi()
    contactsApi.setApiKey(brevo.ContactsApiApiKeys.apiKey, config.brevoApiKey)

    try {
      const existingContact = await contactsApi.getContactInfo(email.toLowerCase().trim())
      
      // Vérifier le statut du dernier message
      if (existingContact.body.attributes?.STATUS === 'pending') {
        console.warn('⚠️ [Contact] Message déjà en attente pour ce contact')
        setResponseStatus(event, 409)
        return {
          success: false,
          message: 'You already have a pending message. Please wait for a response before sending another one.'
        }
      }
    } catch (error: any) {
      // Si le contact n'existe pas (404), c'est OK, on continue
      if (error.status !== 404) {
        throw error
      }
    }

    // 2. Créer/Mettre à jour le contact dans Brevo avec le nouveau message
    const createContact = new brevo.CreateContact()
    createContact.email = email.toLowerCase().trim()
    createContact.listIds = [6] // Liste "Geyavo Contact" (à créer dans Brevo)
    createContact.attributes = {
      NOM: name,
      SUJET: subject,
      MESSAGE: message,
      DATE_CONTACT: new Date().toISOString(),
      IP: clientIP,
      STATUS: 'pending' // pending, in_progress, resolved
    }
    createContact.updateEnabled = true // Mettre à jour si existe déjà

    try {
      await contactsApi.createContact(createContact)
    } catch (brevoError: any) {
      // Si erreur autre que "contact existe déjà", on log mais on continue
      console.warn('⚠️ [Contact] Brevo contact creation warning:', brevoError.message)
    }

    // 3. Envoyer l'email transactionnel à contact@geyavo.com
    const emailApi = new brevo.TransactionalEmailsApi()
    emailApi.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, config.brevoApiKey)

    const sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.subject = `[Geyavo Contact] ${subject}`
    sendSmtpEmail.sender = { name: 'Geyavo Contact', email: 'info@geyavo.com' }
    sendSmtpEmail.to = [{ email: 'contact@geyavo.com', name: 'Geyavo Support' }]
    sendSmtpEmail.replyTo = { email: email, name: name }
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #132968; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #132968; }
          .value { margin-top: 5px; padding: 10px; background-color: white; border-radius: 4px; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📧 Nouveau message de contact</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">👤 Nom :</div>
              <div class="value">${name}</div>
            </div>
            <div class="field">
              <div class="label">📧 Email :</div>
              <div class="value"><a href="mailto:${email}">${email}</a></div>
            </div>
            <div class="field">
              <div class="label">📋 Sujet :</div>
              <div class="value">${subject}</div>
            </div>
            <div class="field">
              <div class="label">💬 Message :</div>
              <div class="value">${message.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="field">
              <div class="label">🌐 IP :</div>
              <div class="value">${clientIP}</div>
            </div>
            <div class="field">
              <div class="label">📅 Date :</div>
              <div class="value">${new Date().toLocaleString('fr-FR')}</div>
            </div>
          </div>
          <div class="footer">
            <p>Ce message a été envoyé depuis le formulaire de contact de Geyavo.</p>
            <p>Vous pouvez répondre directement à cet email pour contacter ${name}.</p>
          </div>
        </div>
      </body>
      </html>
    `

    await emailApi.sendTransacEmail(sendSmtpEmail)

    // 4. Envoyer notification Slack (optionnel, ne bloque pas si erreur)
    if (config.slackWebhookUrl) {
      try {
        await $fetch(config.slackWebhookUrl, {
          method: 'POST',
          body: {
            text: `📧 *Nouveau message de contact*`,
            blocks: [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: '📧 Nouveau message de contact',
                  emoji: true
                }
              },
              {
                type: 'section',
                fields: [
                  {
                    type: 'mrkdwn',
                    text: `*👤 Nom:*\n${name}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*📧 Email:*\n${email}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*📋 Sujet:*\n${subject}`
                  },
                  {
                    type: 'mrkdwn',
                    text: `*🌐 IP:*\n${clientIP}`
                  }
                ]
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*💬 Message:*\n${message}`
                }
              },
              {
                type: 'context',
                elements: [
                  {
                    type: 'mrkdwn',
                    text: `📅 ${new Date().toLocaleString('fr-FR')} | 🔗 <mailto:${email}|Répondre par email>`
                  }
                ]
              }
            ]
          }
        })
      } catch (slackError: any) {
        console.warn('⚠️ [Contact] Slack notification failed:', slackError.message)
        // On ne bloque pas l'envoi du message si Slack échoue
      }
    }

    return {
      success: true,
      message: 'Message sent successfully'
    }

  } catch (brevoError: any) {
    console.error('❌ [Contact] Brevo error:', {
      status: brevoError.status,
      message: brevoError.response?.body?.message || brevoError.message
    })

    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Error sending message'
    }
  }
})
