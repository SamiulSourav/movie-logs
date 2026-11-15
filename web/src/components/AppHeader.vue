<script setup lang="ts">
import { useLibraryStore } from '@/stores/library'

const library = useLibraryStore()
</script>

<template>
  <header class="header">
    <RouterLink to="/search" class="brand">Movie Logs</RouterLink>
    <nav aria-label="Main">
      <ul class="nav">
        <li><RouterLink to="/search">Search</RouterLink></li>
        <li>
          <RouterLink to="/library">
            Library<span v-if="library.watchlist.length" class="count">{{ library.watchlist.length }}</span>
          </RouterLink>
        </li>
        <li><RouterLink to="/discover">Discover</RouterLink></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.header {
  max-width: 72rem; margin: 0 auto; padding: 1.25rem;
  display: flex; flex-wrap: wrap; gap: 0.75rem 2rem; align-items: baseline; justify-content: space-between;
}
.brand { font-family: var(--font-display); font-weight: 700; font-size: 1.375rem; letter-spacing: -0.02em; text-decoration: none; }
.nav { list-style: none; margin: 0; padding: 0; display: flex; gap: 1.5rem; }
.nav a { text-decoration: none; font-weight: 500; padding-bottom: 0.25rem; border-bottom: 3px solid transparent; }
.nav a:hover { border-bottom-color: var(--line); }
.nav a.router-link-active { border-bottom-color: var(--marquee); }
.count {
  display: inline-block; margin-left: 0.375rem; min-width: 1.375rem; padding: 0 0.375rem;
  font-size: 0.75rem; font-weight: 600; text-align: center; line-height: 1.375rem;
  background: var(--ink); color: var(--screen); border-radius: var(--radius-pill);
}
</style>
