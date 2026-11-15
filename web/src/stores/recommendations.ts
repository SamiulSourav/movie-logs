import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { generateRecommendations, getLatestRecommendations } from '@/api/recommendations'
import type { RecommendationBatch, RecommendationRequest } from '@/types'
import { messageOf } from '@/utils/errors'
import { useLibraryStore } from './library'

// The recommender needs some taste signal before suggestions are useful.
export const MIN_RATINGS = 3

export const useRecommendationsStore = defineStore('recommendations', () => {
  const library = useLibraryStore()

  const batch = ref<RecommendationBatch | null>(null)
  const generating = ref(false)
  const error = ref<string | null>(null)
  const latestLoaded = ref(false)

  const canGenerate = computed(() => library.ratedCount >= MIN_RATINGS)
  const ratingsNeeded = computed(() => Math.max(0, MIN_RATINGS - library.ratedCount))

  // Hide suggestions the user has since marked as watched.
  const visibleItems = computed(
    () => batch.value?.items.filter((i) => library.entryFor(i.movie.tmdbId)?.status !== 'watched') ?? [],
  )

  async function loadLatest() {
    if (latestLoaded.value) return
    try {
      batch.value = await getLatestRecommendations()
    } catch (err) {
      error.value = messageOf(err)
    } finally {
      latestLoaded.value = true
    }
  }

  async function generate(input: RecommendationRequest = {}) {
    if (!canGenerate.value || generating.value) return
    generating.value = true
    error.value = null
    try {
      batch.value = await generateRecommendations(input)
    } catch (err) {
      error.value = `Couldn’t get suggestions. ${messageOf(err)}`
    } finally {
      generating.value = false
    }
  }

  return { batch, generating, error, canGenerate, ratingsNeeded, visibleItems, loadLatest, generate }
})
