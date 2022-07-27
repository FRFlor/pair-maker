import {createApp} from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import "primevue/resources/primevue.min.css" //core css
import "primeicons/primeicons.css" //icons
import "primevue/resources/themes/saga-orange/theme.css"; //theme
import SelectButton from 'primevue/selectbutton';
import ToggleButton from "primevue/togglebutton";

const app = createApp(App);

app.use(PrimeVue);

app.component('ToggleButton', ToggleButton);
app.component('SelectButton', SelectButton);


app.mount('#app');
