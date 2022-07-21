<script lang="ts" setup>
import usePairMaking from "@/composables/usePairMaking";
import {computed, ref} from "vue";
import {Pairing} from "@/types";

const {names, addNewNameToList, deleteName, proposePairing, savePairing} = usePairMaking();
const newName = ref<string>("");

const proposedPairings = ref<Pairing>({});
const proposedPairingList = computed<string[]>(() => {
  return Object.keys(proposedPairings.value)
      .map((rightHandSide: string) => {
        let leftHandSide = proposedPairings.value[rightHandSide];
        return leftHandSide === "Timeout" ? `TIMEOUT: ${rightHandSide}` : `${rightHandSide} and ${leftHandSide}`;
      });
})

function saveNewName() {
  addNewNameToList(newName.value);
  newName.value = "";
}

function displayProposedPairings() {
  proposedPairings.value = proposePairing();
}

function saveProposedPairings() {
  savePairing(proposedPairings.value);
  window.alert("Pairings saved!");
}

</script>

<template>
  <section>
    <form id="new-name-input-group" @submit.prevent>
      <input id="new-name" v-model="newName" type="text">
      <button id="add-name" :disabled="newName.trim().length === 0" @click="saveNewName">Save Name</button>
    </form>

    <ul id="all-names-list">
      <h2>All Names</h2>
      <li v-for="name in names" :key="name">
        <p>{{ name }}</p>
        <button class="delete-name" @click="() => deleteName(name)">X</button>
      </li>
    </ul>

    <ul id="pairs-list">
      <h2>Proposed Pairs</h2>
      <button id="see-proposed-pairings" @click="displayProposedPairings">Propose pairs</button>
      <button id="save-proposed-pairing" @click="saveProposedPairings">Save pairs</button>
      <li v-for="proposedPairing in proposedPairingList" :key="proposedPairing">{{ proposedPairing }}</li>
    </ul>
  </section>
</template>

<style scoped>
section {
  display: grid;
  grid-template-areas:
        "input input input"
        "names .     pairs"
        "names .     pairs"
        "names .     pairs"
}

#new-name-input-group {
  grid-area: input
}

#all-names-list {
  grid-area: names
}


#pairs-list {
  grid-area: pairs
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
