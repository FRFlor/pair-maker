import {createApp} from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import "primevue/resources/primevue.min.css" //core css
import "primeicons/primeicons.css" //icons
import "primevue/resources/themes/saga-orange/theme.css"; //theme
import ToggleButton from "primevue/togglebutton";
import Dropdown from "primevue/dropdown";

const app = createApp(App);

app.use(PrimeVue);

app.component('ToggleButton', ToggleButton);
app.component('Dropdown', Dropdown);


app.mount('#app');
