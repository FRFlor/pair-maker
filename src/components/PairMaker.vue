<script lang="ts" setup>
import usePairMaking from "@/composables/usePairMaking";

const {names} = usePairMaking();
</script>

<template>
  <section>
    <ul>
      <li v-for="name in names" :key="name">{{ name }}</li>
    </ul>
  </section>
</template>
