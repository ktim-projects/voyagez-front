import { BrevoClient, BrevoError } from '@getbrevo/brevo'

// Types TypeScript
interface NewsletterRequest {
  email: string
  source?: string
}

interface NewsletterResponse {
  success: boolean
  message: string
  contactId?: string
}

// Liste Brevo « Newsletter »
const NEWSLETTER_LIST_ID = 4

/**
 * Brevo renvoie un 400 lorsque l'email est déjà rattaché à un contact et que
 * updateEnabled vaut false. Le message se trouve dans le corps de la réponse,
 * dont la forme n'est pas typée par le SDK.
 */
function isDuplicateContactError(error: unknown): boolean {
  if (!(error instanceof BrevoError) || error.statusCode !== 400) {
    return false
  }

  const message = (error.body as { message?: string } | undefined)?.message ?? error.message

  return message.includes('email is already associated with another Contact')
}

// Validation email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export default defineEventHandler(async (event): Promise<NewsletterResponse> => {
  if (getMethod(event) !== 'POST') {
    setResponseStatus(event, 405)
    return {
      success: false,
      message: 'Method not allowed'
    }
  }

  const config = useRuntimeConfig()
  const body = await readBody(event) as NewsletterRequest
  const { email, source = 'homepage' } = body

  // Validation de l'email
  if (!email || typeof email !== 'string') {
    setResponseStatus(event, 400)
    return {
      success: false,
      message: 'Email is required'
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
    console.error('❌ [Newsletter] BREVO_API_KEY not configured')
    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Newsletter service not configured'
    }
  }

  // Récupérer les informations de la requête
  const clientIP = getHeader(event, 'x-forwarded-for') || 
                   getHeader(event, 'x-real-ip') || 
                   getHeader(event, 'cf-connecting-ip') || 
                   'unknown'
  const acceptLanguage = getHeader(event, 'accept-language') || ''
  const langue = acceptLanguage.includes('en') ? 'en' : 'fr'

  const brevo = new BrevoClient({ apiKey: config.brevoApiKey })

  try {
    await brevo.contacts.createContact({
      email: email.toLowerCase().trim(),
      listIds: [NEWSLETTER_LIST_ID],
      attributes: {
        SOURCE: source,
        LANGUE: langue,
        DATE_INSCRIPTION: new Date().toISOString(),
        IP: clientIP
      },
      updateEnabled: false // Ne pas mettre à jour si existe déjà
    })

    return {
      success: true,
      message: 'Successfully subscribed to newsletter',
    }

  } catch (brevoError) {
    if (isDuplicateContactError(brevoError)) {
      console.warn('⚠️ [Newsletter] Email déjà inscrit')
      setResponseStatus(event, 409)
      return {
        success: false,
        message: 'Email already subscribed'
      }
    }

    // Autre erreur Brevo
    console.error('❌ [Newsletter] Brevo error:', {
      status: brevoError instanceof BrevoError ? brevoError.statusCode : undefined,
      message: brevoError instanceof Error ? brevoError.message : String(brevoError)
    })

    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Error during subscription'
    }
  }
})
