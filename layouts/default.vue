<template>
  <div class="min-h-screen flex flex-col">
    <TheNavbar/>
    <main class="flex-grow">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>