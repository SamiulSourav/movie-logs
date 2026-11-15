import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { listLibrary, removeLibraryEntry, upsertLibraryEntry } from '@/api/library'
import type { LibraryEntry, LibraryEntryInput, MovieSummary } from '@/types'
import { messageOf } from '@/utils/errors'
import { toSummary } from '@/utils/tmdb'

type LoadState = 'idle' | 'loading' | 'ready' | 'error'

const byRecent = (a: LibraryEntry, b: LibraryEntry) => b.updatedAt.localeCompare(a.updatedAt)
const byWatched = (a: LibraryEntry, b: LibraryEntry) =>
  (b.watchedAt ?? b.updatedAt).localeCompare(a.watchedAt ?? a.updatedAt)

export const useLibraryStore = defineStore('library', () => {
  const entries = ref<Record<number, LibraryEntry>>({})
  const loadState = ref<LoadState>('idle')
  const loadError = ref<string | null>(null)
  const actionError = ref<string | null>(null)

  const all = computed(() => Object.values(entries.value))
  const watchlist = computed(() => all.value.filter((e) => e.status === 'watchlist').sort(byRecent))
  const watched = computed(() => all.value.filter((e) => e.status === 'watched').sort(byWatched))
  const ratedCount = computed(() => all.value.filter((e) => e.rating !== null).length)

  function entryFor(tmdbId: number): LibraryEntry | null {
    return entries.value[tmdbId] ?? null
  }

  async function fetchAll() {
    if (loadState.value === 'loading') return
    loadState.value = 'loading'
    loadError.value = null
    try {
      const list = await listLibrary()
      entries.value = Object.fromEntries(list.map((e) => [e.tmdbId, e]))
      loadState.value = 'ready'
    } catch (err) {
      loadError.value = messageOf(err)
      loadState.value = 'error'
    }
  }

  // Optimistic upsert: update the UI now, reconcile with the server response, roll back on failure.
  async function save(movie: MovieSummary, input: LibraryEntryInput): Promise<LibraryEntry | null> {
    const prev = entries.value[movie.tmdbId]
    entries.value[movie.tmdbId] = {
      tmdbId: movie.tmdbId,
      status: input.status,
      rating: input.rating !== undefined ? input.rating : (prev?.rating ?? null),
      notes: input.notes ?? prev?.notes ?? '',
      watchedAt: input.watchedAt !== undefined ? input.watchedAt : (prev?.watchedAt ?? null),
      updatedAt: new Date().toISOString(),
      movie: toSummary(movie),
    }
    try {
      const saved = await upsertLibraryEntry(movie.tmdbId, input)
      entries.value[movie.tmdbId] = saved
      return saved
    } catch (err) {
      if (prev) entries.value[movie.tmdbId] = prev
      else delete entries.value[movie.tmdbId]
      actionError.value = `Couldn’t update ${movie.title}. ${messageOf(err)}`
      return null
    }
  }

  const now = () => new Date().toISOString()

  function addToWatchlist(movie: MovieSummary) {
    return save(movie, { status: 'watchlist' })
  }

  function markWatched(movie: MovieSummary) {
    return save(movie, { status: 'watched', watchedAt: entryFor(movie.tmdbId)?.watchedAt ?? now() })
  }

  // Rating a movie implies you've watched it.
  function rate(movie: MovieSummary, rating: number | null) {
    return save(movie, { status: 'watched', rating, watchedAt: entryFor(movie.tmdbId)?.watchedAt ?? now() })
  }

  function saveNotes(movie: MovieSummary, notes: string) {
    return save(movie, { status: entryFor(movie.tmdbId)?.status ?? 'watchlist', notes })
  }

  async function remove(tmdbId: number) {
    const prev = entries.value[tmdbId]
    if (!prev) return
    delete entries.value[tmdbId]
    try {
      await removeLibraryEntry(tmdbId)
    } catch (err) {
      entries.value[tmdbId] = prev
      actionError.value = `Couldn’t remove ${prev.movie.title}. ${messageOf(err)}`
    }
  }

  function dismissError() {
    actionError.value = null
  }

  return {
    entries, loadState, loadError, actionError,
    watchlist, watched, ratedCount,
    entryFor, fetchAll, addToWatchlist, markWatched, rate, saveNotes, remove, dismissError,
  }
})
