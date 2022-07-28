<template>
  <main class="flex flex-col items-center my-6">
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
