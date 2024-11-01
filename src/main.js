import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import { library } from "@fortawesome/fontawesome-svg-core";

// Import icons from the libraries you installed
import {
  faScrewdriverWrench,
  faRotateRight,
  faClock,
  faFont,
  faQuoteLeft,
  faStar,
  faHashtag,
  faArrowDown19,
} from "@fortawesome/free-solid-svg-icons";

// Add icons to the library
library.add(
  faScrewdriverWrench,
  faRotateRight,
  faClock,
  faFont,
  faQuoteLeft,
  faStar,
  faHashtag,
  faArrowDown19
);
const pinia = createPinia();
const app = createApp(App);
app.use(pinia).use(router).mount("#app");
