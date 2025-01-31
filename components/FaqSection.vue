<template>
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Questions fréquemment posées</h2>
        <p class="text-lg text-gray-600">
          Trouvez rapidement des réponses à vos questions les plus courantes
        </p>
      </div>

      <div class="max-w-3xl mx-auto">
        <div class="space-y-4">
          <div v-for="(item, index) in faqItems" :key="index" class="border border-gray-200 rounded-lg overflow-hidden">
            <button
              @click="toggleItem(index)"
              class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
              :aria-expanded="activeIndex === index"
            >
              <span class="text-lg font-medium text-gray-900">{{ item.question }}</span>
              <ChevronDownIcon
                class="w-5 h-5 text-gray-500 transition-transform duration-200"
                :class="{ 'transform rotate-180': activeIndex === index }"
              />
            </button>
            <div
              v-show="activeIndex === index"
              class="px-6 py-4 bg-white"
            >
              <p class="text-gray-600">{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDownIcon } from 'lucide-vue-next'

const activeIndex = ref<number | null>(null)

const toggleItem = (index: number) => {
  activeIndex.value = activeIndex.value === index ? null : index
}

const faqItems = [
  {
    question: "Comment puis-je réserver un billet de car ?",
    answer: "Vous pouvez réserver un billet en utilisant notre plateforme en ligne. Il suffit de sélectionner votre trajet, choisir votre compagnie préférée et procéder au paiement sécurisé."
  },
  {
    question: "Quels sont les moyens de paiement acceptés ?",
    answer: "Nous acceptons plusieurs moyens de paiement : Orange Money, MTN Money, Moov Money, Wave, ainsi que les cartes bancaires Visa et Mastercard."
  },
  {
    question: "Puis-je annuler ou modifier ma réservation ?",
    answer: "Oui, vous pouvez annuler ou modifier votre réservation jusqu'à 24 heures avant le départ. Des frais peuvent s'appliquer selon la politique de la compagnie de transport."
  },
  {
    question: "Quel est le poids de bagage autorisé ?",
    answer: "La limite de bagages varie selon la compagnie, mais généralement, vous avez droit à un bagage en soute de 20kg et un bagage à main. Des frais supplémentaires peuvent s'appliquer pour le surplus."
  },
  {
    question: "Comment obtenir mon billet électronique ?",
    answer: "Après votre paiement, votre billet électronique sera envoyé automatiquement par email et SMS. Vous pouvez également le retrouver dans votre espace client sur notre plateforme."
  },
  {
    question: "Que faire en cas de retard ou d'annulation ?",
    answer: "En cas de retard ou d'annulation, vous serez notifié par SMS et email. Nous vous proposerons soit un remboursement, soit une réservation sur le prochain départ disponible."
  }
]
</script>
