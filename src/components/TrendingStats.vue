<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useToast, POSITION } from "vue-toastification";
import PlatformVideoList from "./PlatformVideoList.vue";
import OpinionChart from "./OpinionChart.vue";
import MonitoringMap from "./MonitoringMap.vue";
import AppDetailCard from "./AppDetailCard.vue";

const toast = useToast();
const activePlatform = ref<string | null>(null);

const keyword = "Q音";
const availableKeywords = ["Q音", "乐道"];
const platforms = ["抖音", "微博", "知乎", "微信视频号"];
const ourPlatforms = [
  "TME",
  "Q音",
  "酷狗音乐",
  "酷我音乐",
  "网易云音乐",
  "全民K歌",
  "懒人听书",
];
const activeKeyword = ref("Q音");

interface PlatformData {
  platform?: string;
  total?: number;
  volume?: number;
  sentimentScores?: number;
  first_opp_cnt?: number;
  first_risk_cnt?: number;
  second_risk_cnt?: number;
}

interface StatsData {
  [keyword: string]: {
    [platform: string]: PlatformData;
  };
}

interface ApiData {
  platform: string;
  sentiment_score: number;
  track_type: string;
  poos_score: number | null;
  pors_score: number | null;
  voice_score: number;
}

const stats = ref<StatsData>({
  Q音: {
    抖音: { volume: 0 },
    微博: {
      volume: 0,
    },
    知乎: {
      volume: 0,
    },
    微信视频号: {
      volume: 0,
    },
    小红书: {
      volume: 0,
    },
  },
  乐道: {
    抖音: { volume: 0 },
    微博: {
      volume: 0,
    },
    知乎: {
      volume: 0,
    },
    微信视频号: {
      volume: 0,
    },
  },
});

// 1. 可添加的应用池
const appPool = [
  {
    name: "Q音",
    departments: [
      { id: "qq-1", name: "基础产品中心" },
      { id: "qq-2", name: "商业化中心" },
      { id: "qq-3", name: "合作产品中心" },
      { id: "qq-4", name: "长音频业务中心" },
      { id: "qq-5", name: "内容运营中心" },
      { id: "qq-6", name: "数据科学中心" },
      { id: "qq-7", name: "工具研发中心" },
      { id: "qq-8", name: "平台研发中心" },
    ],
  },
  {
    name: "网易云",
    departments: [
      { id: "netease-1", name: "曲库部" },
      { id: "netease-2", name: "市场部" },
    ],
  },
  { name: "全民K歌", departments: [{ id: "kg-1", name: "产品部" }] },
  { name: "酷狗", departments: [{ id: "kg-1", name: "产品部" }] },
];

// 2. 已渲染的卡片列表
const cards = ref<{ name: string; departments: any[] }[]>([]);

// 3. 下拉框当前值
const selected = ref<string>("");

// 4. 过滤掉已添加的选项
const availableOptions = computed(() =>
  appPool.filter((a) => !cards.value.some((c) => c.name === a.name))
);

// 5. 新增逻辑
function addCard() {
  console.log(cards.value);
  if (!selected.value) return;
  const app = appPool.find((a) => a.name === selected.value);
  if (app) cards.value.push({ name: app.name, departments: app.departments });
  selected.value = ""; // 重置下拉
}

const calculateMetrics = (data: ApiData[]) => {
  // 声量
  const volume = Math.round(
    [...data].reduce((acc, cur) => acc + cur.voice_score, 0)
  );

  //情感指数
  const sentimentScores =
    [...data].reduce((acc, cur) => acc + cur.sentiment_score, 0) / data.length;

  let first_risk_cnt = 0;
  let second_risk_cnt = 0;
  let first_opp_cnt = 0;

  data.forEach((item) => {
    if (
      item.track_type === "risk" &&
      item.pors_score !== null &&
      item.pors_score > 75
    )
      first_risk_cnt++;
    if (
      item.track_type === "risk" &&
      item.pors_score !== null &&
      item.pors_score < 75 &&
      item.pors_score > 50
    )
      second_risk_cnt++;
    if (
      item.track_type === "opportunity" &&
      item.poos_score !== null &&
      item.poos_score > 75
    )
      first_opp_cnt++;
  });

  //总数
  const total = 14;

  // 评论数、转发数
  // const likes = data.reduce((sum, video) => sum + video.like_count, 0);
  // // 按点赞数排序并获取前10个视频
  // const top10Videos = [...data]
  //   .sort((a, b) => b.like_count - a.like_count)
  //   .slice(0, 10);

  // if (top10Videos.length === 0) return null;

  // 计算平均点赞数
  // const avgLikes =
  //   top10Videos.reduce((sum, video) => sum + video.like_count, 0) /
  //   top10Videos.length;

  // 计算平均评论数
  // const avgComments =
  //   top10Videos.reduce((sum, video) => sum + video.comment_count, 0) /
  //   top10Videos.length;

  // // 计算平均转发数
  // const avgShares =
  //   top10Videos.reduce((sum, video) => sum + video.share_count, 0) /
  //   top10Videos.length;

  // // 计算声量 (平均点赞 x 10)
  // const volume = Math.round(avgLikes * 10);

  // // 计算互动率 (平均评论/平均点赞)
  // const engagementRate = avgComments / avgLikes;

  // // 计算转发率 (平均转发/平均点赞)
  // const shareRate = avgShares / avgLikes;

  // // 计算热度指数 (根据点赞数、评论数和分享数的加权平均)
  // const heatIndex = Math.round(
  //   (avgLikes * 0.4 + avgComments * 0.4 + avgShares * 0.2) / 100
  // );

  return {
    volume,
    sentimentScores,
    first_opp_cnt,
    first_risk_cnt,
    second_risk_cnt,
    total,
  };
};

