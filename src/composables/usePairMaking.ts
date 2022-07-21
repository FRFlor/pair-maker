import {ref} from "vue";

export default function usePairMaking() {
    const currentNamesInLocalStorage = JSON.parse(localStorage.getItem("names") ?? "[]");
    const names = ref<string[]>(currentNamesInLocalStorage);

    function addNewNameToList(newName: string) {
        const sanitizedName = newName.trim();
        if (names.value.includes(sanitizedName)) {
            throw Error("Each name must be unique.");
        }

        names.value.push(sanitizedName);
        localStorage.setItem("names", JSON.stringify(names.value))
    }

    return {
        names,
        addNewNameToList
    }
}
