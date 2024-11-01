import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faRotateRight,
  faStar,
  faHashtag,
  faClock,
  faA,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";
const pinia = createPinia();
const app = createApp(App);

library.add(faRotateRight, faStar, faHashtag, faClock, faA, faQuoteLeft);
app.use(pinia).use(router).mount("#app");
