import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "@/styles/global.css";
import "./index.css";
import { library } from "@fortawesome/fontawesome-svg-core";

// Import icons from the libraries you installed
import {
  faScrewdriverWrench,
  faRotateRight,
  faFont,
  faQuoteLeft,
  faStar,
  faHashtag,
  faArrowDown19,
  faCaretDown,
  faLock,
  faClock,
  faDragon,
  faArrowsToCircle,
  faChevronLeft,
  faChevronRight,
  faCode,
  faEnvelope,
  faHouse,
  faPalette,
  faUserTie,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

// Add icons to the library
library.add(
  faScrewdriverWrench,
  faRotateRight,
  faClock,
  faDragon,
  faFont,
  faQuoteLeft,
  faStar,
  faUserTie,
  faGear,
  faCode,
  faPalette,
  faEnvelope,
  faHashtag,
  faArrowDown19,
  faHouse,
  faCaretDown,
  faLock,
  faArrowsToCircle,
  faChevronLeft,
  faChevronRight
);
const pinia = createPinia();
const app = createApp(App);
app.use(pinia).use(router).mount("#app");
