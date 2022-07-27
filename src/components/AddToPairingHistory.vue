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

  <Dropdown v-model="leftHandSide"
            :options="leftHandSideOptions"
            name="right-hand-side"
            placeholder="Select a City"
            style="width: 20rem;"/>

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


  <Button id="save-to-pairing-history"
          class="p-button-lg"
          @click="saveToPairingHistory"><i class="pi pi-save"/>Save
  </Button>

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
