<template>
  <div
    v-if="phone"
    class="lg:hidden sticky bottom-0 z-20 flex gap-2.5 px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur-lg"
    :style="{ background: 'var(--gy-sticky-bg)', borderTop: '1px solid var(--gy-line)' }"
  >
    <a
      :href="`tel:${toPhoneHref(phone)}`"
      class="flex-1 flex items-center justify-center gap-2 min-h-[48px] rounded-xl text-[15px] font-semibold text-white bg-corail-500 hover:bg-[#f2573a] transition-colors"
    >
      <Phone class="w-4 h-4" />
      Appeler
    </a>

    <button
      type="button"
      class="shrink-0 flex items-center justify-center gap-2 min-h-[48px] px-[18px] rounded-xl text-[15px] font-semibold"
      :style="{ background: 'var(--gy-brand-soft)', color: 'var(--gy-brand-ink)' }"
      @click="share"
    >
      <Check v-if="copied" class="w-4 h-4" />
      <Share2 v-else class="w-4 h-4" />
      {{ copied ? 'Lien copié' : 'Partager' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { Check, Phone, Share2 } from 'lucide-vue-next';
import { toPhoneHref } from '~/utils/companies';

const props = defineProps<{
  phone: string | null;
  companyName: string;
}>();

const copied = ref(false);

/**
 * La page est faite pour circuler sur WhatsApp : on passe par le partage
 * natif du téléphone quand il existe, et on retombe sur une copie du lien
 * sinon (navigateur de bureau, contexte non sécurisé).
 */
const share = async () => {
  const url = window.location.href;
  const title = `Horaires ${props.companyName} — Geyavo`;

  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return;
    } catch {
      // Partage refusé par l'utilisateur : on ne force pas la copie.
      return;
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  } catch {
    // Sans presse-papier accessible, il n'y a rien à proposer de mieux.
  }
};
</script>
