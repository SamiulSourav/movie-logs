<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { posterUrl, type PosterSize } from '@/utils/tmdb'

const props = withDefaults(defineProps<{ path: string | null; title: string; size?: PosterSize }>(), {
  size: 'w342',
})

const failed = ref(false)
watch(() => props.path, () => (failed.value = false))

const src = computed(() => (props.path && !failed.value ? posterUrl(props.path, props.size) : null))
</script>

<template>
  <!-- Decorative: the title is always shown as text next to the poster. -->
  <div class="poster">
    <img v-if="src" :src="src" alt="" loading="lazy" @error="failed = true" />
    <div v-else class="poster__fallback" aria-hidden="true">
      <span>{{ title }}</span>
    </div>
  </div>
</template>

<style scoped>
.poster { aspect-ratio: 2 / 3; border-radius: var(--radius-poster); overflow: hidden; background: var(--line); }
.poster img { width: 100%; height: 100%; object-fit: cover; }
/* No poster: render a title card, like an old film's opening frame. */
.poster__fallback {
  height: 100%; display: flex; align-items: flex-end; padding: 0.75rem;
  background: #1e2235; color: #e8b64c;
  font-family: var(--font-display); font-weight: 700; font-size: 1.125rem; line-height: 1.05; letter-spacing: -0.01em;
}
</style>
