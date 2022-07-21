import {ref} from "vue";

export default function usePairMaking() {
    const names = ref<string[]>([]);

    function addNewNameToList(newName: string) {
        names.value.push(newName);
    }

    return {
        names,
        addNewNameToList
    }
}
