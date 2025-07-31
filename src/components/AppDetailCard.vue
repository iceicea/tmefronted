<script setup lang="ts">
import { ref, computed } from "vue";
import OpinionChart from "./OpinionChart.vue";
import MonitoringMap from "./MonitoringMap.vue";
import PlatformVideoList from "./PlatformVideoList.vue";

interface Props {
  appName: string; // 全民K歌 / 酷狗 / QQ音乐 / 网易云
  stats: {
    total: number;
    volume: number;
    sentiment: number;
    warn1: number;
    warn2: number;
    opp1: number;
  };
  departments: { id: string; name: string }[]; // 右侧部门列表
}

const props = defineProps<Props>();

const logoMap: Record<string, string> = {
  网易云: "wyylogo.jpg",
  Q音: "qqyylogo.png",
  全民K歌: "qmkglogo.png",
  酷狗: "kglogo.png",
};
const logoSrc = computed(() => `/${logoMap[props.appName]}`);
console.log(props.appName, "000", props.stats);

const emit = defineEmits(["add"]);
const showVideo = ref(false);

const activeKeyword = ref("Q音");
const activePlatform = ref("抖音");
const detailVisible = ref(false);

const visibleMetrics = computed(() => [
  { label: "总数量", value: 0, key: "total" },
  { label: "声量", value: 0, key: "volume" },
  { label: "情感指数", value: 0, key: "sentiment" },
]);
const allMetrics = computed(() => [
  { label: "总数量", value: props.stats.total },
  { label: "声量", value: props.stats.volume },
  { label: "情感指数", value: props.stats.sentiment.toFixed(2) },
  { label: "一级预警", value: props.stats.warn1 },
  { label: "二级预警", value: props.stats.warn2 },
  { label: "一级机会", value: props.stats.opp1 },
]);
function toggleDetail() {
  detailVisible.value = !detailVisible.value;
}
</script>

<template>
  <div class="app-card">
    <!-- 顶部标题 + 新增按钮 -->
    <header class="card-header">
      <img :src="logoSrc" :alt="appName" class="app-logo" />
    </header>

    <main class="three-col">
      <!-- ① 左侧指标 -->
      <!-- <section class="metrics" @click="showVideo = !showVideo">
        <div class="item">
          <span>总数量</span><b>{{ stats.total }}</b>
        </div>
        <div class="item">
          <span>声量</span><b>{{ stats.volume }}</b>
        </div>
        <div class="item">
          <span>情感指数</span><b>{{ stats.sentiment.toFixed(2) }}</b>
        </div>
        <div class="item warn">
          <span>一级预警</span><b>{{ stats.warn1 }}</b>
        </div>
        <div class="item warn">
          <span>二级预警</span><b>{{ stats.warn2 }}</b>
        </div>
        <div class="item opp">
          <span>一级机会</span><b>{{ stats.opp1 }}</b>
        </div>
      </section> -->
      <section class="metrics" @click="toggleDetail">
        <!-- 默认 3 项（大字体 + 居中） -->
        <div v-if="!detailVisible" class="metrics-simple">
          <div
            v-for="(item, idx) in visibleMetrics"
            :key="idx"
            class="item-large"
          >
            <span class="label-lg">{{ item.label }}</span>
            <b class="value-lg">{{ item.value }}</b>
          </div>
        </div>

        <!-- 展开 6 项（原网格） -->
        <div v-else class="metrics-full">
          <div v-for="(item, idx) in allMetrics" :key="idx" class="item">
            <span>{{ item.label }}</span>
            <b>{{ item.value }}</b>
          </div>
        </div>
      </section>
      <!-- ② 中间趋势图 -->
      <!-- <section class="trend"> -->
      <!-- <OpinionChart /> -->
      <!-- </section> -->

      <!-- ③ 右侧部门 -->
      <section class="depts">
        <h1 class="gradient-text">业务板块</h1>
        <div class="department-grid">
          <div v-for="dept in departments" :key="dept.id">
            <router-link :to="{ name: 'DataList' }">
              {{ dept.name }}
            </router-link>
          </div>
        </div>
      </section>
    </main>

    <!-- 视频面板（可选动画） -->
    <PlatformVideoList
      v-if="detailVisible"
      :platform="activePlatform"
      :keyword="activeKeyword"
      class="video-list"
    />
  </div>
