import {ref} from "vue";


export default function usePairMaking() {
    function loadNames() {
        return JSON.parse(localStorage.getItem("names") ?? "[]");
    }

    function saveNames() {
        localStorage.setItem("names", JSON.stringify(names.value))
    }

    const names = ref<string[]>(loadNames());

    function addNewNameToList(newName: string) {
        const sanitizedName = newName.trim();
        if (names.value.includes(sanitizedName)) {
            throw Error("Each name must be unique.");
        }

        names.value.push(sanitizedName);
        saveNames();
    }

    function deleteName(target: string) {
        names.value = names.value.filter(name => target !== name);
        saveNames();
    }

    return {
        names,
        addNewNameToList,
        deleteName
    }
}
