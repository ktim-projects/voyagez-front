<template>
  <div class="relative">
    <!-- Filter Button -->
    <button 
      @click="isOpen = true" 
      :class="[
        'min-w-[180px] px-4 py-2 rounded-lg flex items-center justify-between gap-2 transition-all duration-200 border text-sm',
        isActive 
          ? 'bg-gray-100 border-gray-300' 
          : 'bg-white border-gray-200 hover:border-gray-300'
      ]"
    >
      <div class="flex items-center">
        <component 
          :is="icon" 
          class="w-4 h-4 mr-2 text-gray-500"
          v-if="icon"
        />
        <div class="flex flex-col">
          <span class="font-medium text-gray-700">{{ title }}</span>
          <span class="text-xs text-gray-500">{{ subtitle }}</span>
        </div>
      </div>
      <ChevronDown 
        class="w-4 h-4 ml-2 text-gray-500"
      />
    </button>

    <!-- Overlay -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen" 
        class="fixed inset-0 bg-black bg-opacity-25 z-40"
        @click="isOpen = false"
      />
    </Transition>

    <!-- Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div 
        v-if="isOpen" 
        class="absolute left-0 mt-2 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50"
        :class="{ 'w-80': !wide, 'w-96': wide }"
      >
        <div class="p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-medium text-gray-900">{{ title }}</h3>
            <button 
              @click="isOpen = false"
              class="text-gray-400 hover:text-gray-500"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
          
          <!-- Menu Content -->
          <div class="space-y-4">
            <slot />
          </div>

          <!-- Action Buttons -->
          <div class="mt-4 flex justify-end gap-2">
            <button 
              @click="handleReset"
              class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 flex items-center"
            >
              <RefreshCcw class="w-3.5 h-3.5 mr-1.5" />
              Réinitialiser
            </button>
            <button 
              @click="handleApply"
              class="px-4 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-500"
            >
              Appliquer
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown, X, RefreshCcw } from 'lucide-vue-next';

const props = defineProps<{
  title: string
  subtitle?: string
  icon?: any
  wide?: boolean
  isActive?: boolean
}>()

const emit = defineEmits<{
  (e: 'apply'): void
  (e: 'reset'): void
}>()

const isOpen = ref(false)

const handleApply = () => {
  emit('apply')
  isOpen.value = false
}

const handleReset = () => {
  emit('reset')
  isOpen.value = false
}
</script>
