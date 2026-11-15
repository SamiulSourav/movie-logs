<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import PosterImage from '@/components/PosterImage.vue'
import RatingStars from '@/components/RatingStars.vue'
import StatusToggle from '@/components/StatusToggle.vue'
import { getMovie } from '@/api/movies'
import { useLibraryStore } from '@/stores/library'
import type { MovieDetails } from '@/types'
import { isAbort, messageOf } from '@/utils/errors'
import { formatRuntime, toSummary } from '@/utils/tmdb'

const props = defineProps<{ id: string }>()
const library = useLibraryStore()

const movie = ref<MovieDetails | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

let controller: AbortController | null = null
async function load(id: number) {
  controller?.abort()
  const current = new AbortController()
  controller = current
  loading.value = true
  error.value = null
  try {
    movie.value = await getMovie(id, current.signal)
  } catch (err) {
    if (!isAbort(err)) error.value = messageOf(err)
  } finally {
    if (controller === current) loading.value = false
  }
}
watch(() => props.id, (id) => load(Number(id)), { immediate: true })

const summary = computed(() => (movie.value ? toSummary(movie.value) : null))
const entry = computed(() => (movie.value ? library.entryFor(movie.value.tmdbId) : null))
const runtime = computed(() => formatRuntime(movie.value?.runtime ?? null))

const notes = ref('')
const notesEdited = ref(false) // typed since the last load or successful save
const notesSaving = ref(false)
const notesSaved = ref(false)
const notesDirty = computed(() => !!entry.value && notes.value !== entry.value.notes)

// Load the saved notes into the box, but never overwrite text the user hasn't saved yet
// (a failed save rolls the store back to the old notes).
watch(
  [() => movie.value?.tmdbId, () => entry.value?.notes ?? ''],
  ([id, saved], [prevId]) => {
    if (id !== prevId) {
      notesEdited.value = false
      notesSaved.value = false
    }
    if (!notesEdited.value) notes.value = saved
  },
  { immediate: true },
)

function onNotesInput() {
  notesEdited.value = true
  notesSaved.value = false
}

async function saveNotes() {
  if (!summary.value || !notesDirty.value || notesSaving.value) return
  const draft = notes.value
  notesSaving.value = true
  const saved = await library.saveNotes(summary.value, draft)
  notesSaving.value = false
  // On failure the store shows an error toast and the draft stays in the box.
  if (saved && notes.value === draft) {
    notesEdited.value = false
    notesSaved.value = true
  }
}

const saveShortcut = /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘+Enter' : 'Ctrl+Enter'
const notesStatus = computed(() => {
  if (notesDirty.value) return `Unsaved changes. Press ${saveShortcut} to save.`
  return notesSaved.value ? 'Saved' : ''
})

function confirmDiscard() {
  return !notesDirty.value || window.confirm('You have unsaved notes. Leave without saving them?')
}
onBeforeRouteLeave(confirmDiscard)
onBeforeRouteUpdate(confirmDiscard)

function warnOnUnload(event: BeforeUnloadEvent) {
  if (notesDirty.value) event.preventDefault()
}
onMounted(() => window.addEventListener('beforeunload', warnOnUnload))
onBeforeUnmount(() => window.removeEventListener('beforeunload', warnOnUnload))
</script>

<template>
  <p v-if="loading && !movie" class="notice">Loading…</p>

  <div v-else-if="error" class="notice notice--error">
    <p>{{ error }}</p>
    <RouterLink to="/search">Back to search</RouterLink>
  </div>

  <article v-else-if="movie && summary" class="movie">
    <div class="movie__poster">
      <PosterImage :path="movie.posterPath" :title="movie.title" size="w500" />
    </div>

    <div class="movie__body">
      <h1 class="movie__title">{{ movie.title }}</h1>
      <p class="movie__facts">
        <span v-if="movie.year">{{ movie.year }}</span>
        <span v-if="runtime">{{ runtime }}</span>
        <span v-if="movie.director">Directed by {{ movie.director }}</span>
      </p>
      <p v-if="movie.tagline" class="movie__tagline">{{ movie.tagline }}</p>
      <p class="movie__overview">{{ movie.overview }}</p>

      <dl class="movie__meta">
        <template v-if="movie.genres.length">
          <dt>Genres</dt>
          <dd>{{ movie.genres.join(', ') }}</dd>
        </template>
        <template v-if="movie.cast.length">
          <dt>Starring</dt>
          <dd>{{ movie.cast.slice(0, 5).join(', ') }}</dd>
        </template>
      </dl>

      <section class="movie__yours" aria-labelledby="yours-heading">
        <h2 id="yours-heading" class="movie__yours-title">Your take</h2>

        <StatusToggle :movie="summary" />

        <div class="movie__rating">
          <span id="rating-label">{{ entry?.status === 'watched' ? 'Your rating' : 'Rate it to mark as watched' }}</span>
          <RatingStars
            label="Your rating"
            :model-value="entry?.rating ?? null"
            @update:model-value="(value) => library.rate(summary!, value)"
          />
        </div>

        <div v-if="entry" class="movie__notes">
          <label for="notes">Notes</label>
          <textarea
            id="notes"
            v-model="notes"
            class="field"
            rows="3"
            maxlength="2000"
            placeholder="What stuck with you? Who recommended it?"
            aria-describedby="notes-status"
            @input="onNotesInput"
            @keydown.ctrl.enter.prevent="saveNotes"
            @keydown.meta.enter.prevent="saveNotes"
          />
          <div class="movie__notes-actions">
            <button type="button" class="btn btn--primary" :disabled="!notesDirty || notesSaving" @click="saveNotes">
              {{ notesSaving ? 'Saving…' : 'Save notes' }}
            </button>
            <p id="notes-status" class="movie__notes-status" aria-live="polite">{{ notesStatus }}</p>
          </div>
        </div>
      </section>
    </div>
  </article>
</template>

<style scoped>
.movie { display: grid; grid-template-columns: minmax(12rem, 20rem) 1fr; gap: 2.5rem 3rem; align-items: start; }
.movie__poster { position: sticky; top: 1.5rem; }
.movie__body { display: grid; gap: 1.25rem; max-width: 40rem; }
.movie__title { font-size: clamp(2.5rem, 7vw, 4.75rem); letter-spacing: -0.035em; line-height: 0.95; }
.movie__facts { display: flex; flex-wrap: wrap; gap: 0.25rem 1.25rem; color: var(--muted); }
.movie__tagline { font-style: italic; }
.movie__overview { font-size: 1.125rem; }
.movie__meta { display: grid; grid-template-columns: max-content 1fr; gap: 0.375rem 1.25rem; margin: 0; }
.movie__meta dt { color: var(--muted); }
.movie__meta dd { margin: 0; }
.movie__yours { display: grid; gap: 1.25rem; margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid var(--line); }
.movie__yours-title { font-size: 1.5rem; letter-spacing: -0.015em; }
.movie__rating { display: flex; flex-wrap: wrap; gap: 0.75rem 1.25rem; align-items: center; }
.movie__notes { display: grid; gap: 0.5rem; }
.movie__notes label { font-weight: 600; }
.movie__notes textarea { resize: vertical; }
.movie__notes-actions { display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; align-items: center; }
.movie__notes-status { font-size: 0.8125rem; color: var(--muted); }

@media (max-width: 44rem) {
  .movie { grid-template-columns: 1fr; }
  .movie__poster { position: static; max-width: 13rem; }
}
</style>
