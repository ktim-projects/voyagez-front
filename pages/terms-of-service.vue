<template>
  <div class="bg-gray-50 py-16">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Conditions d'Utilisation</h1>
        
        <div class="prose prose-lg max-w-none">
          <p class="text-gray-600 mb-8">
            Dernière mise à jour : 31 janvier 2025
          </p>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">1. Acceptation des conditions</h2>
            <p class="text-gray-600 mb-4">
              En accédant et en utilisant la plateforme VoyagezCi, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">2. Description du service</h2>
            <p class="text-gray-600 mb-4">
              VoyagezCi est une plateforme de réservation de billets de car en ligne qui permet aux utilisateurs de :
            </p>
            <ul class="list-disc pl-6 text-gray-600 mb-4">
              <li>Rechercher des trajets disponibles</li>
              <li>Comparer les prix et services</li>
              <li>Réserver et payer des billets</li>
              <li>Gérer leurs réservations</li>
            </ul>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">3. Compte utilisateur</h2>
            <p class="text-gray-600 mb-4">
              Pour utiliser certaines fonctionnalités de notre service, vous devez créer un compte. Vous êtes responsable de :
            </p>
            <ul class="list-disc pl-6 text-gray-600 mb-4">
              <li>Maintenir la confidentialité de votre compte</li>
              <li>Fournir des informations exactes et à jour</li>
              <li>Toutes les activités effectuées sous votre compte</li>
            </ul>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">4. Réservations et paiements</h2>
            <p class="text-gray-600 mb-4">
              En effectuant une réservation sur VoyagezCi :
            </p>
            <ul class="list-disc pl-6 text-gray-600 mb-4">
              <li>Vous garantissez que les informations fournies sont exactes</li>
              <li>Vous acceptez de payer le montant total indiqué</li>
              <li>Vous comprenez notre politique d'annulation et de remboursement</li>
            </ul>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">5. Annulations et remboursements</h2>
            <p class="text-gray-600 mb-4">
              Les conditions d'annulation et de remboursement dépendent de la compagnie de transport. En général :
            </p>
            <ul class="list-disc pl-6 text-gray-600 mb-4">
              <li>Les annulations 24h avant le départ peuvent être remboursées</li>
              <li>Des frais d'annulation peuvent s'appliquer</li>
              <li>Les remboursements sont traités sous 5-10 jours ouvrés</li>
            </ul>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">6. Limitation de responsabilité</h2>
            <p class="text-gray-600 mb-4">
              VoyagezCi agit en tant qu'intermédiaire entre les voyageurs et les compagnies de transport. Nous ne sommes pas responsables :
            </p>
            <ul class="list-disc pl-6 text-gray-600 mb-4">
              <li>Des retards ou annulations de voyage</li>
              <li>Des services fournis par les compagnies de transport</li>
              <li>Des pertes ou dommages indirects</li>
            </ul>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">7. Modifications des conditions</h2>
            <p class="text-gray-600 mb-4">
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur publication sur notre site.
            </p>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">8. Contact</h2>
            <p class="text-gray-600 mb-4">
              Pour toute question concernant nos conditions d'utilisation, contactez-nous à :
              <a href="mailto:legal@voyagezci.com" class="text-primary-600 hover:text-primary-700">
                legal@voyagezci.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Conditions d\'Utilisation - VoyagezCi',
  meta: [
    {
      name: 'description',
      content: 'Conditions d\'utilisation de VoyagezCi - Découvrez les règles et conditions d\'utilisation de notre plateforme.'
    }
  ]
})
</script>
