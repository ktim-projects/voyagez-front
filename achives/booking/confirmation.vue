<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center">
      <div class="rounded-full bg-green-100 p-3 mx-auto w-16 h-16">
        <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      
      <h1 class="mt-4 text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
      <p class="mt-2 text-gray-600">
        Your booking reference is: <span class="font-mono font-bold">{{ route.query.reference }}</span>
      </p>
      
      <div class="mt-8 bg-white rounded-lg shadow-lg p-6 text-left">
        <h2 class="text-xl font-semibold mb-4">Booking Details</h2>
        <div class="space-y-4">
          <div class="border-b pb-4">
            <p class="text-gray-600">A confirmation email has been sent to your email address.</p>
          </div>
          
          <div>
            <h3 class="font-medium mb-2">Important Information</h3>
            <ul class="list-disc list-inside space-y-2 text-gray-600">
              <li>Please arrive at least 30 minutes before departure</li>
              <li>Don't forget to bring a valid ID</li>
              <li>Your e-ticket will be attached to the confirmation email</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="mt-8 space-x-4">
        <NuxtLink to="/" class="btn-primary">
          Return to Home
        </NuxtLink>
        <button @click="downloadTicket" class="btn-primary bg-gray-600 hover:bg-gray-700">
          Download Ticket
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const downloadTicket = () => {
  // Implement ticket download functionality
  console.log('Downloading ticket...');
};
</script>