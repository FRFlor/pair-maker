<script lang="ts" setup>
import usePairMaking from "@/composables/usePairMaking";
import {computed, ref} from "vue";

const {names, savePairing} = usePairMaking();

const leftHandSide = ref(names.value[0] ?? "");

const rightHandSide = ref(names.value[1] ?? "");

const leftHandSideOptions = computed(() => names.value.filter(name => name !== rightHandSide.value));
const rightHandSideOptions = computed(() => names.value.filter(name => name !== leftHandSide.value));

function saveAndRefresh() {
  savePairing({[leftHandSide.value]: rightHandSide.value});
}
</script>

<template>
  <h2>Add to pairing history</h2>
  <select v-model="leftHandSide" name="right-hand-side">
    <option v-for="name in leftHandSideOptions" :key="`right-hand-side-${name}`" :value="name">{{ name }}</option>
  </select>
  <select v-model="rightHandSide" name="left-hand-side">
    <option v-for="name in rightHandSideOptions" :key="`left-hand-side-${name}`" :value="name">{{ name }}</option>
  </select>
  <button @click="saveAndRefresh">Save</button>
</template>

