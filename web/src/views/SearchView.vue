<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MovieCard from '@/components/MovieCard.vue'
import StatusToggle from '@/components/StatusToggle.vue'
import { USE_MOCKS } from '@/api/client'
import { useDebouncedSearch } from '@/composables/useDebouncedSearch'

const route = useRoute()
const router = useRouter()

const { query, results, loading, error, searched, minLength } = useDebouncedSearch(String(route.query.q ?? ''))

// Keep the search term in the URL so results survive refresh and back navigation.
watch(query, (value) => {
  const q = value.trim()
  router.replace({ query: q ? { q } : {} })
})
</script>

<template>
  <section>
    <h1 class="page-title">Find a movie</h1>

    <div class="search">
      <label for="search-input" class="visually-hidden">Search movies by title</label>
      <input
        id="search-input"
        v-model="query"
        class="field search__input"
        type="search"
        placeholder="Search by title"
        autocomplete="off"
        autofocus
      />
    </div>

    <div class="search__status" aria-live="polite">
      <p v-if="error" class="notice notice--error">{{ error }}</p>
      <p v-else-if="loading && !results.length" class="notice">Searching…</p>
      <p v-else-if="searched && !results.length" class="notice">
        No movies match “{{ query.trim() }}”. Check the spelling or try fewer words.
      </p>
      <p v-else-if="!searched && !loading" class="notice">
        Type at least {{ minLength }} letters to search.
        <template v-if="USE_MOCKS">The sample data has 14 films; try “arrival” or “drama”.</template>
      </p>
    </div>

    <ul v-if="results.length" class="grid" :aria-busy="loading">
      <li v-for="movie in results" :key="movie.tmdbId">
        <MovieCard :movie="movie">
          <StatusToggle :movie="movie" compact />
        </MovieCard>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.search { max-width: 36rem; margin-bottom: 1rem; }
.search__input { font-size: 1.125rem; padding: 0.875rem 1.125rem; }
.search__status { min-height: 1.75rem; margin-bottom: 1.5rem; }
</style>
