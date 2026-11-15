import { onScopeDispose, ref, watch } from 'vue'
import { searchMovies } from '@/api/movies'
import type { MovieSummary } from '@/types'
import { isAbort, messageOf } from '@/utils/errors'

const MIN_LENGTH = 2

export function useDebouncedSearch(initial = '', delay = 300) {
  const query = ref(initial)
  const results = ref<MovieSummary[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searched = ref(false) // true once a search has completed for the current term

  let timer: ReturnType<typeof setTimeout> | undefined
  let controller: AbortController | null = null

  async function run(term: string) {
    controller?.abort()
    const current = new AbortController()
    controller = current
    loading.value = true
    error.value = null
    try {
      const page = await searchMovies(term, 1, current.signal)
      if (current.signal.aborted) return
      results.value = page.results
      searched.value = true
    } catch (err) {
      if (isAbort(err)) return
      error.value = messageOf(err)
    } finally {
      if (controller === current) loading.value = false
    }
  }

  watch(
    query,
    (value) => {
      clearTimeout(timer)
      const term = value.trim()
      if (term.length < MIN_LENGTH) {
        controller?.abort()
        results.value = []
        searched.value = false
        loading.value = false
        error.value = null
        return
      }
      timer = setTimeout(() => run(term), delay)
    },
    { immediate: true },
  )

  onScopeDispose(() => {
    clearTimeout(timer)
    controller?.abort()
  })

  return { query, results, loading, error, searched, minLength: MIN_LENGTH }
}
