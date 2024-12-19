<template>
  <div class="bus-loader-container">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 150 75" 
        class="bus-icon"
      >
        <rect 
          x="15" 
          y="25" 
          width="120" 
          height="40" 
          rx="5" 
          fill="#3B82F6" 
          class="bus-body"
        />
        <rect x="25" y="30" width="20" height="15" fill="#BFDBFE" class="window" />
        <rect x="50" y="30" width="20" height="15" fill="#BFDBFE" class="window" />
        <rect x="80" y="30" width="20" height="15" fill="#BFDBFE" class="window" />
        <rect x="105" y="30" width="20" height="15" fill="#BFDBFE" class="window" />
        <circle cx="35" cy="65" r="10" fill="#1F2937" class="wheel" />
        <circle cx="115" cy="65" r="10" fill="#1F2937" class="wheel" />
        <circle cx="35" cy="65" r="5" fill="#4B5563" class="wheel-center" />
        <circle cx="115" cy="65" r="5" fill="#4B5563" class="wheel-center" />
      </svg>
  </div>
</template>

<style scoped>
.bus-loader-container {
  width: 100%; 
  max-width: 150px;
  margin: 0 auto; 
  padding: 1rem;
  position: relative;
}

.bus-icon {
  width: 100%; 
  animation: busMove 2s infinite linear;
}

@keyframes busMove {
  0% { 
    transform: translateX(-150%);
  }
  100% { 
    transform: translateX(150%);
  }
}
</style>
