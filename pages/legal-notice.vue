<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- En-tête -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Mentions Légales</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Informations légales concernant le site Geyavo
        </p>
      </div>

      <!-- Contenu -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 space-y-8">
        
        <!-- Éditeur du site -->
        <section>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Éditeur du site</h2>
          <div class="text-gray-700 dark:text-gray-300 space-y-2">
            <p><strong>Nom de l'entreprise :</strong> Geyavo</p>
            <p><strong>Forme juridique :</strong> Société à Responsabilité Limitée (SARL)</p>
            <p><strong>Siège social :</strong> Abidjan, Côte d'Ivoire</p>
            <p><strong>Email :</strong> contact@geyavo.com</p>
            <p><strong>Téléphone :</strong> +225 07 66 66 66 66</p>
            <p><strong>Directeur de la publication :</strong> Équipe Geyavo</p>
          </div>
        </section>

        <!-- Hébergement -->
        <section>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Hébergement</h2>
          <div class="text-gray-700 dark:text-gray-300 space-y-2">
            <p><strong>Hébergeur :</strong> Vercel Inc.</p>
            <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
            <p><strong>Site web :</strong> <a href="https://vercel.com" target="_blank" class="text-primary-600 dark:text-primary-400 hover:underline">https://vercel.com</a></p>
          </div>
        </section>

        <!-- Propriété intellectuelle -->
        <section>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Propriété intellectuelle</h2>
          <div class="text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              L'ensemble de ce site relève de la législation ivoirienne et internationale sur le droit d'auteur et la propriété intellectuelle. 
              Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
            <p>
              La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite 
              sauf autorisation expresse du directeur de la publication.
            </p>
            <p>
              Les marques et logos figurant sur le site sont déposés par Geyavo ou éventuellement par ses partenaires. 
              Toute reproduction totale ou partielle de ces marques ou logos effectuée à partir des éléments du site 
              sans l'autorisation expresse de Geyavo est donc prohibée.
            </p>
          </div>
        </section>

        <!-- Responsabilité -->
        <section>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Responsabilité</h2>
          <div class="text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              Les informations contenues sur ce site sont aussi précises que possible et le site est périodiquement remis à jour, 
              mais peut toutefois contenir des inexactitudes, des omissions ou des lacunes.
            </p>
            <p>
              Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, 
              merci de bien vouloir le signaler par email à l'adresse contact@geyavo.com, 
              en décrivant le problème de la manière la plus précise possible.
            </p>
            <p>
              Geyavo ne pourra en aucune circonstance être tenu responsable de tout dommage de quelque nature qu'il soit 
              résultant de l'interprétation ou de l'utilisation des informations et/ou documents disponibles sur ce site.
            </p>
          </div>
        </section>

        <!-- Liens hypertextes -->
        <section>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Liens hypertextes</h2>
          <div class="text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              Les sites internet de tiers auxquels il est fait référence sur le site ne sont pas sous le contrôle de Geyavo. 
              En conséquence, Geyavo n'est pas responsable du contenu de ces sites internet.
            </p>
            <p>
              Les risques liés à l'utilisation de ces sites incombent pleinement à l'utilisateur. 
              Il se conformera à leurs conditions d'utilisation.
            </p>
            <p>
              Les utilisateurs, les abonnés et les visiteurs du site ne peuvent mettre en place un hyperlien 
              en direction de ce site sans l'autorisation expresse et préalable de Geyavo.
            </p>
          </div>
        </section>

        <!-- Services de transport -->
        <section>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Services de transport</h2>
          <div class="text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              Geyavo est une plateforme de comparaison et de recherche d'itinéraires de transport en Côte d'Ivoire. 
              Nous ne sommes pas une compagnie de transport et n'opérons aucun véhicule.
            </p>
            <p>
              Les services de transport sont fournis par des compagnies de transport tierces partenaires. 
              Geyavo n'est pas responsable de la qualité, de la sécurité ou de la ponctualité des services de transport.
            </p>
            <p>
              Toute réclamation concernant un voyage doit être adressée directement à la compagnie de transport concernée.
            </p>
          </div>
        </section>

        <!-- Données personnelles -->
        <section>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Protection des données personnelles</h2>
          <div class="text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              Geyavo s'engage à protéger la vie privée de ses utilisateurs. 
              Le traitement des données personnelles est régi par notre 
              <NuxtLink to="/privacy-policy" class="text-primary-600 dark:text-primary-400 hover:underline">
                Politique de Confidentialité
              </NuxtLink>.
            </p>
            <p>
              Conformément à la loi ivoirienne sur la protection des données personnelles, 
              vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.
            </p>
          </div>
        </section>

        <!-- Droit applicable -->
        <section>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Droit applicable et juridiction</h2>
          <div class="text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              Tout litige en relation avec l'utilisation du site geyavo.com est soumis au droit ivoirien. 
              Il est fait attribution exclusive de juridiction aux tribunaux compétents d'Abidjan.
            </p>
          </div>
        </section>

        <!-- Contact -->
        <section>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Contact</h2>
          <div class="text-gray-700 dark:text-gray-300 space-y-2">
            <p>
              Pour toute question concernant ces mentions légales, vous pouvez nous contacter :
            </p>
            <ul class="list-disc list-inside space-y-1 ml-4">
              <li>Par email : contact@geyavo.com</li>
              <li>Par téléphone : +225 07 66 66 66 66</li>
              <li>
                Via notre 
                <NuxtLink to="/contact" class="text-primary-600 dark:text-primary-400 hover:underline">
                  formulaire de contact
                </NuxtLink>
              </li>
            </ul>
          </div>
        </section>

        <!-- Date de mise à jour -->
        <section class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            <strong>Dernière mise à jour :</strong> {{ new Date().toLocaleDateString('fr-FR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) }}
          </p>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO
useHead({
  title: 'Mentions Légales - Geyavo',
  meta: [
    {
      name: 'description',
      content: 'Mentions légales du site Geyavo - Informations sur l\'éditeur, l\'hébergement, la propriété intellectuelle et les conditions d\'utilisation.'
    },
    {
      name: 'robots',
      content: 'index, follow'
    }
  ]
})
</script>
