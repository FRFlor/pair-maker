<script lang="ts" setup>
import useStoreNames from "@/composables/useStoreNames";
import {computed, ref} from "vue";
import {Pairing} from "@/types";
import AddToPairingHistory from "@/components/AddToPairingHistory.vue";
import {useMakePairs} from "@/composables/useMakePairs";
import {TIMEOUT} from "@/constants";

const {names, addNewNameToList, deleteName} = useStoreNames();
const {pairingHistory, proposePairing, savePairing} = useMakePairs(names);
const newName = ref<string>("");
const errors = ref<string>("");

const proposedPairings = ref<Pairing>({});
const proposedPairingList = computed<string[]>(() => {
  return Object.keys(proposedPairings.value)
      .map((rightHandSide: string) => {
        let leftHandSide = proposedPairings.value[rightHandSide];
        return leftHandSide === TIMEOUT ? `TIMEOUT: ${rightHandSide}` : `${rightHandSide} and ${leftHandSide}`;
      });
})

const pairingHistoryList = computed<string[]>(() => {
  return Object.keys(pairingHistory.value)
      .map((name: string) => `${name}: `
          + JSON.stringify(pairingHistory.value[name]).replaceAll("\"", ""));
})

function saveNewName() {
  errors.value = "";
  try {
    addNewNameToList(newName.value);
    newName.value = "";
  } catch (e) {
    errors.value = (e as Error).message;
  }
}

function displayProposedPairings() {
  errors.value = "";
  try {
    proposedPairings.value = proposePairing();
  } catch (e) {
    proposedPairings.value = {};
    errors.value = (e as Error).message;
  }

}

function saveProposedPairings() {
  errors.value = "";
  savePairing(proposedPairings.value);
}

</script>

<template>
  <section>
    <p id="errors">{{ errors }}</p>
    <form id="new-name-input-group" @submit.prevent>
      <InputText id="new-name" v-model="newName" type="text"/>
      <button id="add-name" :disabled="newName.trim().length === 0" @click="saveNewName">Save Name</button>
    </form>

    <div id="all-names-list">
      <h2>All Names</h2>
      <ul>
        <li v-for="name in names" :key="name">
          <button class="delete-name" @click="() => deleteName(name)">X</button>
          <p>{{ name }}</p>
        </li>
      </ul>
    </div>

    <div id="pairs-list">
      <h2>Proposed Pairs</h2>
      <button id="see-proposed-pairings" @click="displayProposedPairings">Propose pairs</button>
      <button id="save-proposed-pairing" @click="saveProposedPairings">Save pairs</button>
      <ul>
        <li v-for="proposedPairing in proposedPairingList" :key="proposedPairing">{{ proposedPairing }}</li>
      </ul>
    </div>

    <div id="pairing-history">
      <h2>Pairing History</h2>
      <ul>
        <li v-for="pairingHistoryEntry in pairingHistoryList" :key="pairingHistoryEntry">{{ pairingHistoryEntry }}</li>
      </ul>
    </div>

    <div id="manual-pairing">
      <AddToPairingHistory/>
    </div>

  </section>
</template>

<style scoped>
section {
  display: grid;
  grid-gap: 3rem;
  grid-template-areas:
        "input input input"
        "errors errors errors"
        "names pairs history"
        "names pairs history"
        "names pairs history"
}

#errors {
  grid-area: errors;
  color: darkred;
  text-align: center;
  font-size: large;
}

#new-name-input-group {
  grid-area: input;
  display: flex;
}

#new-name-input-group input {
  flex: 1;
}

#all-names-list {
  grid-area: names
}


#pairs-list {
  grid-area: pairs
}

ul {
  list-style: none;
  padding: 0;
}

li {

  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
