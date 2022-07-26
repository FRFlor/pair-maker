import {createApp} from "vue"
import App from "./App.vue"
import PrimeVue from "primevue/config";
import "@/assets/tailwind.css"
import "primevue/resources/primevue.min.css" //core css
import "primeicons/primeicons.css" //icons
import "primevue/resources/themes/saga-green/theme.css";
import ToggleButton from "primevue/togglebutton";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Fieldset from "primevue/fieldset";

const app = createApp(App);

app.use(PrimeVue);

app.component("ToggleButton", ToggleButton);
app.component("Dropdown", Dropdown);
app.component("Button", Button);
app.component("InputText", InputText);
app.component("Fieldset", Fieldset);


app.mount("#app");
