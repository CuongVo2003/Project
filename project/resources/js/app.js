import "./bootstrap";
import "../css/app.css";
import { createApp } from "vue";
import App from "./app.vue";
import router from "./router";

createApp(App).use(router).mount("#app");
