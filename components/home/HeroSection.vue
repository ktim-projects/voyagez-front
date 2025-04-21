<template>
  <div class="relative bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop'); height: 400px;">
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>
    <div class="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center items-center text-center">
      <h2 class="text-4xl font-bold tracking-tight text-white sm:text-5xl">
        {{ $t('home.hero.title') }}
      </h2>
      <p class="mt-6 text-lg leading-8 text-gray-200 max-w-2xl">
        {{ $t('home.hero.subtitle') }}
      </p>
    </div>
  </div>
</template>