<script lang="ts"></script>

<template>
  <div class="base-tile">
    <slot></slot>
  </div>
</template>

<style scoped>
.base-tile {
  padding: 2rem;
  border: 1px solid var(--border-color);
  transition: 0.3s;
  text-align: center;
}
</style>
