import fs from 'fs'
import path from 'path'

// Types TypeScript
interface NewsletterSubscriber {
  email: string
  dateInscription: string
  source: string
  statut: 'actif' | 'inactif' | 'desabonne'
  ip: string
  userAgent: string
  langue: 'fr' | 'en'
}

interface NewsletterData {
  emails: NewsletterSubscriber[]
  count: number
  lastUpdated: string
  metadata?: {
    created: string
    version: string
    description: string
  }
}

interface NewsletterRequest {
  email: string
  source?: string
}

interface NewsletterResponse {
  success: boolean
  message: string
}

const DATA_FILE = path.join(process.cwd(), 'data', 'newsletter-emails.json')
function ensureDataDirectory(): void {
  const dataDir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Fonction pour lire les emails existants
function readEmails(): NewsletterData {
  ensureDataDirectory()
  
  if (!fs.existsSync(DATA_FILE)) {
    const initialData: NewsletterData = {
      emails: [],
      count: 0,
      lastUpdated: new Date().toISOString(),
      metadata: {
        created: new Date().toISOString(),
        version: '1.0.0',
        description: 'Stockage des emails newsletter pour Geyavo'
      }
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2))
    return initialData
  }
  
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8')
    return JSON.parse(data) as NewsletterData
  } catch (error) {
    console.error('Erreur lecture fichier newsletter:', error)
    return { 
      emails: [], 
      count: 0, 
      lastUpdated: new Date().toISOString() 
    }
  }
}

// Fonction pour sauvegarder les emails
function saveEmails(data: NewsletterData): boolean {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Erreur sauvegarde fichier newsletter:', error)
    return false
  }
}

// Validation email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export default defineEventHandler(async (event): Promise<NewsletterResponse> => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    const body = await readBody(event) as NewsletterRequest
    const { email, source = 'homepage' } = body

    // Validation de l'email
    if (!email || typeof email !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email requis'
      })
    }

    if (!isValidEmail(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Format email invalide'
      })
    }

    // Lire les données existantes
    const data = readEmails()

    // Vérifier si l'email existe déjà
    const existingEmail = data.emails.find(item => 
      item.email.toLowerCase() === email.toLowerCase()
    )
    
    if (existingEmail) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Email déjà inscrit'
      })
    }

    // Récupérer les informations de la requête
    const clientIP = getHeader(event, 'x-forwarded-for') || 
                     getHeader(event, 'x-real-ip') || 
                     getHeader(event, 'cf-connecting-ip') || 
                     'unknown'
    const userAgent = getHeader(event, 'user-agent') || 'unknown'
    const acceptLanguage = getHeader(event, 'accept-language') || ''

    // Ajouter le nouvel email
    const newSubscriber: NewsletterSubscriber = {
      email: email.toLowerCase().trim(),
      dateInscription: new Date().toISOString(),
      source: source,
      statut: 'actif',
      ip: clientIP,
      userAgent: userAgent,
      langue: acceptLanguage.includes('en') ? 'en' : 'fr'
    }

    data.emails.push(newSubscriber)
    data.count = data.emails.length
    data.lastUpdated = new Date().toISOString()

    // Sauvegarder
    const saved = saveEmails(data)
    if (!saved) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur de sauvegarde'
      })
    }

    return {
      success: true,
      message: 'Email ajouté avec succès',
    }

  } catch (error: any) {
    // Si c'est déjà une erreur HTTP, la relancer
    if (error.statusCode) {
      throw error
    }

    // Sinon, créer une erreur serveur générique
    console.error('Erreur API newsletter:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur interne'
    })
  }
})
