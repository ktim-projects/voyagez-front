<template>
    <button 
      type="submit" 
      :disabled="disabled"
      :class="[
        'w-full bg-gray-200 py-3 px-6 rounded-xl font-medium transition-all duration-200',
        !disabled
          ? 'bg-primary-600 text-white hover:bg-primary-700'
          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
      ]"
    >
      <slot>
        <span>{{ label }}</span>
      </slot>
    </button>
</template>

<script setup lang="ts">

defineProps<{
  disabled?: boolean
  label: string
}>()
</script>