const fetchLatestData = async (keyword: string) => {
  try {
    const response = await fetch(`/api/monitor/${keyword}/latest`);
    const data = await response.json();
    console.log(`Received response for :`, data);
    if (Array.isArray(data)) {
      const douyinData = data.filter(
        (item: ApiData) => item.platform === "douyin"
      );
      const xiaohongshuData = data.filter(
        (item: ApiData) => item.platform === "xiaohongshu"
      );
      if (douyinData.length > 0) {
        const metricsDouyin = calculateMetrics(douyinData);

        if (metricsDouyin) {
          stats.value[keyword]["抖音"] = {
            volume: metricsDouyin.volume,
            sentimentScores: metricsDouyin.sentimentScores,
            first_opp_cnt: metricsDouyin.first_opp_cnt,
            first_risk_cnt: metricsDouyin.first_risk_cnt,
            second_risk_cnt: metricsDouyin.second_risk_cnt,
            total: metricsDouyin.total,
          };
        }
      }
      if (xiaohongshuData.length > 0) {
        const metricsXiaohongshu = calculateMetrics(xiaohongshuData);

        if (metricsXiaohongshu) {
          stats.value[keyword]["小红书"] = {
            volume: metricsXiaohongshu.volume,
            sentimentScores: metricsXiaohongshu.sentimentScores,
            first_opp_cnt: metricsXiaohongshu.first_opp_cnt,
            first_risk_cnt: metricsXiaohongshu.first_risk_cnt,
            second_risk_cnt: metricsXiaohongshu.second_risk_cnt,
            total: metricsXiaohongshu.total,
          };
        }
      }
      console.log("监测数据:", stats.value);
    }
  } catch (error) {
    console.error("获取监测数据失败:", error);
    toast.error("获取数据失败，请稍后重试");
  }
};

onMounted(async () => {
  await fetchLatestData("Q音");
  // await fetchLatestData("蔚来");
});

const handleKeywordClick = (keyword: string) => {
  if (!availableKeywords.includes(keyword)) {
    toast.info(`"${keyword}"相关数据监测系统开发中...`, {
      timeout: 2000,
      position: POSITION.TOP_RIGHT,
    });
    return;
  }
  activeKeyword.value = keyword;
};

const handlePlatformClick = (platform: string) => {
  if (stats.value[activeKeyword.value][platform].first_opp_cnt === -1) {
    toast.info(`${platform}平台监测系统开发中...`, {
      timeout: 2000,
      position: POSITION.TOP_RIGHT,
    });
    return;
  }
  activePlatform.value = activePlatform.value === platform ? null : platform;
};

// const getSentimentClass = (platform: string) => {
//   const sentiment = stats.value[activeKeyword.value][platform].sentiment;
//   if (sentiment == null) return "";
//   return sentiment > 0 ? "positive" : "negative";
// };

// const showPlusSign = (platform: string) => {
//   const sentiment = stats.value[activeKeyword.value][platform].sentiment;
//   return sentiment != null && sentiment > 0 ? "+" : "";
// };

const getAppStats = (appName: string) => {
  // 根据应用名称从 stats.value 中提取数据
  // 这里假设 stats.value 的结构与应用名称相关
  // 实际逻辑需要根据数据源调整
  console.log("1111", appName, stats.value[appName]);
  const appStats = {
    total: stats.value[appName]["抖音"]?.total || 0,
    sentiment: stats.value[appName]["抖音"]?.sentimentScores || 0,
    opp1: stats.value[appName]["抖音"]?.first_opp_cnt || 0,
    warn1: stats.value[appName]["抖音"]?.first_risk_cnt || 0,
    warn2: stats.value[appName]["抖音"]?.second_risk_cnt || 0,
    volume: stats.value[appName]["抖音"]?.volume || 0,
  };
  return appStats;
};
</script>

