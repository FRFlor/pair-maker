import {ref} from "vue";

export default function usePairMaking() {
    const currentNamesInLocalStorage = JSON.parse(localStorage.getItem("names") ?? "[]");
    const names = ref<string[]>(currentNamesInLocalStorage);

    function addNewNameToList(newName: string) {
        names.value.push(newName);
        localStorage.setItem("names", JSON.stringify(names.value))
    }

    return {
        names,
        addNewNameToList
    }
}
