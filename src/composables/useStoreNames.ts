import {ref} from "vue";

const names = ref<string[]>([]);

export default function useStoreNames() {
    names.value = loadNames();

    function loadNames() {
        return JSON.parse(localStorage.getItem("names") ?? "[]");
    }

    function saveNames() {
        localStorage.setItem("names", JSON.stringify(names.value))
    }

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
        deleteName,
    }
}
