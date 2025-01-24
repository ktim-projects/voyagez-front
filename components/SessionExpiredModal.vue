<template>
  <Transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="modelValue" class="fixed inset-0 z-[100]" aria-modal="true" role="dialog">
      <!-- Overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" tabindex="-1" />

      <!-- Modal -->
      <div class="fixed inset-0 z-10 overflow-y-auto" @click.self="$emit('update:modelValue', false)">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                <ClockIcon class="h-6 w-6 text-yellow-600" />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-base font-semibold leading-6 text-gray-900">Session expirée</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Votre session de recherche a expiré. Voulez-vous rafraîchir les résultats ou effectuer une nouvelle recherche ?
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
              <button
                type="button"
                class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:w-auto"
                @click="$emit('refresh')"
              >
                Rafraîchir les résultats
              </button>
              <button
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                @click="$emit('new-search')"
              >
                Nouvelle recherche
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ClockIcon } from 'lucide-vue-next';
import { watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'refresh'): void;
  (e: 'new-search'): void;
}>();

// Gérer le scroll
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px'; // Pour éviter le saut dû à la disparition de la scrollbar
  } else {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
});
</script>

<style scoped>
/* Assurer que la modal est au-dessus de tout */
:deep(.modal-overlay) {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
</style>
