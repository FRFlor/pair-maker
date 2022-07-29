import {Component, DefineComponent} from "vue";
import {mount} from "@vue/test-utils";
import PrimeVue from "primevue/config";
import ToggleButton from "primevue/togglebutton";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Fieldset from "primevue/fieldset";

export function mountComponentWithPrimeVue(component: Component) {
    return mount(component as DefineComponent, {
        global: {
            plugins: [PrimeVue],
            components: {ToggleButton, Dropdown, Button, InputText, Fieldset}
        }
    })
}
