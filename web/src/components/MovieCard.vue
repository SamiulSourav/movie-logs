<script setup lang="ts">
import PosterImage from './PosterImage.vue'
import type { MovieSummary } from '@/types'

defineProps<{ movie: MovieSummary }>()
</script>

<template>
  <article class="card">
    <RouterLink :to="{ name: 'movie', params: { id: movie.tmdbId } }" class="card__link">
      <PosterImage :path="movie.posterPath" :title="movie.title" />
      <h3 class="card__title">{{ movie.title }}</h3>
    </RouterLink>
    <p v-if="movie.year" class="card__year">{{ movie.year }}</p>
    <div v-if="$slots.default" class="card__actions"><slot /></div>
  </article>
</template>

<style scoped>
.card { display: flex; flex-direction: column; height: 100%; }
.card__link { text-decoration: none; display: grid; gap: 0.625rem; }
.card__link:hover .card__title { text-decoration: underline; text-underline-offset: 3px; }
.card__title { font-size: 1rem; font-weight: 600; letter-spacing: -0.005em; }
.card__year { color: var(--muted); font-size: 0.875rem; margin-top: 0.125rem; }
.card__actions { margin-top: auto; padding-top: 0.75rem; }
</style>