<template>
  <div class="trending-stats">
    <!-- 新增的描述卡片 -->
    <div class="info-content">
      <h4>· 舆情监测面板 ·</h4>
    </div>

    <!-- <div class="keyword-tabs">
      <button
        v-for="keyword in keywords"
        :key="keyword"
        :class="[
          'tab-btn',
          {
            active: activeKeyword === keyword,
          },
        ]"
        @click="handleKeywordClick(keyword)"
      >
        #{{ keyword }}
      </button>
    </div> -->

    <div class="platforms-grid">
      <div class="stat-card center-position">
        <div class="stat-header">
          <div class="platform-info">
            <div class="platform-tag">
              <img
                src="/tmelogo.png"
                class="platform-icon tiktok-icon"
                alt="tme"
              />
            </div>
          </div>
        </div>
        <div class="stat-body">
          <div class="stat-item">
            <div class="label-icon">
              <span class="label">总数量</span
              ><img src="/the-sum-of-sum-svgrepo-com.svg" class="small-icon" />
            </div>
            <span class="value">
              {{ 31252 }}
            </span>
          </div>
          <div class="stat-item">
            <div class="label-icon">
              <span class="label">声量</span>
              <img src="/volume-svgrepo-com.svg" class="small-icon" />
            </div>
            <span class="value"> 72248 </span>
          </div>
          <div class="stat-item">
            <div class="label-icon">
              <span class="label">情感指数</span>
              <img src="/balance-law-svgrepo-com.svg" class="small-icon" />
            </div>

            <span class="value"> 36 </span>
          </div>
          <div class="stat-item">
            <div class="label-icon">
              <span class="label">一级预警</span>
              <img src="/red-circle-svgrepo-com.svg" class="small-icon" />
            </div>
            <span class="value"> 2 </span>
          </div>
          <div class="stat-item">
            <div class="label-icon">
              <span class="label">二级预警</span>
              <img src="/yellow-circle-svgrepo-com.svg" class="small-icon" />
            </div>
            <span class="value"> 5 </span>
          </div>
          <div class="stat-item">
            <div class="label-icon">
              <span class="label">一级机会</span>
              <img src="/green-circle-svgrepo-com.svg" class="small-icon" />
            </div>
            <span class="value"> 9 </span>
          </div>
          <div class="last-updated">
            最后更新: {{ new Date().toLocaleString() }}
          </div>
          <!-- <div v-if="activePlatform === platform" class="expanded-info">
            <div class="stat-item">
              <span class="label">互动率</span>
              <span class="value"
                >{{ stats[activeKeyword][platform].engagement_rate }}%</span
              >
            </div>
            <div class="stat-item">
              <span class="label">转发率</span>
              <span class="value"
                >{{ stats[activeKeyword][platform].share_rate }}%</span
              >
            </div>
            <div class="stat-item">
              <span class="label">热度指数</span>
              <span class="value positive">{{
                stats[activeKeyword][platform].heat_index
              }}</span>
            </div>
          </div> -->
        </div>

        <!-- 添加提示文本 -->
        <!-- <div class="click-hint">点击查看详情 →</div> -->
      </div>
      <div class="stat-card">
        <OpinionChart />
      </div>
      <div class="stat-card"><MonitoringMap /></div>
      <!-- <PlatformVideoList
        v-if="activePlatform"
        :platform="activePlatform"
        :keyword="activeKeyword"
        class="video-list"
      /> -->
    </div>
    <!-- 新增控制条 -->
    <header class="toolbar">
      <div class="select-wrapper">
        <select v-model="selected">
          <option disabled value="">选择应用…</option>
          <option
            v-for="opt in availableOptions"
            :key="opt.name"
            :value="opt.name"
          >
            {{ opt.name }}
          </option>
        </select>
        <!-- 自定义箭头 -->
        <span class="arrow"></span>
      </div>

      <button class="add-btn" :disabled="!selected" @click="addCard">
        增加
      </button>
    </header>

    <!-- 卡片列表 -->
    <div class="cards-wrapper">
      <AppDetailCard
        v-for="(card, i) in cards"
        :key="i"
        :app-name="card.name"
        :departments="card.departments"
        :stats="getAppStats(card.name)"
      />
    </div>
  </div>
</template>

