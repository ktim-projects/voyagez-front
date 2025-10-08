<template>
  <div class="container mx-auto px-4 py-16">
    <h2 class="title-poppins text-3xl text-center mb-12 text-gray-900 dark:text-white">{{ $t('home.faq.title') }}</h2>
    <div class="max-w-3xl mx-auto space-y-4">
      <div
        v-for="(item, index) in faqs"
        :key="index"
        class="border-b dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md overflow-hidden"
      >
        <button
          @click="toggle(index)"
          class="w-full flex justify-between items-center px-5 py-5 text-left text-gray-700 dark:text-gray-300 font-medium transition-all hover:text-corail-600 dark:hover:text-corail-500 hover:bg-corail-50 dark:hover:bg-gray-700"
        >
          <span class="flex items-center">
            <component :is="item.icon" class="w-5 h-5 mr-3 text-corail-600 dark:text-corail-500" />
            {{ $t(item.titleKey) }}
          </span>
          <ChevronDown
            :class="[
              'w-5 h-5 transform transition-transform duration-300',
              openIndex === index ? 'rotate-180 text-corail-600 dark:text-corail-500' : 'rotate-0'
            ]"
          />
        </button>
        <div
          v-if="openIndex === index"
          class="p-5 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 leading-relaxed"
        >
          <p>{{ $t(item.descriptionKey) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronDown, Building, Ticket, FileText } from 'lucide-vue-next'

const openIndex = ref(null)
const toggle = (index) => {
  openIndex.value = openIndex.value === index ? null : index
}

// 👇 Chaque FAQ contient un composant d'icône, un titre et une description
const faqs = [
  {
    titleKey: 'home.faq.transportCompany.title',
    descriptionKey: 'home.faq.transportCompany.description',
    icon: Building
  },
  {
    titleKey: 'home.faq.ticketReservation.title',
    descriptionKey: 'home.faq.ticketReservation.description',
    icon: Ticket
  },
  {
    titleKey: 'home.faq.publication.title',
    descriptionKey: 'home.faq.publication.description',
    icon: FileText
  }
]
</script>
