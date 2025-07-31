import { createMemoryHistory, createRouter } from "vue-router";

import HomeView from "../components/HomeView.vue";
import RiskBoard from "../components/RiskBoard.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/detail", component: RiskBoard, name: "RiskBoard" },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
