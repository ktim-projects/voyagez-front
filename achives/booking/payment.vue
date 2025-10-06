<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h1 class="text-2xl font-bold mb-6">Payment Details</h1>

      <!-- Payment Form -->
      <form @submit.prevent="processPayment" class="space-y-6">
        <!-- Card Information -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Card Number</label>
            <input 
              v-model="payment.cardNumber"
              type="text"
              class="input-field"
              placeholder="1234 5678 9012 3456"
              maxlength="19"
            >
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input 
                v-model="payment.expiryDate"
                type="text"
                class="input-field"
                placeholder="MM/YY"
                maxlength="5"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">CVV</label>
              <input 
                v-model="payment.cvv"
                type="text"
                class="input-field"
                placeholder="123"
                maxlength="3"
              >
            </div>
          </div>
        </div>

        <!-- Billing Information -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold">Billing Information</h2>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              v-model="payment.name"
              type="text"
              class="input-field"
              placeholder="John Doe"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input 
              v-model="payment.email"
              type="email"
              class="input-field"
              placeholder="john@example.com"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Billing Address</label>
            <input 
              v-model="payment.address"
              type="text"
              class="input-field"
              placeholder="Street Address"
            >
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">City</label>
              <input 
                v-model="payment.city"
                type="text"
                class="input-field"
                placeholder="City"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Postal Code</label>
              <input 
                v-model="payment.postalCode"
                type="text"
                class="input-field"
                placeholder="Postal Code"
              >
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h2 class="text-lg font-semibold mb-4">Order Summary</h2>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Journey Price</span>
              <span>€{{ route.query.total }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Service Fee</span>
              <span>€2.00</span>
            </div>
            <div class="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>€{{ Number(route.query.total) + 2 }}</span>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          class="w-full btn-primary py-3"
          :disabled="processing"
        >
          <span v-if="processing">Processing...</span>
          <span v-else>Pay Now</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const processing = ref(false);
const payment = ref({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  name: '',
  email: '',
  address: '',
  city: '',
  postalCode: ''
});

const processPayment = async () => {
  processing.value = true;
  
  try {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Redirect to confirmation page
    router.push({
      path: '/booking/confirmation',
      query: {
        reference: 'TRV' + Math.random().toString(36).substr(2, 9).toUpperCase()
      }
    });
  } catch (error) {
    console.error('Payment failed:', error);
  } finally {
    processing.value = false;
  }
};
</script>