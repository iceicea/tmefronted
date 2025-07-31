<script setup lang="ts">
// 示例假数据
import { ref, computed, onMounted } from "vue";

import PieChart from "./PieChart.vue";
import LineChart from "./lineChart.vue";
import { useRoute } from 'vue-router'
const summary = `
Ex eu voluptate culpa minim. Mollit nisi ut quis cillum et ex elit minim magna mollit sint sunt. Ipsum Lorem duis incididunt magna adipisicing eu eiusmod ullamco. Minim dolor nisi nostrud sunt. Ex aliquip culpa duis labore sunt nulla incididunt duis. Labore qui aliqua irure ea commodo sint mollit laborum consequat. Tempor laboris ut reprehenderit ex eu culpa aliquip exercitation ut fugiat laborum aliquip do laborum.
`;
const overview = [
  { label: "涉事主体", value: "中国银行" },
  { label: "涉及部门", value: "风险合规部" },
  { label: "发布平台", value: "微博" },
  { label: "情感强度", value: "高" },
];

onMounted(() => {
  const storedData = sessionStorage.getItem('riskBoardData')
  if (storedData) {
    data.value = JSON.parse(storedData)
    console.log('获取到的数据:', data.value)
  }
})
const userImpact = ref(75); // 示例数据
const diffusion = ref(65); // 示例数据
const positionScore = ref(85); // 示例数据
const riskLevel = ref("红色预警");
const riskScore = ref(78);

const riskColor = computed(() => {
  if (riskScore.value >= 75) return "#ff4d4d"; // 红
  if (riskScore.value >= 50) return "#ffa726"; // 橙
  return "#4caf50"; // 绿
});
const route = useRoute()
const data = route.params
console.log(data)
</script>

<template>
  <div class="risk-board">
    <!-- 1️⃣ 基本信息栏 -->
    <header class="info-bar">
      <!-- ① 9:16 封面 -->
      <div class="cover-wrapper">
        <img src="/NOMS_logo.png" alt="cover" class="cover" />
      </div>

      <!-- ② 事件详情 -->
      <div class="event-info">
        <h3 class="topic">{{ data.topics }}</h3>
        <div class="author-line">
          <span class="name">恒大</span>
          <span class="fans">粉丝量:100w</span>
        </div>
        <p class="time">发布时间:2025-07-28 22:32:43</p>
      </div>

      <!-- ③ 右侧风险 & 按钮 -->
      <div class="right-panel">
        <!-- 风险色带（动态颜色） -->
        <div>
          <span class="risk-text">风险预警级别：</span>
          <div class="risk-badge" :style="{ backgroundColor: riskColor }">
            {{ "xxx分" + riskLevel }}
          </div>
        </div>

        <button class="export-btn">导出报告</button>
        <a class="jump-btn" href="#origin">跳转原文</a>
      </div>
    </header>

    <!-- 2️⃣ 摘要 + 事件概览 -->
   <div class="dashboard-container">
    <!-- 顶部摘要 -->
    <div class="summary-bar">
      <div class="summary-title">摘要</div>
      <div class="summary-content">
        一连5张罚单，中国银行因“原油宝”产品风险事件被重罚5050万元，另有4名相关责任人被给予警告并合计处罚款180万元。……
      </div>
    </div>

    <!-- 主体内容区域 -->
    <div class="main-content">
      <!-- 左侧 -->
      <div class="left-panel">
        <!-- 事件概览 -->
        <!-- <div class="section-title">事件概览</div> -->
        <div class="base-info">
          <div class="base-info-title">基础信息</div>
          <div class="base-info-table">
            <div class="table-row table-header">
              <div>涉事主体（app）</div>
              <div>涉及部门</div>
              <div>发布平台</div>
            </div>
            <div class="table-row">
              <div>Q音乐，酷狗音乐<br/>(最多两个)</div>
              <div>Q音推荐算法<br/>(保留前三个)</div>
              <div>小红书</div>
            </div>
          </div>
        </div>
        <!-- 热门评论 -->
        <div class="hot-comment-section">
          <div class="hot-comment-title">热门评论</div>
          <LineChart/>
        </div>
      </div>

      <!-- 右侧 -->
      <div class="right-panel">
        <!-- 风险分析/机会分析 -->
        <!-- <div class="section-title right-title">
          风险解析/机会解析
          <button class="edit-btn">编辑</button>
        </div> -->
        <div class="risk-grid">
          <div class="risk-item user-impact">
            <div class="risk-item-title">用户影响分</div>
            <div class="risk-item-content" style="font-size: 14px;">粉丝数：</div>
          </div>
          <div class="risk-item spread">
            <div class="risk-item-title">传播扩散分</div>
            <div class="risk-item-content" style="font-size: 14px;">点赞、收藏、评论：</div>
          </div>
          <div class="risk-item donut-chart">
            <PieChart />
          </div>
          <div class="risk-item stance">
            <div class="risk-item-title">立场得分</div>
            <div class="risk-item-content" style="font-size: 14px;">场景类型：<br/>情感强度：</div>
          </div>
          <div class="risk-item opinion">
            <div class="risk-item-title">网民观点</div>
            <div class="risk-item-content"></div>
          </div>
          <div class="risk-item media">
            <div class="risk-item-title">媒体观点</div>
            <div class="risk-item-content"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
