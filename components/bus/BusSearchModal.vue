<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    <div class="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">Modifier la recherche</h3>
        <button @click="$emit('update:show', false)" class="text-gray-500 hover:text-gray-700">
          <XIcon class="w-5 h-5" />
        </button>
      </div>
      <form @submit.prevent="handleSearch" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Numéro de bus</label>
          <input
            v-model="localRef"
            type="text"
            class="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-corail-500 focus:border-transparent"
            placeholder="Ex: 81"
          />
        </div>
        <div class="flex justify-end space-x-3">
          <button 
            type="button" 
            @click="$emit('update:show', false)"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <AppButton type="submit" variant="corail" label="Rechercher" />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { X as XIcon } from 'lucide-vue-next';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  ref: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:show', 'update:ref', 'search']);

const localRef = ref(props.ref);

// Mettre à jour la valeur locale quand la prop change
watch(() => props.ref, (newValue) => {
  localRef.value = newValue;
});

// Mettre à jour la prop quand la valeur locale change
watch(localRef, (newValue) => {
  emit('update:ref', newValue);
});

// Gérer la soumission du formulaire
const handleSearch = () => {
  if (localRef.value.trim() !== '') {
    emit('search');
    emit('update:show', false);
  }
};
</script>
