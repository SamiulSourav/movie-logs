<script setup lang="ts">
import { computed, ref } from 'vue'

// Ratings render as marquee bulbs rather than stars.
const model = defineModel<number | null>({ default: null })

const props = withDefaults(
  defineProps<{ max?: number; readonly?: boolean; label?: string; size?: 'sm' | 'md' }>(),
  { max: 5, readonly: false, label: 'Your rating', size: 'md' },
)

const hovered = ref<number | null>(null)
const lit = computed(() => hovered.value ?? model.value ?? 0)

function choose(n: number) {
  model.value = model.value === n ? null : n // pick the same value again to clear
}

function onKey(event: KeyboardEvent, n: number) {
  let next = n
  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = Math.min(props.max, n + 1)
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = Math.max(1, n - 1)
  else return
  event.preventDefault()
  model.value = next
  const group = (event.currentTarget as HTMLElement).parentElement
  ;(group?.children[next - 1] as HTMLElement | undefined)?.focus()
}
</script>

<template>
  <div
    v-if="readonly"
    class="bulbs"
    :class="`bulbs--${size}`"
    role="img"
    :aria-label="model ? `Rated ${model} out of ${max}` : 'Not rated'"
  >
    <span v-for="n in max" :key="n" class="bulb" :class="{ 'bulb--on': n <= (model ?? 0) }" />
  </div>

  <div v-else class="bulbs" :class="`bulbs--${size}`" role="radiogroup" :aria-label="label" @mouseleave="hovered = null">
    <button
      v-for="n in max"
      :key="n"
      type="button"
      role="radio"
      class="bulb"
      :class="{ 'bulb--on': n <= lit }"
      :aria-checked="model === n"
      :aria-label="`${n} out of ${max}`"
      :tabindex="(model ?? 1) === n ? 0 : -1"
      @click="choose(n)"
      @mouseenter="hovered = n"
      @keydown="onKey($event, n)"
    />
  </div>
</template>

<style scoped>
.bulbs { display: inline-flex; gap: 0.375rem; align-items: center; }
.bulb {
  --size: 1.25rem;
  width: var(--size); height: var(--size); padding: 0; border-radius: 50%;
  border: 1.5px solid var(--muted); background: transparent;
  transition: background-color 120ms ease, box-shadow 200ms ease, border-color 120ms ease;
}
.bulbs--sm .bulb { --size: 0.875rem; }
button.bulb { cursor: pointer; }
.bulb--on {
  background: var(--marquee); border-color: var(--marquee);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--marquee) 28%, transparent), 0 0 12px color-mix(in srgb, var(--marquee) 55%, transparent);
}
button.bulb:focus-visible { outline-offset: 3px; border-radius: 50%; }
</style>
