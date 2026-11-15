// DTOs shared between the API layer, stores and components.
// Once the server exists, these can move to /shared as zod schemas.

export type LibraryStatus = 'watchlist' | 'watched'

export interface MovieSummary {
  tmdbId: number
  title: string
  year: number | null
  posterPath: string | null
  overview: string
  genres: string[]
}

export interface MovieDetails extends MovieSummary {
  runtime: number | null
  director: string | null
  cast: string[]
  tagline: string | null
}

export interface LibraryEntry {
  tmdbId: number
  status: LibraryStatus
  rating: number | null // 1–5, null = unrated
  notes: string
  watchedAt: string | null // ISO date
  updatedAt: string // ISO date
  movie: MovieSummary // cached on the server so the library needs no TMDB calls
}

export interface LibraryEntryInput {
  status: LibraryStatus
  rating?: number | null
  notes?: string
  watchedAt?: string | null
}

export interface Recommendation {
  movie: MovieSummary
  reason: string
}

export interface RecommendationBatch {
  id: string
  createdAt: string
  items: Recommendation[]
}

export interface RecommendationRequest {
  mood?: string
  count?: number
}

export interface Paginated<T> {
  results: T[]
  page: number
  totalPages: number
}