</template>

<style scoped>
.app-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  position: relative;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.add-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--button-gradient);
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}
.add-btn:hover {
  transform: scale(1.1);
}

.three-col {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(400px, 1fr) minmax(400px, 1fr);
}
@media (max-width: 767px) {
  .three-col {
    grid-template-columns: 1fr;
  }
}

.metrics {
  min-width: 400px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  cursor: pointer;
}
.metrics .item {
  display: flex;

  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(103, 63, 215, 0.1);
}
.metrics .item span {
  font-size: 0.8rem;
  color: var(--text-secondary);
}
.metrics .item b {
  font-size: 1.2rem;
  margin-top: 0.25rem;
}
.metrics .warn b {
  color: #ff4d4d;
}
.metrics .opp b {
  color: #1ce783;
}

.trend {
  min-height: 200px;
}
.depts ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.depts li + li {
  margin-top: 0.5rem;
}
.depts a {
  color: var(--link-color);
  text-decoration: none;
}
.depts a:hover {
  text-decoration: underline;
}

.app-logo {
  height: 100px; /* 按需调整 */
  width: auto;
  object-fit: contain;
}

.metrics-simple {
  min-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  min-height: 120px; /* 与右侧高度对齐 */
}

.item-large {
  text-align: center;
}

.label-lg {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.value-lg {
  display: block;
  font-size: 1.4rem; /* 明显更大 */
  font-weight: 700;
  color: var(--text-primary);
  margin-top: 0.2rem;
}
.metrics-full {
  min-width: 600px;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 列 */
  grid-template-rows: repeat(2, 1fr); /* 2 行 */
  gap: 1rem;
}
.metrics-full .item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(103, 63, 215, 0.1);
}
.metrics-full .item span {
  width: 60px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.3rem;
  text-align: center; /* 水平居中 */
}
.video-list {
  grid-column: 1 / -1;
  margin-top: 1rem;
}
.gradient-text {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 1rem;
  letter-spacing: 0.05em;
}

ul {
  font-size: 1.05rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 列表项基础样式 */
li {
  text-align: center;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  border-radius: 6px;
  overflow: hidden;
}

/* 链接样式 */
li a {
  display: block;
  padding: 12px 16px;
  text-decoration: none;
  color: #333;
  background-color: #353536;
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 悬停效果 */
li:hover {
  transform: translateX(5px);
}

li:hover a {
  background-color: #e9ecef;
  border-left-color: #3f87a6;
  color: #2c3e50;
}

/* 活动状态样式 */
li a.router-link-active {
  background-color: #e1f5fe;
  border-left-color: #0288d1;
  color: #01579b;
  font-weight: 600;
}

/* 响应式调整 */
@media (max-width: 768px) {
  li a {
    padding: 10px 12px;
    font-size: 14px;
  }
}

.department-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 两列等宽 */
  gap: 12px; /* 列间距 */
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 保留原有的悬停和样式效果 */
li a {
  display: block;
  padding: 12px 16px;
  background-color: #333;
  border-radius: 6px;
  transition: all 0.3s ease;
}

li:hover a {
  transform: translateX(5px);
  background-color: #5c5c5d;
}

.department-grid {
  text-align: center;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 12px;
}

.department-grid > div {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s ease;
  background: rgb(149, 146, 146);
}

.department-grid > div:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.department-grid a {
  display: block;
  color: #000000;
  font-weight: 500;
  text-decoration: none;
}
</style>
