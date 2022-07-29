<template>
  <main class="my-6 mx-4 md:mx-10 xl:mx-auto max-w-7xl">
    <h1>Bonello Rodello</h1>
    <PairMaker/>
  </main>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import PairMaker from "./components/PairMaker.vue";

export default defineComponent({
  name: "App",
  components: {
    PairMaker
  }
});
</script>
