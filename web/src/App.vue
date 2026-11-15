<script setup lang="ts">
import { onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import { USE_MOCKS } from '@/api/client'
import { useLibraryStore } from '@/stores/library'

const library = useLibraryStore()
onMounted(() => library.fetchAll())
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <AppHeader />
  <main id="main" class="main">
    <RouterView />
  </main>
  <footer class="footer">
    <p>Movie data from TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
    <p v-if="USE_MOCKS">Running on sample data. Set VITE_USE_MOCKS=false to use the server.</p>
  </footer>
  <div v-if="library.actionError" class="toast" role="alert">
    <span>{{ library.actionError }}</span>
    <button type="button" class="btn btn--quiet" @click="library.dismissError()">Dismiss</button>
  </div>
</template>
