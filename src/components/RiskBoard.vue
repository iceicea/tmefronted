<script setup lang="ts">
// 示例假数据
import { ref, computed } from "vue";

import PieChart from "./PieChart.vue";
const summary = `
Ex eu voluptate culpa minim. Mollit nisi ut quis cillum et ex elit minim magna mollit sint sunt. Ipsum Lorem duis incididunt magna adipisicing eu eiusmod ullamco. Minim dolor nisi nostrud sunt. Ex aliquip culpa duis labore sunt nulla incididunt duis. Labore qui aliqua irure ea commodo sint mollit laborum consequat. Tempor laboris ut reprehenderit ex eu culpa aliquip exercitation ut fugiat laborum aliquip do laborum.
`;
const overview = [
  { label: "涉事主体", value: "中国银行" },
  { label: "涉及部门", value: "风险合规部" },
  { label: "发布平台", value: "微博" },
  { label: "情感强度", value: "高" },
];
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
        <h3 class="topic">#是时候展现真正的技术了#</h3>
        <div class="author-line">
          <img src="/zhihu-logo.svg" class="avatar" alt="avatar" />
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
    <section class="detail">
      <h3>摘要</h3>
      <p class="summary">{{ summary }}</p>

      <h3>事件概览</h3>
      <section class="overview-grid">
        <div class="grid-item-1">
          <div class="table-title">基础信息</div>
          <table>
            <thead>
              <tr>
                <th>涉事主体(app)</th>
                <th>涉及部门</th>
                <th>发布平台</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>QQ音乐</td>
                <td>平台产品部</td>
                <td>小红书</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="grid-item-2">
          <h4 class="section-title">风险解析/机会解析</h4>
          <div class="chart-container">
            <div class="item1">
              <div class="user-score">用户影响分数:75 分</div>
              <div class="user-detail">
                <div class="detail-item">粉丝数: 88k</div>
              </div>
            </div>
            <div class="item2">
              <PieChart />
            </div>
            <div class="item3">
              <div class="propagation-score">传播扩散分数:85 分</div>
              <div class="propagation-detail">
                <div>点赞数</div>
                <div>收藏数</div>
                <div>评论数</div>
              </div>
            </div>
            <div class="item4">
              <div class="position-score">立场分数:65 分</div>
              <div class="position-detail">
                <div>场景类型</div>
                <div>情感强度</div>
              </div>
            </div>
          </div>
        </div>
        <div class="grid-item">3</div>
        <div class="grid-item">4</div>
      </section>
    </section>
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
  background: #fafafa;
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
  height: 100%; /* 填充满 cover-wrapper */
  width: auto; /* 按比例缩放 */
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
}
.time {
  font-size: 0.75rem;
  opacity: 0.8;
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
  background: rgba(103, 63, 215, 0.1);
  color: #673fd7;
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
</style>