<style scoped>
.trending-stats {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stats-header {
  margin-bottom: 1.5rem;
}

.description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.keyword-tabs {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.tab-btn {
  background: transparent;
  border: none;
  padding: 0.75em 1.5em;
  border-radius: 8px;
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: var(--button-gradient);
  color: white;
  box-shadow: 0 4px 16px rgba(103, 63, 215, 0.4);
}

.platforms-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  grid-column: span 1;
}

.stat-card.active {
  border: 1px solid rgb(103, 63, 215);
  box-shadow: 0 0 0 1px rgb(103, 63, 215);
}

.stat-card.expanded {
  grid-column: span 1;
}

/* 当有卡片展开时，其他卡片变为单列显示 */
.stat-card:not(.expanded) {
  grid-column: span 1;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.platform-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.platform-tag {
  background: rgba(103, 63, 215, 0.1);
  color: rgb(103, 63, 215);
  padding: 0.5em 1em;
  border-radius: 6px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.center-position {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.platform-icon {
  width: 23rem;
  height: 12rem;
}
.small-icon {
  width: 1.2rem;
  height: 1.2rem;
}
.label-icon {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tiktok-icon {
  filter: brightness(0) invert(1);
}

.wechat-icon {
  filter: brightness(0) saturate(100%) invert(83%) sepia(31%) saturate(1033%)
    hue-rotate(86deg) brightness(89%) contrast(85%);
}

.gradient-text {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.stat-body {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  grid-column: span 1;
}

.label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  letter-spacing: 0.05em;
}

.value {
  font-size: 1.5rem;
  font-weight: 700;
}

.positive {
  color: #1ce783;
}

.negative {
  color: #ff4d4d;
}

.developing {
  font-size: 1.2rem !important;
  color: var(--text-secondary) !important;
  font-style: italic;
}

/* 新增的样式 */
.keyword-info-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.info-icon {
  font-size: 1.2rem;
  line-height: 1;
  padding-top: 0.2rem;
}

.info-content h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.info-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

.video-list {
  grid-column: 1 / -1;
  margin-top: 1rem;
}

.last-updated {
  color: var(--text-secondary);
  font-size: 0.85rem;
  opacity: 0.8;
}

.trend-arrow {
  display: inline-block;
  margin-right: 0.25rem;
  font-size: 1.2em;
}

.expanded-info {
  display: flex;
  gap: 2.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  width: 100%;
}

.stat-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.stat-card.disabled:hover {
  border-color: var(--border-color);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

/* @media (max-width: 1200px) {
  .platforms-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-card.expanded {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .platforms-grid {
    grid-template-columns: 1fr;
  }

  .stat-card.expanded {
    grid-column: span 1;
  }
} */

.platforms-grid {
  display: grid;
  gap: 1.5rem;
  /* ≥768px：1 : 1.5 : 1 比例 */
  grid-template-columns: 1fr 1.5fr 1fr;
}

/* <768px 单列 */
@media (max-width: 767px) {
  .platforms-grid {
    grid-template-columns: 1fr;
  }
}
.click-hint {
  color: var(--text-secondary);
  font-size: 0.85rem;
  opacity: 0.6;
  margin-top: 1rem;
  text-align: right;
  font-style: italic;
  transition: opacity 0.2s;
}

.stat-card:hover .click-hint {
  opacity: 1;
  color: rgb(103, 63, 215);
}

/* 外层容器 */
.toolbar {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* 下拉框外壳 */
.select-wrapper {
  position: relative;
  width: 180px;
}

/* 隐藏原生箭头，用自定义箭头覆盖 */
.select-wrapper select {
  appearance: none;
  width: 100%;
  padding: 0.6em 2em 0.6em 1em;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  background: #fff;
  color: #24292f;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.select-wrapper select:focus {
  border-color: #673fd7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(103, 63, 215, 0.15);
}

/* 自定义箭头 */
.select-wrapper .arrow {
  position: absolute;
  top: 50%;
  right: 0.8em;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid #673fd7;
  pointer-events: none;
  transform: translateY(-50%);
  transition: transform 0.2s;
}

.select-wrapper select:focus + .arrow {
  transform: translateY(-50%) rotate(180deg);
}

/* 新增按钮 */
.add-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #673fd7, #9b59b6);
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.add-btn:hover:not(:disabled) {
  transform: scale(1.08);
  box-shadow: 0 4px 12px rgba(103, 63, 215, 0.4);
}
.add-btn:disabled {
  background: #d0d7de;
  cursor: not-allowed;
}
.add-btn {
  display: inline-flex; /* 水平弹性布局 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  padding: 0 1.2em; /* 左右留白即可，不要上下 padding */
  height: 32px; /* 关键：固定高度或 min-height */
  border-radius: 8px;
  background: linear-gradient(135deg, #673fd7, #9b59b6);
  color: #fff;
  font-size: 0.9rem;
  line-height: 32px; /* 与 height 一致，防止换行 */
  white-space: nowrap; /* 禁止换行 */
  cursor: pointer;
}

.add-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(103, 63, 215, 0.35);
}

.add-btn:disabled {
  background: #d0d7de;
  color: #8c959f;
  cursor: not-allowed;
}
</style>
