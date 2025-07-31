<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useToast, POSITION } from "vue-toastification";
import VideoProcessModal from "./VideoProcessModal.vue";

const { platform, keyword } = defineProps<{
  platform: string;
  keyword: string;
}>();
const getRankClass = (rank: string) => {
  const map = {
    红色预警: "red",
    橙色预警: "orange",
    黄色预警: "yellow",
    蓝色预警: "blue",
    钻石级机会: "diamond",
    黄金级机会: "gold",
    白银级机会: "silver",
    青铜级机会: "bronze",
  };
  return map[rank] || "";
};

interface VideoData {
  id: number;
  title: string;
  author_name: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  summary: string;
  sentiment_score: number;
  video_url: string;
  asr_text: string;
  share_count: number;
  cover_url: string;
  platform: string;
  orRank?: string;
  poos_score?: number | null;
  pors_score?: number | null;
  track_type?: string;
  content?: string | null; // 新增内容字段
  // ... 其他字段
}

interface ApiResponse {
  platform: string;
  title: string;
  author_name: string;
  view_count?: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  summary: string;
  sentiment_score: number;
  video_url: string;
  asr_text: string;
  share_count: number;
  cover_url: string;
  id: number;
  orRank?: string;
  poos_score?: number | null;
  pors_score?: number | null;
  track_type?: string;
  content?: string | null; // 新增内容字段
}

const videoList = ref<VideoData[]>([]);

const toast = useToast();
const showModal = ref(false);
const modalType = ref<"counter" | "optimize" | "enhance">("counter");
const rankClassMap = {
  红色预警: "or-rank--red",
  橙色预警: "or-rank--orange",
  黄色预警: "or-rank--yellow",
  蓝色预警: "or-rank--blue",
  钻石级机会: "or-rank--diamond",
  黄金级机会: "or-rank--gold",
  白银级机会: "or-rank--silver",
  青铜级机会: "or-rank--bronze",
};
const fetchVideoList = async () => {
  try {
    const response = await fetch(`/api/monitor/${keyword}/latest`);
    const data = await response.json();
    console.log(`Received response: ${data}`);

    console.log("获取到的视频数据:", data);
    if (Array.isArray(data)) {
      // 过滤指定平台的数据
      // const platformData = data.filter(
      //   (item: ApiResponse) =>
      //     item.platform.toLowerCase() ===
      //     (platform === "抖音" ? "douyin" : platform).toLowerCase()
      // );
      const platformData = data.map((x) => x);
      // 转换数据格式以匹配后端返回的字段
      videoList.value = platformData.map((item: ApiResponse) => {
        let orRank = "";
        if (item.track_type === "opportunity") {
          if (item.poos_score > 75) {
            orRank = "钻石级机会";
          } else if (item.poos_score > 50) {
            orRank = "黄金级机会";
          } else if (item.poos_score > 30) {
            orRank = "白银级机会";
          } else {
            orRank = "青铜级机会";
          }
        }
        if (item.track_type === "risk") {
          if (item.pors_score > 75) {
            orRank = "红色预警";
          } else if (item.pors_score > 50) {
            orRank = "橙色预警";
          } else if (item.pors_score > 30) {
            orRank = "黄色预警";
          } else {
            orRank = "蓝色预警";
          }
        }
        if (item.summary.length >= 35) {
          item.summary = item.summary.slice(0, 35) + "...";
        }
        if (!item.title) item.title = item.content + "";
        if (item.title.length >= 35) {
          item.title = item.title.slice(0, 35) + "...";
        }
        return {
          id: item.id,
          title: item.title,
          author_name: item.author_name,
          view_count: item.view_count || 0,
          like_count: item.like_count,
          comment_count: item.comment_count,
          created_at: new Date(item.created_at).toLocaleDateString("zh-CN"),
          summary: item.summary,
          sentiment_score: item.sentiment_score,
          video_url: item.video_url,
          asr_text: item.asr_text,
          share_count: item.share_count,
          cover_url: item.cover_url,
          platform: item.platform,
          orRank: orRank,
          poos_score: item.poos_score,
          pors_score: item.pors_score,
          track_type: item.track_type,
        };
      });
    }
  } catch (error) {
    console.error("获取视频列表失败:", error);
  }
};
// console.log(videoList.value)

