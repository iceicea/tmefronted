import { createMemoryHistory, createRouter } from "vue-router";

import HomeView from "../components/HomeView.vue";
import RiskBoard from "../components/RiskBoard.vue";
import DataList from "../components/DataList.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/detail", component: RiskBoard, name: "RiskBoard" },
  { path: "/data-list", component: DataList, name: "DataList" },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
