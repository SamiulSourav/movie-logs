<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import RecCard from '@/components/RecCard.vue'
import { useRecommendationsStore } from '@/stores/recommendations'

const recs = useRecommendationsStore()
const mood = ref('')

onMounted(() => recs.loadLatest())

const generatedAt = computed(() =>
  recs.batch ? new Date(recs.batch.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : null,
)

function submit() {
  recs.generate({ mood: mood.value.trim() || undefined, count: 6 })
}
</script>

<template>
  <section>
    <h1 class="page-title">What to watch next</h1>
    <p class="page-lede">
      Suggestions come from the movies you’ve rated, including the ones you didn’t like. Add a mood to steer them.
    </p>

    <p v-if="!recs.canGenerate" class="notice gate">
      Rate {{ recs.ratingsNeeded }} more {{ recs.ratingsNeeded === 1 ? 'movie' : 'movies' }} to get suggestions.
      <RouterLink :to="{ name: 'library', query: { tab: 'watched' } }">Go to your watched list</RouterLink>
    </p>

    <form class="ask" @submit.prevent="submit">
      <label for="mood" class="visually-hidden">Mood (optional)</label>
      <input
        id="mood"
        v-model="mood"
        class="field"
        type="text"
        maxlength="120"
        placeholder="Optional: something light, under two hours"
        :disabled="!recs.canGenerate"
      />
      <button type="submit" class="btn btn--primary ask__button" :disabled="!recs.canGenerate || recs.generating">
        {{ recs.generating ? 'Finding movies…' : recs.batch ? 'Get new suggestions' : 'Get suggestions' }}
      </button>
    </form>

    <p v-if="recs.error" class="notice notice--error" role="alert">{{ recs.error }}</p>

    <template v-if="recs.batch">
      <p v-if="!recs.visibleItems.length" class="notice">
        You’ve watched everything in this batch. Get new suggestions for more.
      </p>
      <ol v-else class="recs" :aria-busy="recs.generating">
        <li v-for="item in recs.visibleItems" :key="item.movie.tmdbId">
          <RecCard :item="item" />
        </li>
      </ol>
      <p class="stamp">Suggested {{ generatedAt }}</p>
    </template>
  </section>
</template>

<style scoped>
.gate { margin-bottom: 1.25rem; }
.ask { display: flex; flex-wrap: wrap; gap: 0.75rem; max-width: 40rem; margin-bottom: 2.5rem; }
.ask .field { flex: 1 1 16rem; }
.ask__button { padding: 0.75rem 1.25rem; font-size: 0.9375rem; }
.recs { list-style: none; margin: 0; padding: 0; display: grid; gap: 2.25rem; }
.stamp { margin-top: 2.5rem; color: var(--muted); font-size: 0.8125rem; }
</style>
