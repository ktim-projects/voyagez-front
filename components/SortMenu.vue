<template>
  <div class="relative" ref="sortMenuRef">
    <button
      @click="showMenu = !showMenu"
      class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      <ArrowUpDownIcon class="w-4 h-4" />
      Trier
      <ChevronDownIcon class="w-4 h-4" :class="{ 'transform rotate-180': showMenu }" />
    </button>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="showMenu"
        class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="py-1">
                    <!-- Button aucun-->
                    <button
            @click="sort('')"
            class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            :class="{ 'bg-gray-50': modelValue === '' }"
          >
            <span class="flex-grow text-left">Aucun</span>
            <CheckIcon v-if="modelValue === ''" class="w-4 h-4 text-primary-600" />
          </button>
          <button
            @click="sort('price_asc')"
            class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            :class="{ 'bg-gray-50': modelValue === 'price_asc' }"
          >
            <span class="flex-grow text-left">Prix croissant</span>
            <CheckIcon v-if="modelValue === 'price_asc'" class="w-4 h-4 text-primary-600" />
          </button>
          <button
            @click="sort('price_desc')"
            class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            :class="{ 'bg-gray-50': modelValue === 'price_desc' }"
          >
            <span class="flex-grow text-left">Prix décroissant</span>
            <CheckIcon v-if="modelValue === 'price_desc'" class="w-4 h-4 text-primary-600" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ArrowUpDownIcon, ChevronDownIcon, CheckIcon } from 'lucide-vue-next';
import { onClickOutside } from '@vueuse/core';

// const props = defineProps<{
//   modelValue: string;
// }>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const modelValue = defineModel<string>()

const showMenu = ref(false);
const sortMenuRef = ref(null);

const sort = (value: string) => {
  modelValue.value = value
  // emit('update:modelValue', value);
  showMenu.value = false;
};

onClickOutside(sortMenuRef, () => {
  showMenu.value = false;
});
</script>
