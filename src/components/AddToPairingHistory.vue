<script lang="ts" setup>
import useStoreNames from "@/composables/useStoreNames";
import {computed, ref, watch} from "vue";
import {useMakePairs} from "@/composables/useMakePairs";

const {names} = useStoreNames();
const {savePairing, pairingHistory} = useMakePairs(names);

const leftHandSide = ref(names.value[0] ?? "");

const rightHandSide = ref<{ [name: string]: boolean }>(getNewRightHandSideSelection());

function getNewRightHandSideSelection() {
  return names.value.reduce((final, name) => {
    const isPairing = name !== leftHandSide.value && pairingHistory.value[leftHandSide.value]?.includes(name)
    return {...final, [name]: isPairing}
  }, {})
}

watch([leftHandSide, pairingHistory], () => rightHandSide.value = getNewRightHandSideSelection())

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
            placeholder="Select a member"
            class="w-full"/>

  <ul class="my-6 grid grid-cols-2">
    <li v-for="name in rightHandSideOptions"
        :key="`right-hand-side-2-${name}`">
      <ToggleButton v-model="rightHandSide[name]"
                    :offLabel="name"
                    :onLabel="name"
                    :toggle-name="name"
                    offIcon="pi pi-times"
                    onIcon="pi pi-check"
                    class="w-full whitespace-nowrap"/>
    </li>
  </ul>


  <Button id="save-to-pairing-history"
          class="p-button-lg"
          @click="saveToPairingHistory"><i class="pi pi-save mr-2"/>
    Save Pair
  </Button>

</template>
