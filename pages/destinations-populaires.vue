<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-corail-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
            <ArrowLeftIcon class="w-5 h-5" />
            <span class="font-medium">Retour à l'accueil</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <div class="container mx-auto px-4 py-12">
      <div class="text-center max-w-3xl mx-auto mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Destination non disponible
        </h1>
        
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
          La destination que vous recherchez n'est pas encore disponible sur notre plateforme. 
          Découvrez nos trajets les plus populaires en Côte d'Ivoire !
        </p>

        <!-- Recherche rapide -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Ou recherchez votre trajet :
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CityAutocomplete
              v-model="from"
              :placeholder="$t('search.departurePlaceholder')"
              :autoFocus="false"
            />
            <CityAutocomplete
              v-model="to"
              :placeholder="$t('search.arrivalPlaceholder')"
              :autoFocus="false"
            />
          </div>
          <AppButton
            :label="$t('search.searchButton')"
            variant="corail"
            class="mt-4 w-full"
            :disabled="!from || !to"
            @click="handleSearch"
          />
        </div>
      </div>

      <!-- Destinations populaires -->
      <div class="max-w-6xl mx-auto">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
          🔥 Trajets les plus populaires
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Carte de destination -->
          <div
            v-for="destination in popularDestinations"
            :key="`${destination.from}-${destination.to}`"
            @click="quickSearch(destination.from, destination.to)"
            class="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 border border-gray-200 dark:border-gray-700"
          >
            <!-- Header avec gradient -->
            <div class="h-32 bg-gradient-to-br from-primary-600 to-corail-500 relative overflow-hidden">
              <div class="absolute inset-0 bg-black/10"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <BusIcon class="w-16 h-16 text-white/80" />
              </div>
              <!-- Badge prix -->
              <div class="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <span class="text-sm font-bold text-primary-600 dark:text-primary-400">
                  {{ destination.price }} FCFA
                </span>
              </div>
            </div>

            <!-- Contenu -->
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-3 h-3 rounded-full bg-primary-600 dark:bg-primary-400"></div>
                    <span class="font-semibold text-gray-900 dark:text-white">{{ destination.from }}</span>
                  </div>
                  <div class="flex items-center gap-2 ml-5">
                    <ArrowDownIcon class="w-4 h-4 text-gray-400" />
                  </div>
                  <div class="flex items-center gap-2 mt-2">
                    <div class="w-3 h-3 rounded-full bg-corail-500"></div>
                    <span class="font-semibold text-gray-900 dark:text-white">{{ destination.to }}</span>
                  </div>
                </div>
                <ChevronRightIcon class="w-6 h-6 text-gray-400 group-hover:text-corail-500 group-hover:translate-x-1 transition-all duration-300" />
              </div>

              <!-- Infos supplémentaires -->
              <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-1">
                  <ClockIcon class="w-4 h-4" />
                  <span>~{{ destination.duration }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <UsersIcon class="w-4 h-4" />
                  <span>{{ destination.popularity }}</span>
                </div>
              </div>

              <!-- Bouton d'action -->
              <button class="mt-4 w-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium py-2 rounded-lg group-hover:bg-primary-600 group-hover:text-white dark:group-hover:bg-primary-600 transition-all duration-300">
                Rechercher ce trajet
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Section aide -->
      <div class="max-w-4xl mx-auto mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
            <HelpCircleIcon class="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Besoin d'aide ?
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Vous ne trouvez pas votre destination ? Notre équipe est là pour vous aider !
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
              to="/contact"
              class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <MessageCircleIcon class="w-5 h-5" />
              Nous contacter
            </NuxtLink>
            <NuxtLink
              to="/"
              class="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-600"
            >
              <HomeIcon class="w-5 h-5" />
              Retour à l'accueil
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  ArrowLeftIcon, 
  MapPinIcon, 
  BusIcon, 
  ArrowDownIcon, 
  ChevronRightIcon, 
  ClockIcon, 
  UsersIcon,
  HelpCircleIcon,
  MessageCircleIcon,
  HomeIcon
} from 'lucide-vue-next';
import { getSlugFromCity } from '~/utils/cities';

const router = useRouter();
const from = ref('');
const to = ref('');

// Destinations populaires
const popularDestinations = [
  {
    from: 'Abidjan',
    to: 'Yamoussoukro',
    price: '3 500',
    duration: '3h30',
    popularity: 'Très populaire'
  },
  {
    from: 'Abidjan',
    to: 'Bouaké',
    price: '4 000',
    duration: '4h',
    popularity: 'Populaire'
  },
  {
    from: 'Abidjan',
    to: 'San-Pédro',
    price: '5 500',
    duration: '5h30',
    popularity: 'Populaire'
  },
  {
    from: 'Abidjan',
    to: 'Korhogo',
    price: '6 000',
    duration: '7h',
    popularity: 'Fréquent'
  },
  {
    from: 'Yamoussoukro',
    to: 'Bouaké',
    price: '2 000',
    duration: '1h30',
    popularity: 'Populaire'
  },
  {
    from: 'Bouaké',
    to: 'Korhogo',
    price: '3 500',
    duration: '3h',
    popularity: 'Fréquent'
  }
];

const handleSearch = async () => {
  if (!from.value || !to.value) return;

  const fromSlug = getSlugFromCity(from.value);
  const toSlug = getSlugFromCity(to.value);

  await router.push(`/results/${fromSlug}/${toSlug}`);
};

const quickSearch = async (fromCity: string, toCity: string) => {
  const fromSlug = getSlugFromCity(fromCity);
  const toSlug = getSlugFromCity(toCity);

  await router.push(`/results/${fromSlug}/${toSlug}`);
};

// SEO
useHead({
  title: 'Destinations populaires - Geyavo',
  meta: [
    {
      name: 'description',
      content: 'Découvrez les trajets les plus populaires en Côte d\'Ivoire. Réservez votre voyage en car entre Abidjan, Yamoussoukro, Bouaké et plus encore.'
    },
    {
      name: 'keywords',
      content: 'destinations populaires, trajets Côte d\'Ivoire, Abidjan, Yamoussoukro, Bouaké, San-Pédro, Korhogo'
    }
  ]
});
</script>