// 在组件挂载时获取数据
onMounted(() => {
  fetchVideoList();
});

// 添加对 keyword 的监听
watch(
  () => keyword,
  (_) => {
    fetchVideoList(); // 当关键词变化时重新获取数据
  }
);

const getSentimentColor = (sentiment: number) => {
  if (sentiment > 30) return "positive";
  if (sentiment < -30) return "negative";
  return "neutral";
};

const getSentimentLabel = (sentiment: number): "正面" | "中立" | "负面" => {
  if (sentiment > 30) return "正面";
  if (sentiment < -30) return "负面";
  return "中立";
};

const formatNumber = (num: number) => {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + "亿";
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "万";
  }
  return num.toLocaleString();
};

const handleCounterVideo = (_video: VideoData) => {
  modalType.value = "counter";
  showModal.value = true;
};

const handleOptimizeVideo = (_video: VideoData) => {
  modalType.value = "optimize";
  showModal.value = true;
};

const handleEnhanceVideo = (_video: VideoData) => {
  modalType.value = "enhance";
  showModal.value = true;
};

const handlePipelineRequest = () => {
  toast.info("已向管理员提交视频渲染管线申请，请等待审核通过", {
    timeout: 3000,
    position: POSITION.TOP_RIGHT,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: true,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
  });
  showModal.value = false;
};
</script>

<template>
  <div class="video-list-card">
    <h3 class="list-title">#{{ keyword }} 各平台相关内容</h3>

    <!-- <div class="info-tooltips">
      <div class="tooltip-item">
        <div class="tooltip-icon">🤖</div>
        <div class="tooltip-content">
          <h4>视频内容AI总结</h4>
          <p>通过多模态大模型分析视频内容：</p>
          <ul>
            <li>智能识别视频画面重点内容</li>
            <li>语音转文字处理视频语音</li>
            <li>提取关键观点和论述</li>
            <li>生成简洁精准的内容摘要</li>
          </ul>
        </div>
      </div>
      <div class="tooltip-item">
        <div class="tooltip-icon">📈</div>
        <div class="tooltip-content">
          <h4>博主情感分析</h4>
          <p>
            通过深度学习模型分析视频内容、字幕和评论，得出博主对话题的情感倾向：
          </p>
          <ul>
            <li>
              <div class="sentiment-range">
                <span class="tag-positive">正面</span>
                <span class="range-text">情感分数 > 30</span>
              </div>
            </li>
            <li>
              <div class="sentiment-range">
                <span class="tag-neutral">中立</span>
                <span class="range-text">-30 ≤ 情感分数 ≤ 30</span>
              </div>
            </li>
            <li>
              <div class="sentiment-range">
                <span class="tag-negative">负面</span>
                <span class="range-text">情感分数 < -30</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="tooltip-item">
        <div class="tooltip-icon">🎯</div>
        <div class="tooltip-content">
          <h4>舆论反制视频（预览版）</h4>
          <p>系统会针对负面视频自动生成反制内容：</p>
          <ul>
            <li>智能剪辑正面素材</li>
            <li>生成有力反驳论据</li>
            <li>优化传播效果</li>
            <li>后续会接入NIO域知识库</li>
          </ul>
        </div>
      </div>
    </div> -->

    <table>
      <thead>
        <tr>
          <th style="width: 10%">视频/笔记封面</th>
          <th style="width: 20%">视频/笔记信息</th>
          <th style="width: 10%">数据分析</th>
          <th style="width: 20%">内容摘要</th>
          <th style="width: 10%">情感分析</th>
          <th style="width: 10%">风险/机会分</th>
          <th style="width: 10%">风险/机会等级</th>
          <th style="width: 10%">事件详情</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="video in videoList" :key="video.id">
          <td class="video-cover" @click="$router.push({ name: 'RiskBoard' })">
            <img
              :src="video.cover_url"
              :alt="video.title"
              class="cover-image"
            />
          </td>
          <td class="video-info">
            <div
              class="video-title"
              @click="$router.push({ name: 'RiskBoard' })"
            >
              {{ video.title }}
            </div>
            <div class="video-meta">
              <span class="author"
                >@{{
                  video.platform === "douyin"
                    ? "抖音"
                    : video.platform === "xiaohongshu"
                    ? "小红书"
                    : video.platform === "weibo"
                    ? "微博"
                    : "其他平台"
                }}</span
              >
              <!-- <span class="date">{{ video.created_at }}</span> -->
            </div>
          </td>
          <td class="video-stats">
            <div class="stat-group">
              <div class="stat-item">
                <span class="stat-number">{{
                  formatNumber(video.like_count)
                }}</span>
                <span class="stat-label">点赞</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{
                  formatNumber(video.comment_count)
                }}</span>
                <span class="stat-label">评论</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{
                  video.platform === "xiaohongshu"
                    ? "-"
                    : formatNumber(video.share_count)
                }}</span>
                <span class="stat-label">分享</span>
              </div>
            </div>
          </td>
          <td class="video-summary">{{ video.summary }}</td>
          <td class="sentiment-analysis">
            <div
              class="sentiment-score"
              :class="getSentimentColor(video.sentiment_score)"
            >
              {{ video.sentiment_score > 0 ? "+" : ""
              }}{{ video.sentiment_score }}
            </div>
            <div
              class="sentiment-badge"
              :class="getSentimentColor(video.sentiment_score)"
            >
              {{ getSentimentLabel(video.sentiment_score) }}
            </div>
          </td>
          <td class="or-score">{{ video.poos_score || video.pors_score }}</td>
          <td class="or-rank" :class="`or-rank--${getRankClass(video.orRank)}`">
            {{ video.orRank }}
          </td>
          <td class="counter-video">
            <!-- <button

             
              v-if="video.sentiment_score < -30"
              class="counter-btn negative"
              @click="handleCounterVideo(video)"
            >
              <span class="btn-text">生成反制</span>
            </button>
            <button
              v-else-if="video.sentiment_score < 0"
              class="counter-btn neutral"
              @click="handleOptimizeVideo(video)"
            >
              <span class="btn-text">优化建议</span>
            </button>
            <button
              v-else
              class="counter-btn positive"
              @click="handleEnhanceVideo(video)"
            >
              <span class="btn-text">传播加强</span>
            </button> -->
            <div class="action-section">
              <button
                class="detail-btn"
                @click="$router.push({ name: 'RiskBoard' })"
              >
                查看详情
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <VideoProcessModal
      :show="showModal"
      :type="modalType"
      @close="showModal = false"
      @request-pipeline="handlePipelineRequest"
    />
  </div>
