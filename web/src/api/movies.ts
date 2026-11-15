import type { MovieDetails, MovieSummary, Paginated } from '@/types'
import { request, USE_MOCKS } from './client'
import { mockApi } from './mock'

export function searchMovies(q: string, page = 1, signal?: AbortSignal) {
  if (USE_MOCKS) return mockApi.searchMovies(q, page)
  return request<Paginated<MovieSummary>>('/movies/search', { query: { q, page }, signal })
}

export function getMovie(tmdbId: number, signal?: AbortSignal) {
  if (USE_MOCKS) return mockApi.getMovie(tmdbId)
  return request<MovieDetails>(`/movies/${tmdbId}`, { signal })
}
