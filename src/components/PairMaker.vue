<script lang="ts" setup>
import usePairMaking from "@/composables/usePairMaking";
import {ref} from "vue";

const {names, addNewNameToList} = usePairMaking();
const newName = ref<string>("");

function saveNewName() {
  addNewNameToList(newName.value);
  newName.value = "";
}

</script>

<template>
  <section>
    <ul>
      <li v-for="name in names" :key="name">{{ name }}</li>
    </ul>

    <fieldset>
      <input id="new-name" v-model="newName" type="text">
      <button id="add-name" @click="saveNewName">Save Name</button>
    </fieldset>
  </section>
</template>
