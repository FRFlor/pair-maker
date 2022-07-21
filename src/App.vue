<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <PairMaker msg="Welcome to Your Vue.js + TypeScript App"/>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import PairMaker from './components/PairMaker.vue';

export default defineComponent({
  name: 'App',
  components: {
    PairMaker
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
