<script setup lang="ts">
// Host pages sit on the blueprint grid; a project page keeps its own plain colour.
const route = useRoute()
</script>

<template>
  <div id="top" :class="route.params.slug ? '' : 'blueprint'">
    <SiteHeader />
    <main id="contenu">
      <slot />
    </main>
    <SiteFooter />
    <SiteTerminal />
  </div>
</template>
