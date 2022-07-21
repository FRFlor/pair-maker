<script lang="ts" setup>
import usePairMaking from "@/composables/usePairMaking";
import {ref} from "vue";

const {names, addNewNameToList, deleteName} = usePairMaking();
const newName = ref<string>("");

function saveNewName() {
  addNewNameToList(newName.value);
  newName.value = "";
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
      <h2>Pairs</h2>
      <li>blabla</li>
      <li>blabla</li>
      <li>blabla</li>
      <li>blabla</li>
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

</style>
