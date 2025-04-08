<template>
  <div class="bg-red-50 py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-4">Restez informé</h2>
        <p class="text-gray-600 mb-8">Recevez nos meilleures offres et actualités</p>
        <form class="flex flex-col sm:flex-row gap-4">
          <input type="email" placeholder="Votre email" 
            class="flex-1 px-4 py-2 rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500">
          <!-- <Button 
              label="S'abonner" 
              class="w-full h-[42px]" 
              severity="danger"
              raised
              :style="{
                background: '#dc2626',
                border: 'none',
                transition: 'all 0.3s ease',
                color: '#ffffff'
              }"
            /> -->
            <AppButton label="S'abonner" />
        </form>
      </div>
    </div>
  </div>
</template>