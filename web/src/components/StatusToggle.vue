<script setup lang="ts">
import { computed } from 'vue'
import { useLibraryStore } from '@/stores/library'
import type { MovieSummary } from '@/types'

const props = defineProps<{ movie: MovieSummary; compact?: boolean }>()

const library = useLibraryStore()
const entry = computed(() => library.entryFor(props.movie.tmdbId))
</script>

<template>
  <div class="status">
    <template v-if="!entry">
      <button type="button" class="btn btn--primary" @click="library.addToWatchlist(movie)">Add to watchlist</button>
      <button v-if="!compact" type="button" class="btn" @click="library.markWatched(movie)">Mark as watched</button>
    </template>

    <template v-else-if="entry.status === 'watchlist'">
      <button type="button" class="btn" :class="{ 'btn--primary': !compact }" @click="library.markWatched(movie)">
        Mark as watched
      </button>
      <button v-if="!compact" type="button" class="btn btn--quiet" @click="library.remove(movie.tmdbId)">
        Remove from watchlist
      </button>
    </template>

    <template v-else>
      <span class="status__done">Watched</span>
      <button v-if="!compact" type="button" class="btn btn--quiet" @click="library.addToWatchlist(movie)">
        Move back to watchlist
      </button>
    </template>
  </div>
</template>

<style scoped>
.status { display: flex; flex-wrap: wrap; gap: 0.5rem 0.75rem; align-items: center; }
.status__done { font-size: 0.875rem; font-weight: 600; color: var(--muted); }
</style>
