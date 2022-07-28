<template>
  <main>
    <h1 class="bg-red-300">Bonello Rodello</h1>
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

<style>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
