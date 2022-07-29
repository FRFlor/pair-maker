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
  <section class="grid gap-3">
    <p v-show="errors.length > 0" id="errors" class="text-red-800 text-xl my-4">{{ errors }}</p>
    <form id="new-name-input-group" class="flex h-10 lg:h-14" @submit.prevent>
      <InputText id="new-name" v-model="newName" class="flex-1" type="text"/>
      <Button id="add-name"
              :disabled="newName.trim().length === 0"
              class="p-button-lg  text-xs md:w-36"
              type="submit"
              @click="saveNewName">
        Save Name
      </Button>
    </form>

    <div id="all-names-list">
      <h2>All Names</h2>
      <ul>
        <li v-for="name in names" :key="name" class="flex items-center justify-start h-14 text-green-700">
          <Button class="delete-name h-10 p-button-outlined p-button-danger"
                  @click="() => deleteName(name)">
            <i class="pi pi-trash"></i>
          </Button>
          <p class="ml-5 text-xl w-44 overflow-hidden whitespace-nowrap overflow-ellipsis flex-1">{{ name }}</p>
        </li>
      </ul>
    </div>

    <div id="pairs-list">
      <h2>Proposed Pairs</h2>

      <section class="md:w-80 flex justify-between">
        <Button id="see-proposed-pairings"
                class="delete-name h-10 p-button-secondary"
                @click="displayProposedPairings">
          <i class="pi pi-trash mr-2"></i>Propose pairs
        </Button>

        <Button id="save-proposed-pairing"
                class="delete-name h-10"
                @click="saveProposedPairings">
          <i class="pi pi-save mr-2"></i>Save pairs
        </Button>
      </section>

      <ul class="bg-white rounded-lg border border-green-200 md:w-96 text-gray-900 mt-4">
        <li v-if="proposedPairingList.length === 0"
            class="px-6 py-2 border-b border-green-200 bg-green-50 w-full rounded-t-lg"> No pairings yet!
        </li>
        <li v-for="proposedPairing in proposedPairingList"
            v-else
            :key="proposedPairing"
            :class="{'bg-orange-50 font-bold': proposedPairing.includes('TIMEOUT:')}"
            class="px-6 py-2 border-b border-green-200 bg-green-50 w-full rounded-t-lg">
          {{ proposedPairing }}
        </li>
      </ul>
    </div>

    <div id="manual-pairing">
      <AddToPairingHistory/>
    </div>

    <div id="pairing-history" class="hidden lg:block">
      <h2>Pairing History</h2>
      <ul>
        <li v-for="pairingHistoryEntry in pairingHistoryList" :key="pairingHistoryEntry">{{ pairingHistoryEntry }}</li>
      </ul>
    </div>

  </section>
</template>

<style scoped>

section {
  grid-template-areas: "input" "errors" "names" "pairs" "manual" "history"
}


@screen lg {
  section {
    grid-template-columns: 0.5fr 0.5fr 1fr;
    grid-template-areas:
        "input input input"
        "errors errors errors"
        "pairs pairs manual"
        "names names manual"
        "names names history"
        "names names history"
  }
}

#errors {
  grid-area: errors;
}

#new-name-input-group {
  grid-area: input;
}

#all-names-list {
  grid-area: names
}

#pairs-list {
  grid-area: pairs
}

#manual-pairing {
  grid-area: manual;
}

#pairing-history {
  grid-area: history;
}
</style>
