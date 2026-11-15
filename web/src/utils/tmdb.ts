import type { MovieDetails, MovieSummary } from '@/types'

export type PosterSize = 'w185' | 'w342' | 'w500'

export function posterUrl(path: string, size: PosterSize = 'w342'): string {
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export function toSummary(movie: MovieDetails | MovieSummary): MovieSummary {
  const { tmdbId, title, year, posterPath, overview, genres } = movie
  return { tmdbId, title, year, posterPath, overview, genres }
}

export function formatRuntime(minutes: number | null): string | null {
  if (!minutes) return null
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h ? `${h}h ${m}m` : `${m}m`
}