</template>

<style scoped>
.video-list-card {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 20px;
}

th {
  text-align: center;
  padding: 12px;
  border-bottom: 1px solid #333;
  color: #888;
  font-weight: normal;
}

td {
  text-align: center;
  padding: 16px 12px;
  border-bottom: 1px solid #222;
  vertical-align: middle;
}

.video-cover {
  width: 120px;
}

.cover-image {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 8px;
  object-fit: cover;
}

.video-title {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-meta {
  margin-top: 8px;
  font-size: 0.9em;
  color: #666;
}

.video-stats {
  padding: 16px 0;
  height: 100%;
}

.stat-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.stat-number {
  color: #fff;
  font-weight: 500;
  min-width: 50px;
  text-align: right;
}

.stat-label {
  color: #666;
  font-size: 0.9em;
  min-width: 30px;
}

.video-summary {
  font-size: 0.9em;
  line-height: 1.5;
  color: #bbb;
  display: -webkit-box; /* 启用多行截断 */
  -webkit-line-clamp: 3; /* 限制为 2 行（可根据需求调整） */
  -webkit-box-orient: vertical; /* 垂直方向排列 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 用...替代超出部分 */
  max-width: 30ch; /* 限制宽度为 30 个中文字符 */
}

.sentiment-analysis {
  text-align: left;
}

.sentiment-score,
.or-score {
  font-size: 24px;
  font-weight: 600;
  font-family: "Monaco", "Menlo", monospace;
  margin-bottom: 8px;
  text-align: center;
  color: #fff;
}
.or-rank {
  font-size: 16px;
  font-weight: 500;
  font-family: "Monaco", "Menlo", monospace;
  text-align: center;
}
.or-rank--red {
  color: #ff0000;
} /* 红色预警 */
.or-rank--orange {
  color: #ffa500;
} /* 橙色预警 */
.or-rank--yellow {
  color: #ffff00;
} /* 黄色预警 */
.or-rank--blue {
  color: #4b86df;
} /* 蓝色预警 */

/* 机会级别颜色 */
.or-rank--diamond {
  color: #00bfff;
} /* 钻石级机会（浅蓝） */
.or-rank--gold {
  color: #ffd700;
} /* 黄金级机会（金黄） */
.or-rank--silver {
  color: #c0c0c0;
} /* 白银级机会（银白） */
.or-rank--bronze {
  color: #cd7f32;
}
.sentiment-score.positive {
  color: #1ce783;
}

.sentiment-score.negative {
  color: #ff4d4d;
}

.sentiment-score.neutral {
  color: #888;
}

.sentiment-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9em;
  margin-bottom: 6px;
  text-align: center;
}

