import * as brevo from '@getbrevo/brevo'

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

  // Configuration de l'API Brevo
  const apiInstance = new brevo.ContactsApi()
  apiInstance.setApiKey(brevo.ContactsApiApiKeys.apiKey, config.brevoApiKey)

  // Créer le contact dans Brevo
  const createContact = new brevo.CreateContact()
  createContact.email = email.toLowerCase().trim()
  createContact.listIds = [4]
  createContact.attributes = {
    SOURCE: source,
    LANGUE: langue,
    DATE_INSCRIPTION: new Date().toISOString(),
    IP: clientIP
  }
  createContact.updateEnabled = false // Ne pas mettre à jour si existe déjà

  try {
    const response = await apiInstance.createContact(createContact)
    
    console.log('✅ [Newsletter] Contact added to Brevo:', {
      email: email.toLowerCase().trim(),
      contactId: response.body?.id,
      source
    })

    return {
      success: true,
      message: 'Successfully subscribed to newsletter',
    }

  } catch (brevoError: any) {
    if (brevoError.status === 400 && brevoError.response?.data?.message?.includes('email is already associated with another Contact')) {
      console.warn('⚠️ [Newsletter] Email already subscribed:', email)
      setResponseStatus(event, 409)
      return {
        success: false,
        message: 'Email already subscribed'
      }
    }

    // Autre erreur Brevo
    console.error('❌ [Newsletter] Brevo error:', {
      status: brevoError.status,
      message: brevoError.response?.body?.message || brevoError.message
    })

    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Error during subscription'
    }
  }
})