.risk-board {
  width: 100%;
  margin: 2rem auto;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  color: #222;
}

/* 1️⃣ 基本信息栏 */
.info-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  background:rgb(10,10,11);
}

/* 风险/机会色带 */
.color-band {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 60px;
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
}
.color-band.risk {
  background: hsl(0, 80%, calc(var(--score) * 1.2% + 40%));
}
.color-band.opp {
  background: hsl(220, 80%, calc(var(--score) * 1.2% + 40%));
}
.color-band span {
  font-size: 0.9rem;
}
.color-band small {
  font-size: 1.2rem;
}

.event h3 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
}
.event p {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
}

.export-btn {
  margin-left: auto;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: #673fd7;
  color: #fff;
  cursor: pointer;
}

/* 2️⃣ 摘要 + 事件概览 */
.detail {
  padding: 1.5rem;
}
.detail h4 {
  margin: 1rem 0 0.5rem;
  font-size: 1rem;
}
.summary {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #444;
}

/* 2×2 网格 */
.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr 1fr;
  gap: 10px; /* 网格间距 */
  padding: 20px;
}

.grid-item {
  background: var(--bg-card); /* 背景色 */
  border-radius: 8px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
}
.grid-item-1 {
  background: var(--bg-card);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* 将内容推到顶部 */
  color: var(--text-primary);
}
.table-title {
  font-size: 0.7rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid var(--border-color);
  padding: 8px;
  text-align: center;
  font-size: 1.2rem;
}

th {
  background: var(--bg-secondary);
  font-weight: bold;
  font-size: 1.5rem;
}
.cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(103, 63, 215, 0.08);
}
.cell .label {
  font-size: 0.75rem;
  color: #666;
}
.cell .value {
  font-size: 1rem;
  font-weight: 600;
  color: #222;
}
.info-bar {
  height: 150px;
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem 1rem;
}

/* ① 9:16 封面 */
.cover-wrapper {
  height: 90%; /* 占 info-bar 的 90% */
  width: auto; /* 宽度按 9:16 自适应 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover {
  height: 200px; /* 填充满 cover-wrapper */
  width: 200px; /* 按比例缩放 */
  object-fit: cover;
  border-radius: 8px;
}

/* ② 事件详情 */
.event-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.topic {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
}
.author-line {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* 头像-文字间距 */
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0; /* 防止挤压 */
}
.name,
.fans {
  opacity: 0.6;
  color: #fff;
}
.time {
  font-size: 0.75rem;
  opacity: 0.8;
  color: #fff;
}