.sentiment-badge.positive {
  background: rgba(0, 255, 0, 0.1);
  color: #4caf50;
}

.sentiment-badge.negative {
  background: rgba(255, 0, 0, 0.1);
  color: #f44336;
}

.sentiment-badge.neutral {
  background: rgba(255, 255, 255, 0.1);
  color: #888;
}

.counter-btn {
  position: relative;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 500;
  letter-spacing: 0.5px;
  width: 100%;
  background: transparent;
  overflow: hidden;
  transition: all 0.3s ease;
}

.counter-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  border-radius: 4px;
  z-index: 1;
}

.counter-btn::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transform: rotate(45deg);
  transition: all 0.6s ease;
  z-index: 2;
}

.btn-text {
  position: relative;
  z-index: 3;
}

.counter-btn.negative {
  background: linear-gradient(135deg, #ff4444 0%, #aa1111 100%);
  box-shadow: 0 0 20px rgba(255, 68, 68, 0.3);
  border: 1px solid rgba(255, 68, 68, 0.3);
}

.counter-btn.neutral {
  background: linear-gradient(135deg, #666666 0%, #333333 100%);
  box-shadow: 0 0 20px rgba(102, 102, 102, 0.3);
  border: 1px solid rgba(102, 102, 102, 0.3);
}

.counter-btn.positive {
  background: linear-gradient(135deg, #40c057 0%, #2b7a39 100%);
  box-shadow: 0 0 20px rgba(64, 192, 87, 0.3);
  border: 1px solid rgba(64, 192, 87, 0.3);
}

.counter-btn:hover {
  transform: translateY(-2px);
}

.counter-btn:hover::after {
  top: -100%;
  left: -100%;
}

.counter-btn.negative:hover {
  box-shadow: 0 0 30px rgba(255, 68, 68, 0.5);
}

.counter-btn.neutral:hover {
  box-shadow: 0 0 30px rgba(102, 102, 102, 0.5);
}

.counter-btn.positive:hover {
  box-shadow: 0 0 30px rgba(64, 192, 87, 0.5);
}

/* 添加按钮文字样式 */
.btn-text {
  color: white;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.info-tooltips {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.tooltip-item {
  display: flex;
  gap: 1rem;
  max-width: 400px;
}

.tooltip-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.tooltip-content {
  flex: 1;
}

.tooltip-content h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.tooltip-content p {
  margin: 0 0 0.5rem 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
}

.tooltip-content ul {
  margin: 0;
  padding-left: 1.2rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.8;
}

.tooltip-content li {
  margin: 0.4rem 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tooltip-content .tag-positive,
.tooltip-content .tag-neutral,
.tooltip-content .tag-negative {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  margin-right: 8px;
}

.tooltip-content .tag-positive {
  background: rgba(64, 192, 87, 0.1);
  color: #40c057;
  border: 1px solid rgba(64, 192, 87, 0.2);
}

.tooltip-content .tag-neutral {
  background: rgba(255, 255, 255, 0.1);
  color: #888;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tooltip-content .tag-negative {
  background: rgba(255, 68, 68, 0.1);
  color: #ff4444;
  border: 1px solid rgba(255, 68, 68, 0.2);
}

/* 悬停效果 */
.stat-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.stat-item:hover .stat-number {
  color: #fff;
  transform: scale(1.05);
}

.stat-item:hover .stat-label {
  color: #888;
}
.detail-btn {
  padding: 8px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.detail-btn:hover {
  background-color: #1565c0;
}

.detail-btn:active {
  background-color: #0d47a1;
}
</style>
