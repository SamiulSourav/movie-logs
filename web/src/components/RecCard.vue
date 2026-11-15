<script setup lang="ts">
import PosterImage from './PosterImage.vue'
import StatusToggle from './StatusToggle.vue'
import type { Recommendation } from '@/types'

defineProps<{ item: Recommendation }>()
</script>

<template>
  <article class="rec">
    <RouterLink :to="{ name: 'movie', params: { id: item.movie.tmdbId } }" class="rec__poster" tabindex="-1" aria-hidden="true">
      <PosterImage :path="item.movie.posterPath" :title="item.movie.title" size="w185" />
    </RouterLink>
    <div class="rec__body">
      <h3 class="rec__title">
        <RouterLink :to="{ name: 'movie', params: { id: item.movie.tmdbId } }">{{ item.movie.title }}</RouterLink>
        <span v-if="item.movie.year" class="rec__year">{{ item.movie.year }}</span>
      </h3>
      <p class="rec__reason">{{ item.reason }}</p>
      <StatusToggle :movie="item.movie" compact />
    </div>
  </article>
</template>

<style scoped>
.rec { display: grid; grid-template-columns: 6.5rem 1fr; gap: 1.25rem; align-items: start; }
.rec__body { display: grid; gap: 0.625rem; justify-items: start; padding-top: 0.25rem; }
.rec__title { font-size: 1.375rem; letter-spacing: -0.015em; }
.rec__title a { text-decoration: none; }
.rec__title a:hover { text-decoration: underline; text-underline-offset: 4px; }
.rec__year { font-family: var(--font-body); font-weight: 400; font-size: 1rem; color: var(--muted); margin-left: 0.5rem; }
.rec__reason { max-width: 38rem; }
</style>
