<script lang="ts" setup>
import useStoreNames from "@/composables/useStoreNames";
import {computed, ref} from "vue";
import {useMakePairs} from "@/composables/useMakePairs";

const {names} = useStoreNames();
const {savePairing} = useMakePairs(names);

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

