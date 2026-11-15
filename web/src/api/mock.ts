// In-memory stand-in for the server so the UI runs before the backend exists.
// Toggle with VITE_USE_MOCKS in .env. Delete this file once the server is live.

import type {
  LibraryEntry,
  LibraryEntryInput,
  LibraryStatus,
  MovieDetails,
  MovieSummary,
  Paginated,
  RecommendationBatch,
  RecommendationRequest,
} from '@/types'
import { toSummary } from '@/utils/tmdb'
import { ApiError } from './client'

const catalog: MovieDetails[] = [
  { tmdbId: 329865, title: 'Arrival', year: 2016, genres: ['Science Fiction', 'Drama'], runtime: 116, director: 'Denis Villeneuve', cast: ['Amy Adams', 'Jeremy Renner', 'Forest Whitaker'], tagline: null, posterPath: '/pEzNVQfdzYDzVK0XqxERIw2x2se.jpg', overview: 'A linguist is brought in to work out how to talk with the visitors whose ships have appeared around the world.' },
  { tmdbId: 157336, title: 'Interstellar', year: 2014, genres: ['Science Fiction', 'Adventure', 'Drama'], runtime: 169, director: 'Christopher Nolan', cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'], tagline: null, posterPath: '/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg', overview: 'With Earth failing, a former pilot leads a crew through a wormhole to look for a new home.' },
  { tmdbId: 496243, title: 'Parasite', year: 2019, genres: ['Thriller', 'Drama', 'Comedy'], runtime: 133, director: 'Bong Joon-ho', cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'], tagline: null, posterPath: '/ubJTRnXZY47tz2qZtFrd1enHKs.jpg', overview: 'A struggling family talks its way into jobs with a wealthy household, until a secret below the house surfaces.' },
  { tmdbId: 120467, title: 'The Grand Budapest Hotel', year: 2014, genres: ['Comedy', 'Drama'], runtime: 100, director: 'Wes Anderson', cast: ['Ralph Fiennes', 'Tony Revolori', 'Saoirse Ronan'], tagline: null, posterPath: '/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg', overview: 'A legendary concierge and his lobby boy get caught up in a fight over a priceless painting.' },
  { tmdbId: 152601, title: 'Her', year: 2013, genres: ['Romance', 'Science Fiction', 'Drama'], runtime: 126, director: 'Spike Jonze', cast: ['Joaquin Phoenix', 'Scarlett Johansson', 'Amy Adams'], tagline: null, posterPath: '/eCOtqtfvn7mxGl6nfmq4b1exJRc.jpg', overview: 'A lonely writer forms an unexpected bond with his computer’s operating system.' },
  { tmdbId: 76341, title: 'Mad Max: Fury Road', year: 2015, genres: ['Action', 'Adventure', 'Science Fiction'], runtime: 120, director: 'George Miller', cast: ['Tom Hardy', 'Charlize Theron', 'Nicholas Hoult'], tagline: null, posterPath: '/ulcAi4dKpAjHwYGS08vNyx9H6I9.jpg', overview: 'In a desert wasteland, a rebel driver and a drifter flee a warlord across the sand.' },
  { tmdbId: 129, title: 'Spirited Away', year: 2001, genres: ['Animation', 'Fantasy', 'Family'], runtime: 125, director: 'Hayao Miyazaki', cast: ['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki'], tagline: null, posterPath: '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', overview: 'A girl working in a bathhouse for spirits tries to free her parents and find her way home.' },
  { tmdbId: 244786, title: 'Whiplash', year: 2014, genres: ['Drama', 'Music'], runtime: 107, director: 'Damien Chazelle', cast: ['Miles Teller', 'J.K. Simmons', 'Melissa Benoist'], tagline: null, posterPath: '/7fn624j5lj3xTme2SgiLCeuedmO.jpg', overview: 'A young drummer at an elite conservatory is pushed to the edge by a ruthless instructor.' },
  { tmdbId: 335984, title: 'Blade Runner 2049', year: 2017, genres: ['Science Fiction', 'Drama', 'Mystery'], runtime: 164, director: 'Denis Villeneuve', cast: ['Ryan Gosling', 'Harrison Ford', 'Ana de Armas'], tagline: null, posterPath: '/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg', overview: 'A replicant hunter uncovers a buried secret that sends him looking for a long-missing blade runner.' },
  { tmdbId: 419430, title: 'Get Out', year: 2017, genres: ['Horror', 'Mystery', 'Thriller'], runtime: 104, director: 'Jordan Peele', cast: ['Daniel Kaluuya', 'Allison Williams', 'Catherine Keener'], tagline: null, posterPath: '/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg', overview: 'A weekend visit to his girlfriend’s family estate turns into something far more sinister.' },
  { tmdbId: 376867, title: 'Moonlight', year: 2016, genres: ['Drama'], runtime: 111, director: 'Barry Jenkins', cast: ['Trevante Rhodes', 'Mahershala Ali', 'Naomie Harris'], tagline: null, posterPath: '/qLnfEmPrDjJfPyyddLJPkXmshkp.jpg', overview: 'Three chapters in the life of a young man growing up in Miami.' },
  { tmdbId: 545611, title: 'Everything Everywhere All at Once', year: 2022, genres: ['Action', 'Comedy', 'Science Fiction'], runtime: 140, director: 'Daniels', cast: ['Michelle Yeoh', 'Ke Huy Quan', 'Stephanie Hsu'], tagline: null, posterPath: '/u68AjlvlutfEIcpmbYpKcdi09ut.jpg', overview: 'A laundromat owner discovers she must connect with other versions of herself to save the multiverse.' },
  { tmdbId: 264660, title: 'Ex Machina', year: 2015, genres: ['Science Fiction', 'Thriller', 'Drama'], runtime: 108, director: 'Alex Garland', cast: ['Domhnall Gleeson', 'Alicia Vikander', 'Oscar Isaac'], tagline: null, posterPath: '/dmJW8IAKHKxFNiUnoDR7JfsK7Rp.jpg', overview: 'A programmer is invited to judge whether a humanoid robot is truly conscious.' },
  { tmdbId: 546554, title: 'Knives Out', year: 2019, genres: ['Mystery', 'Comedy', 'Crime'], runtime: 130, director: 'Rian Johnson', cast: ['Daniel Craig', 'Ana de Armas', 'Chris Evans'], tagline: null, posterPath: '/pThyQovXQrw2m0s9x82twj48Jq4.jpg', overview: 'A detective investigates the death of a wealthy crime novelist and his very suspicious family.' },
]

const library = new Map<number, LibraryEntry>()
let latest: RecommendationBatch | null = null

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

function findMovie(tmdbId: number): MovieDetails {
  const movie = catalog.find((m) => m.tmdbId === tmdbId)
  if (!movie) throw new ApiError(404, 'That movie couldn’t be found.')
  return movie
}

export const mockApi = {
  async searchMovies(q: string, page = 1): Promise<Paginated<MovieSummary>> {
    await delay()
    const term = q.trim().toLowerCase()
    const results = catalog
      .filter((m) => m.title.toLowerCase().includes(term) || m.genres.some((g) => g.toLowerCase().includes(term)))
      .map(toSummary)
    return { results, page, totalPages: 1 }
  },

  async getMovie(tmdbId: number): Promise<MovieDetails> {
    await delay()
    return findMovie(tmdbId)
  },

  async listLibrary(status?: LibraryStatus): Promise<LibraryEntry[]> {
    await delay()
    return [...library.values()].filter((e) => !status || e.status === status)
  },

  async upsertLibraryEntry(tmdbId: number, input: LibraryEntryInput): Promise<LibraryEntry> {
    await delay()
    const prev = library.get(tmdbId)
    const entry: LibraryEntry = {
      tmdbId,
      status: input.status,
      rating: input.rating !== undefined ? input.rating : (prev?.rating ?? null),
      notes: input.notes ?? prev?.notes ?? '',
      watchedAt: input.watchedAt !== undefined ? input.watchedAt : (prev?.watchedAt ?? null),
      updatedAt: new Date().toISOString(),
      movie: toSummary(findMovie(tmdbId)),
    }
    library.set(tmdbId, entry)
    return entry
  },

  async removeLibraryEntry(tmdbId: number): Promise<void> {
    await delay()
    library.delete(tmdbId)
  },

  // Fakes the LLM step: scores unseen movies by genre overlap with highly rated ones.
  async generateRecommendations(input: RecommendationRequest): Promise<RecommendationBatch> {
    await delay(900)
    const liked = [...library.values()].filter((e) => (e.rating ?? 0) >= 4)
    const likedGenres = new Set(liked.flatMap((e) => e.movie.genres))

    const items = catalog
      .filter((m) => !library.has(m.tmdbId))
      .map((m) => ({ movie: m, shared: m.genres.filter((g) => likedGenres.has(g)) }))
      .sort((a, b) => b.shared.length - a.shared.length)
      .slice(0, input.count ?? 5)
      .map(({ movie, shared }) => {
        const anchor = liked.find((e) => e.movie.genres.some((g) => shared.includes(g)))
        const reason =
          shared.length && anchor
            ? `Leans into the ${shared.slice(0, 2).join(' and ').toLowerCase()} you liked in ${anchor.movie.title}.`
            : 'A change of pace from what you usually rate highly.'
        return { movie: toSummary(movie), reason: input.mood ? `${reason} Fits “${input.mood}”.` : reason }
      })

    latest = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), items }
    return latest
  },

  async latestRecommendations(): Promise<RecommendationBatch | null> {
    await delay()
    return latest
  },
}
