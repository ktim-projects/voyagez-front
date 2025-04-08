<template>
  <div class="container mx-auto px-4 py-16">
    <h2 class="text-3xl font-bold text-center mb-12">Questions Fréquentes</h2>
    <div class="max-w-3xl mx-auto space-y-4">
      <div
        v-for="(item, index) in faqs"
        :key="index"
        class="border-b bg-white rounded-md overflow-hidden"
      >
        <button
          @click="toggle(index)"
          class="w-full flex justify-between items-center px-5 py-5 text-left text-gray-700 font-medium transition-all hover:text-primary-600 hover:bg-red-50"
        >
          <span class="flex items-center">
            <component :is="item.icon" class="w-5 h-5 mr-3 text-red-600" />
            {{ item.title }}
          </span>
          <ChevronDown
            :class="[
              'w-5 h-5 transform transition-transform duration-300',
              openIndex === index ? 'rotate-180 text-red-600' : 'rotate-0'
            ]"
          />
        </button>
        <div
          v-if="openIndex === index"
          class="px-5 pb-5 bg-gray-50 text-gray-600 leading-relaxed"
          v-html="item.content"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronDown, Ticket, Wallet, Calendar } from 'lucide-vue-next'

const openIndex = ref(null)
const toggle = (index) => {
  openIndex.value = openIndex.value === index ? null : index
}

// 👇 Chaque FAQ contient un composant d'icône, un titre et un contenu HTML
const faqs = [
  {
    title: 'Comment réserver un billet ?',
    icon: Ticket,
    content: `
      <p>La réservation se fait en quelques étapes simples :</p>
      <ul class="list-disc ml-6 mt-2 space-y-2">
        <li>Choisissez votre ville de départ et d'arrivée</li>
        <li>Sélectionnez votre date de voyage</li>
        <li>Choisissez vos options de voyage</li>
        <li>Procédez au paiement sécurisé</li>
      </ul>
    `
  },
  {
    title: 'Quels sont les moyens de paiement acceptés ?',
    icon: Wallet,
    content: `
      <p>Nous acceptons plusieurs moyens de paiement :</p>
      <ul class="list-disc ml-6 mt-2 space-y-2">
        <li>Cartes bancaires (Visa, Mastercard)</li>
        <li>Mobile Money (Orange Money, MTN Money, Wave)</li>
        <li>Paiement en espèces dans nos agences</li>
      </ul>
    `
  },
  {
    title: 'Comment modifier ma réservation ?',
    icon: Calendar,
    content: `
      <p>Pour modifier votre réservation :</p>
      <ul class="list-disc ml-6 mt-2 space-y-2">
        <li>La modification est possible jusqu'à 24h avant le départ</li>
        <li>Contactez notre service client disponible 24/7</li>
        <li>Rendez-vous dans l'une de nos agences</li>
        <li>Des frais peuvent s'appliquer selon le type de modification</li>
      </ul>
    `
  }
]
</script>