/* ③ 右侧面板 */
.right-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  gap: 0.5rem;
}
.risk-badge {
  display: flex; /* 添加弹性容器属性 */
  align-items: center; /* 垂直居中对齐 */
  justify-content: center; /* 水平居中对齐 */
  padding: 0.3em 0.6em;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
}
.risk-text {
  padding: 0.3em 0.6em;
  border-radius: 4px;
  color: #000;
  font-size: 1rem;
  font-weight: 600;
}

.export-btn,
.jump-btn {
  padding: 0.4em 0.8em;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}
.export-btn {
  background: var(--button-gradient);
  color: #fff;
}
.jump-btn {
  color: #fff;
  background: linear-gradient(92.88deg, rgb(69, 94, 181) 9.16%, rgb(86, 67, 204) 43.89%, rgb(103, 63, 215) 64.72%);
  text-decoration: none;
}

.grid-item-2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #000;
  color: #fff;
}

.chart-container {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr; /* 三列，比例为1:1.5:1 */
  grid-template-rows: auto auto; /* 两行 */
  gap: 10px; /* 可选，设置项之间的间距 */
}

.item1 {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  flex-direction: column;
}

.item2 {
  grid-column: 2;
  grid-row: 1;
}

.item3 {
  grid-column: 3;
  grid-row: 1;
}

.item4 {
  grid-column: 1 / span 3; /* 跨3列 */
  grid-row: 2;
}

.item1 {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  padding: 10px; /* 根据需要添加内边距 */
  text-align: center; /* 确保文本居中 */
  background: #673fd7; /* 背景色 */
}

.user-score,
.propagation-score,
.position-score {
  position: absolute; /* 设置绝对定位 */
  top: 0;
  left: 0;
  margin: 10px; /* 与详情之间的间距 */
  font-size: 1rem;
  color: #fff;
}

.user-detail,
.propagation-detail,
.position-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px; /* 子元素之间的间距 */
  padding: 10px; /* 内边距 */
  background-color: rgb(93, 106, 52); /* 背景色 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影 */
}

.detail-item {
  font-size: 0.9rem;
  color: #fff;
}
.item3 {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  padding: 10px; /* 根据需要添加内边距 */
  text-align: center; /* 确保文本居中 */
  background: #673fd7; /* 背景色 */
}
.item4 {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  padding: 10px; /* 根据需要添加内边距 */
  text-align: center; /* 确保文本居中 */
  background: #673fd7; /* 背景色 */
}
.hot-comments-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}

.hot-comments-box {
  background-color: orange;
  border-radius: 8px;
  padding: 16px;
  color: #fff;
  /* 你可以根据需要调整阴影、边框等 */
}
.dashboard-container {
  background:rgb(10,10,11);
  color: #fff;
  padding: 12px;
  min-height: 100vh;
  font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  box-sizing: border-box;
}

/* 顶部摘要栏 */
.summary-bar {
  display: flex;
  align-items: center;
  background-color: rgb(20, 21, 25);
  border-radius: 8px ;
  padding: 8px 16px;
  margin-bottom: 10px;
  position: relative;
}
.summary-title {
  background: linear-gradient(92.88deg, rgb(69, 94, 181) 9.16%, rgb(86, 67, 204) 43.89%, rgb(103, 63, 215) 64.72%);
  border-radius: 6px;
  padding: 2px 16px;
  font-weight: bold;
  margin-right: 16px;
}
.summary-content {
  flex: 1;
  font-size: 14px;
  color: #e0e6ff;
}
.edit-btn {
  background: #1d2e7a;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 2px 12px;
  margin-left: 10px;
  cursor: pointer;
}

/* 主体内容布局 */
.main-content {
  display: flex;
  gap: 12px;
  height: calc(100vh - 80px);
}

