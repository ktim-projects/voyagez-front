<template>
    <button 
      :type="type"
      :disabled="disabled"
      :class="[
        'rounded-xl font-medium transition-all duration-200',
        // Tailles
        size === 'small' && 'px-4 py-2 text-sm',
        size === 'medium' && 'px-6 py-3',
        // Variantes
        variant === 'primary' && [
          'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
          disabled && 'bg-primary-200 opacity-60'
        ],
        variant === 'corail' && [
          'bg-corail-500 text-white hover:bg-corail-600 active:bg-corail-700',
          disabled && 'bg-corail-200 opacity-60'
        ],
        variant === 'outline' && [
          'bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100',
          disabled && 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
        ],
        // Largeur
        fullWidth ? 'w-full' : 'inline-flex',
        className
      ]"
    >
      <div class="flex items-center justify-center gap-2">
        <AppIcon 
          v-if="icon" 
          :name="icon" 
          :class="[
            size === 'small' ? 'w-4 h-4' : 'w-5 h-5',
            (variant === 'primary' || variant === 'corail') ? 'text-white' : 'text-current'
          ]" 
        />
        <slot>
          <span>{{ label }}</span>
        </slot>
      </div>
    </button>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  disabled?: boolean
  variant?: 'primary' | 'corail' | 'outline'
  type?: 'button' | 'submit' | 'reset'
  icon?: string
  fullWidth?: boolean
  size?: 'small' | 'medium'
  className?: string
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  variant: 'primary',
  type: 'button',
  fullWidth: true,
  size: 'medium',
  className: ''
})
</script>
