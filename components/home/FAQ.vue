<template>
  <div class="container mx-auto px-4 py-16">
    <h2 class="text-3xl font-bold text-center mb-12">{{ $t('home.faq.title') }}</h2>
    <div class="max-w-3xl mx-auto space-y-4">
      <div
        v-for="(item, index) in faqs"
        :key="index"
        class="border-b bg-white rounded-md overflow-hidden"
      >
        <button
          @click="toggle(index)"
          class="w-full flex justify-between items-center px-5 py-5 text-left text-gray-700 font-medium transition-all hover:text-coral-600 hover:bg-coral-50"
        >
          <span class="flex items-center">
            <component :is="item.icon" class="w-5 h-5 mr-3 text-coral-600" />
            {{ $t(item.titleKey) }}
          </span>
          <ChevronDown
            :class="[
              'w-5 h-5 transform transition-transform duration-300',
              openIndex === index ? 'rotate-180 text-coral-600' : 'rotate-0'
            ]"
          />
        </button>
        <div
          v-if="openIndex === index"
          class="px-5 pb-5 bg-gray-50 text-gray-600 leading-relaxed"
        >
          <p>{{ $t(item.introKey) }}</p>
          <ul class="list-disc ml-6 mt-2 space-y-2">
            <li v-for="(stepKey, stepIndex) in item.steps" :key="stepIndex">
              {{ $t(stepKey) }}
            </li>
          </ul>
        </div>
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
    titleKey: 'home.faq.howToBook.title',
    introKey: 'home.faq.howToBook.intro',
    steps: [
      'home.faq.howToBook.step1',
      'home.faq.howToBook.step2',
      'home.faq.howToBook.step3',
      'home.faq.howToBook.step4'
    ],
    icon: Ticket
  },
  {
    titleKey: 'home.faq.paymentMethods.title',
    introKey: 'home.faq.paymentMethods.intro',
    steps: [
      'home.faq.paymentMethods.method1',
      'home.faq.paymentMethods.method2',
      'home.faq.paymentMethods.method3'
    ],
    icon: Wallet
  },
  {
    titleKey: 'home.faq.modifyBooking.title',
    introKey: 'home.faq.modifyBooking.intro',
    steps: [
      'home.faq.modifyBooking.point1',
      'home.faq.modifyBooking.point2',
      'home.faq.modifyBooking.point3',
      'home.faq.modifyBooking.point4'
    ],
    icon: Calendar
  }
]
</script>