/* 左侧面板 */
.left-panel {
  flex: 1.7;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 420px;
}
.section-title {
  background: #1d2e7a;
  border-radius: 6px 6px 0 0;
  padding: 4px 16px;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 6px;
}
.base-info {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  margin-top: 6px;
  background-color: rgb(20, 21, 25);
}
.base-info-title {
  background: linear-gradient(92.88deg, rgb(69, 94, 181) 9.16%, rgb(86, 67, 204) 43.89%, rgb(103, 63, 215) 64.72%);
    border-radius: 6px;
    padding: 2px 10px;
    font-size: 15px;
    margin-bottom: 6px;
    align-self: flex-start;
   width: 60px;
}
.base-info-table {
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.table-row {
  display: flex;
}
.table-header > div {
  /* background: #3b6680; */
  color: #fff;
  font-weight: bold;
  flex: 1;
  text-align: center;
  padding: 12px 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
}
.table-header > div:last-child {
  border-right: none;
}
.table-row:not(.table-header) > div {
  border-top: 1px solid ;
  flex: 1;
  text-align: center;
  padding: 16px 0 12px 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
}
.table-row:not(.table-header) > div:last-child {
  border-right: none;
}

.hot-comment-section {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px 0 0 0;
  flex: 0.71;
  display: flex;
  flex-direction: column;
  background-color: rgb(20, 21, 25);
}
.hot-comment-title {
  background: linear-gradient(92.88deg, rgb(69, 94, 181) 9.16%, rgb(86, 67, 204) 43.89%, rgb(103, 63, 215) 64.72%);
    border-radius: 6px;
    padding: 2px 10px;
    font-size: 15px;
    margin-bottom: 6px;
    align-self: flex-start;
    margin-left: 15px;
}
.hot-comment-content {
  
  color: #fff;
  flex: 1;
  border-radius: 0 0 8px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

/* 右侧面板 */
.right-panel {
  flex: 1.8;
  display: flex;
  flex-direction: column;
  min-width: 600px;
}
.right-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.risk-grid {
  display: grid;
  grid-template-areas:
    "user-impact donut-chart spread"
    "stance donut-chart spread"
    "opinion opinion media";
  grid-template-columns: 1.1fr 1.2fr 1.1fr;
  grid-template-rows: 110px 110px 1fr;
  gap: 10px;
  flex: 1;
  margin-top: 6px;
  width: 50vw;
}
.risk-item {
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 8px;
  padding: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.user-impact { 
  grid-area: user-impact;
  background-color: rgb(20, 21, 25);
 }
.spread { 
  grid-area: spread;
  background-color: rgb(20, 21, 25);
 }
.donut-chart { 
  grid-area: donut-chart; 
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(20, 21, 25);
}
.stance { 
  grid-area: stance;
  background-color: rgb(20, 21, 25);
 }
.opinion { 
  grid-area: opinion;
  height:360px;
  background-color: rgb(20, 21, 25);
}
.media { 
  grid-area: media; 
  height:360px;
  background-color: rgb(20, 21, 25);
}

.risk-item-title {
  background: linear-gradient(92.88deg, rgb(69, 94, 181) 9.16%, rgb(86, 67, 204) 43.89%, rgb(103, 63, 215) 64.72%);
  border-radius: 6px;
  padding: 2px 10px;
  font-size: 15px;
  margin-bottom: 6px;
  align-self: flex-start;
}
.donut-placeholder {
  color: #fff;
  text-align: center;
  font-size: 18px;
  line-height: 1.5;
}
/* ------------ */
/* 字体主色调优化 */
.risk-board,
.dashboard-container,
.main-content,
.risk-item,
.hot-comment-content {
  color: #e0e6f6;
}
.topic,
.risk-item-title,
.base-info-title,
.hot-comment-title,
.summary-title {
  color: #f5f7fa;
}
.name,
.fans,
.time {
  color: #bfc6d9;
  opacity: 0.8;
}
.table-header > div {
  color: #d3d7e9;
}
.table-row:not(.table-header) > div {
  color: #e0e6f6;
}
.summary-content {
  color: #d3d7e9;
}
.risk-text {
  color: #d3d7e9;
}
</style>
