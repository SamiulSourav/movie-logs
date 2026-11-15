import type { LibraryEntry, LibraryEntryInput, LibraryStatus } from '@/types'
import { request, USE_MOCKS } from './client'
import { mockApi } from './mock'

export function listLibrary(status?: LibraryStatus) {
  if (USE_MOCKS) return mockApi.listLibrary(status)
  return request<LibraryEntry[]>('/library', { query: { status } })
}

// PUT is an upsert: add, change status, rate and edit notes all use it.
export function upsertLibraryEntry(tmdbId: number, input: LibraryEntryInput) {
  if (USE_MOCKS) return mockApi.upsertLibraryEntry(tmdbId, input)
  return request<LibraryEntry>(`/library/${tmdbId}`, { method: 'PUT', body: input })
}

export function removeLibraryEntry(tmdbId: number) {
  if (USE_MOCKS) return mockApi.removeLibraryEntry(tmdbId)
  return request<void>(`/library/${tmdbId}`, { method: 'DELETE' })
}
