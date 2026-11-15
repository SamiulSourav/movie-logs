<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MovieCard from '@/components/MovieCard.vue'
import RatingStars from '@/components/RatingStars.vue'
import StatusToggle from '@/components/StatusToggle.vue'
import { useLibraryStore } from '@/stores/library'
import { MIN_RATINGS } from '@/stores/recommendations'
import type { LibraryStatus } from '@/types'

const route = useRoute()
const library = useLibraryStore()

const tab = computed<LibraryStatus>(() => (route.query.tab === 'watched' ? 'watched' : 'watchlist'))
const items = computed(() => (tab.value === 'watched' ? library.watched : library.watchlist))
const ratingsNeeded = computed(() => Math.max(0, MIN_RATINGS - library.ratedCount))
</script>

<template>
  <section>
    <h1 class="page-title">Your library</h1>

    <nav class="tabs" aria-label="Library lists">
      <RouterLink :to="{ query: {} }" :aria-current="tab === 'watchlist' ? 'page' : undefined" class="tab" :class="{ 'tab--active': tab === 'watchlist' }">
        Watchlist <span class="tab__count">{{ library.watchlist.length }}</span>
      </RouterLink>
      <RouterLink :to="{ query: { tab: 'watched' } }" :aria-current="tab === 'watched' ? 'page' : undefined" class="tab" :class="{ 'tab--active': tab === 'watched' }">
        Watched <span class="tab__count">{{ library.watched.length }}</span>
      </RouterLink>
    </nav>

    <p v-if="library.loadState === 'loading' && !items.length" class="notice">Loading your library…</p>

    <div v-else-if="library.loadState === 'error'" class="notice notice--error">
      <p>{{ library.loadError }}</p>
      <button type="button" class="btn" @click="library.fetchAll()">Try again</button>
    </div>

    <template v-else>
      <p v-if="tab === 'watched' && library.watched.length && ratingsNeeded" class="notice hint">
        Rate {{ ratingsNeeded }} more {{ ratingsNeeded === 1 ? 'movie' : 'movies' }} to unlock suggestions.
      </p>
      <p v-else-if="tab === 'watched' && !ratingsNeeded" class="notice hint">
        You’ve rated enough to get suggestions. <RouterLink to="/discover">See what to watch next</RouterLink>
      </p>

      <p v-if="!items.length && tab === 'watchlist'" class="notice">
        Your watchlist is empty. <RouterLink to="/search">Search for a movie</RouterLink> to add it.
      </p>
      <p v-else-if="!items.length" class="notice">
        Movies you mark as watched show up here, ready to rate.
      </p>

      <ul v-else class="grid">
        <li v-for="entry in items" :key="entry.tmdbId">
          <MovieCard :movie="entry.movie">
            <RatingStars
              v-if="tab === 'watched'"
              size="sm"
              :label="`Rate ${entry.movie.title}`"
              :model-value="entry.rating"
              @update:model-value="(value) => library.rate(entry.movie, value)"
            />
            <StatusToggle v-else :movie="entry.movie" compact />
          </MovieCard>
        </li>
      </ul>
    </template>
  </section>
</template>

<style scoped>
.tabs { display: flex; gap: 1.75rem; border-bottom: 1px solid var(--line); margin-bottom: 2rem; }
.tab { text-decoration: none; font-weight: 600; padding: 0.5rem 0; margin-bottom: -1px; border-bottom: 3px solid transparent; color: var(--muted); }
.tab:hover { color: var(--ink); }
.tab--active { color: var(--ink); border-bottom-color: var(--marquee); }
.tab__count { font-weight: 400; margin-left: 0.25rem; }
.hint { margin: -0.75rem 0 2rem; }
</style>
