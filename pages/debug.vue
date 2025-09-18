<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Debug - Variables d'environnement (v2)</h1>
    
    <div class="space-y-4">
      <div class="bg-gray-100 p-4 rounded">
        <h2 class="font-semibold">SUPABASE_URL:</h2>
        <p class="font-mono text-sm">{{ supabaseUrl || 'NON DÉFINIE' }}</p>
      </div>
      
      <div class="bg-gray-100 p-4 rounded">
        <h2 class="font-semibold">SUPABASE_ANON_KEY:</h2>
        <p class="font-mono text-sm">{{ supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'NON DÉFINIE' }}</p>
      </div>
      
      <div class="bg-blue-100 p-4 rounded">
        <h2 class="font-semibold">Environnement:</h2>
        <p class="font-mono text-sm">{{ $config.public.NODE_ENV || 'production' }}</p>
      </div>
      
      <div class="bg-green-100 p-4 rounded">
        <h2 class="font-semibold">Runtime Config:</h2>
        <pre class="text-xs">{{ JSON.stringify(runtimeConfig.public, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()

const supabaseUrl = runtimeConfig.public.supabaseUrl
const supabaseKey = runtimeConfig.public.supabaseAnonKey
</script>
