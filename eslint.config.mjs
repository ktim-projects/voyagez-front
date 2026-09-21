import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

// ESLint 9 utilise la « flat config ». L'ancien .eslintrc.json n'était plus lu
// depuis la montée en v9 : le lint ne tournait plus du tout.
export default createConfigForNuxt({
  features: {
    stylistic: false,
    typescript: true
  }
})
  .append({
    ignores: [
      '.nuxt/**',
      '.output/**',
      '.vercel/**',
      'coverage/**',
      'dist/**',
      'node_modules/**',
      'achives/**',
      'pnpm-lock.yaml'
    ]
  })
  .append({
    rules: {
      // Les composants de page/layout Nuxt portent légitimement un nom simple
      'vue/multi-word-component-names': 'off',
      // Le typage complet des réponses Supabase reste à faire : on veut le
      // signal sans bloquer le build.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }]
    }
  })
