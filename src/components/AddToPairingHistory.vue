<script lang="ts" setup>
import useStoreNames from "@/composables/useStoreNames";
import {computed, ref} from "vue";
import {useMakePairs} from "@/composables/useMakePairs";

const {names} = useStoreNames();
const {savePairing} = useMakePairs(names);

const leftHandSide = ref(names.value[0] ?? "");

const rightHandSide = ref<{ [name: string]: boolean }>(
    names.value.reduce((final, name) => ({...final, [name]: false}), {})
);

const leftHandSideOptions = names.value;
const rightHandSideOptions = computed(() => names.value.filter(name => name !== leftHandSide.value));

function saveToPairingHistory() {
  const namesToPair = Object.keys(rightHandSide.value).filter(name => rightHandSide.value[name]);
  namesToPair.forEach(name => savePairing({[leftHandSide.value]: name}))
}
</script>

<template>
  <h2>Add to pairing history</h2>
  <select v-model="leftHandSide" name="right-hand-side">
    <option v-for="name in leftHandSideOptions" :key="`right-hand-side-${name}`" :value="name">{{ name }}</option>
  </select>

  <ul>
    <li v-for="name in rightHandSideOptions"
        :key="`right-hand-side-2-${name}`">
      <ToggleButton v-model="rightHandSide[name]"
                    :offLabel="name"
                    :onLabel="name"
                    :toggle-name="name"
                    offIcon="pi pi-times"
                    onIcon="pi pi-check"
                    style="width: 10em"/>
    </li>
  </ul>


  <button id="save-to-pairing-history" @click="saveToPairingHistory">Save</button>
</template>


<style scoped>
ul {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0;
}

li {
  list-style: none;
}
</style>
