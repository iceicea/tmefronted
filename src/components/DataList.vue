<template>
  <div class="data-list">
    <div class="list-header">
      <h2>数据监控列表</h2>
      <div class="total-count">共 {{ filteredDataList.length }} 条数据</div>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-section">
      <div class="filter-row">
        <!-- 1. 视频信息搜索 -->
        <div class="filter-item">
          <label>视频信息：</label>
          <input 
            v-model="filters.title"
            type="text"
            placeholder="搜索标题关键词"
            class="filter-input"
          />
        </div>

        <!-- 2. 风险/机会选择 -->
        <div class="filter-item">
          <label>类型：</label>
          <select v-model="filters.trackType" class="filter-select" @change="onTrackTypeChange">
            <option value="">全部</option>
            <option value="risk">风险</option>
            <option value="opportunity">机会</option>
          </select>
        </div>

        <!-- 3. 等级选择 -->
        <div class="filter-item">
          <label>等级：</label>
          <select v-model="filters.level" class="filter-select" :disabled="!filters.trackType">
            <option value="">全部等级</option>
            <template v-if="filters.trackType === 'risk'">
              <option value="red">红色预警</option>
              <option value="orange">橙色预警</option>
              <option value="yellow">黄色预警</option>
              <option value="blue">蓝色预警</option>
            </template>
            <template v-if="filters.trackType === 'opportunity'">
              <option value="diamond">钻石机会</option>
              <option value="gold">黄金机会</option>
              <option value="silver">白银机会</option>
              <option value="bronze">青铜机会</option>
            </template>
          </select>
        </div>

        <!-- 4. 发布媒体选择 -->
        <div class="filter-item">
          <label>发布媒体：</label>
          <select v-model="filters.platform" class="filter-select">
            <option value="">全部媒体</option>
            <option value="xiaohongshu">小红书</option>
            <option value="douyin">抖音</option>
          </select>
        </div>

        <!-- 搜索按钮 -->
        <div class="filter-item">
          <button class="search-btn" @click="applyFilters">
            搜索
          </button>
          <button class="reset-btn" @click="resetFilters">
            重置
          </button>
        </div>
      </div>
    </div>
    
    <div class="list-container">
      <div 
        v-for="item in filteredDataList" 
        :key="item.id" 
        class="list-item"
      >
        <!-- 1. 封面图片 -->
        <div class="cover-section">
          <img 
            :src="item.cover_url" 
            :alt="item.title"
            class="cover-image"
            @error="handleImageError"
          />
        </div>

        <!-- 2. 视频信息 -->
        <div class="video-info-section">
          <div class="title">{{ getTitle(item) || '未提供标题' }}</div>
          <div class="content">{{ getPlatform(item.platform) || '未提供内容' }}</div>
        </div>

        <!-- 3. 互动数据 -->
        <div class="interaction-section">
          <div class="interaction-item">
            <span class="label">点赞：</span>
            <span class="value">{{ formatNumber(item.like_count) }}</span>
          </div>
          <div class="interaction-item">
            <span class="label">评论：</span>
            <span class="value">{{ formatNumber(item.comment_count) }}</span>
          </div>
          <div class="interaction-item">
            <span class="label">分享：</span>
            <span class="value">{{ formatNumber(item.share_count) }}</span>
          </div>
        </div>

        <!-- 4. 内容摘要 -->
        <div class="summary-section">
          <div class="summary-label">内容摘要：</div>
          <div class="summary-content">{{ item.summary }}</div>
        </div>

        <!-- 5. 情感分析 -->
        <div class="sentiment-section">
          <div class="sentiment-label">情感分析：</div>
          <div class="sentiment-score" :class="getSentimentClass(item.sentiment_score)">
            {{ item.sentiment_score }}分
          </div>
        </div>

        <!-- 6. 风险机会分 -->
        <div class="risk-opportunity-section">
          <div class="score-label">{{ item.track_type === 'risk' ? '风险分' : '机会分' }}：</div>
          <div class="score-value">
            {{ getRiskOpportunityScore(item) }}分
          </div>
        </div>

        <!-- 7. 风险机会等级 -->
        <div class="level-section">
          <div class="level-badge" :class="getLevelClass(item)">
            {{ getLevelText(item) }}
          </div>
        </div>

        <!-- 8. 查看详情按钮 -->
        <div class="action-section">
          <button 
            class="detail-btn"
            @click="handleDetailClick(item)"
          >
            查看详情
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { data } from '../data/data.js'
import router from '../router/index.js'

const dataList = ref([])

// 筛选条件
const filters = ref({
  title: '',
  trackType: '',
  level: '',
  platform: ''
})

// 是否已应用筛选
const isFilterApplied = ref(false)

onMounted(() => {
    //此处调用api获取后端数据
   fetchDataList();
//  dataList.value = data;
//  console.log('onMounted', fetchDataList());
 dataList.value = fetchDataList();
})

// 计算筛选后的数据列表
const filteredDataList = computed(() => {
  if (!isFilterApplied.value) {
    return dataList.value
  }

  return dataList.value.filter(item => {
    // 1. 标题筛选
    if (filters.value.title) {
      const title = item.title || ''
      if (!title.toLowerCase().includes(filters.value.title.toLowerCase())) {
        return false
      }
    }

    // 2. 类型筛选
    if (filters.value.trackType && item.track_type !== filters.value.trackType) {
      return false
    }

    // 3. 等级筛选
    if (filters.value.level) {
      const itemLevel = getItemLevel(item)
      if (itemLevel !== filters.value.level) {
        return false
      }
    }

    // 4. 平台筛选
    if (filters.value.platform && item.platform !== filters.value.platform) {
      return false
    }

    return true
  })
})

// 获取数据项的等级
const getItemLevel = (item) => {
  const score = getRiskOpportunityScore(item)
  
  if (item.track_type === 'risk') {
    if (score > 75) return 'red'
    if (score >= 50) return 'orange'
    if (score >= 30) return 'yellow'
    return 'blue'
  } else {
    if (score > 75) return 'diamond'
    if (score >= 50) return 'gold'
    if (score >= 30) return 'silver'
    return 'bronze'
  }
}

// 格式化数字
const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}

// 获取风险机会分数
const getRiskOpportunityScore = (item) => {
  if (item.track_type === 'risk') {
    return item.pors_score || 0
  } else {
    return item.poos_score || 0
  }
}

// 获取情感分析样式类
const getSentimentClass = (score) => {
  if (score >= 70) return 'sentiment-positive'
  if (score >= 30) return 'sentiment-neutral'
  return 'sentiment-negative'
}

// 获取等级样式类
const getLevelClass = (item) => {
  const score = getRiskOpportunityScore(item)
  
  if (item.track_type === 'risk') {
    if (score > 75) return 'level-red'
    if (score >= 50) return 'level-orange'
    if (score >= 30) return 'level-yellow'
    return 'level-blue'
  } else {
    if (score > 75) return 'level-diamond'
    if (score >= 50) return 'level-gold'
    if (score >= 30) return 'level-silver'
    return 'level-bronze'
  }
}

// 获取等级文本
const getLevelText = (item) => {
  const score = getRiskOpportunityScore(item)
  
  if (item.track_type === 'risk') {
    if (score > 75) return '红色预警'
    if (score >= 50) return '橙色预警'
    if (score >= 30) return '黄色预警'
    return '蓝色预警'
  } else {
    if (score > 75) return '钻石机会'
    if (score >= 50) return '黄金机会'
    if (score >= 30) return '白银机会'
    return '青铜机会'
  }
}

// 图片错误处理
const handleImageError = (event) => {
  event.target.src = '/public/ourlogo.png' // 使用默认图片
}

// 当类型改变时重置等级选择
const onTrackTypeChange = () => {
  filters.value.level = ''
}

// 应用筛选
const applyFilters = () => {
  isFilterApplied.value = true
}

// 重置筛选
const resetFilters = () => {
  filters.value = {
    title: '',
    trackType: '',
    level: '',
    platform: ''
  }
  isFilterApplied.value = false
}

// 查看详情
const viewDetail = (item) => {
  console.log('查看详情:', item)
  // 这里未来可以实现跳转页面的逻辑
  alert(`查看 ${item.title} 的详情（功能开发中）`)
}

const fetchDataList = async () => {
  try {
    const response = await fetch(`/api/monitor/Q音/latest`);
    const data = await response.json();
    dataList.value = data;
    console.log(data);
    return data;
  } catch (error) {
    console.error("获取视频列表失败:", error);
  }
};

const getPlatform = (value) => {
  if (value === 'douyin') {
    return '抖音';
  } else if (value === 'xiaohongshu') {
    return '小红书';
  }
}

const getTitle =(item)=>{
    if(!item.title){
        console.log('判断为null');
        return item.content;
    }else{
        return item.title;
    }
}

const handleDetailClick = (item) => {
  console.log('查看详情:', item)
  
  // 将数据存储到 sessionStorage
  sessionStorage.setItem('riskBoardData', JSON.stringify(item))
  
  // 跳转到详情页
  router.push({
    name: 'RiskBoard'
  })
}
</script>

<style scoped>
.data-list {
  padding: 20px;
  background-color: rgb(10, 10, 11);
  min-height: 100vh;
  color: #e0e0e0;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.list-header h2 {
  color: #f0f0f0;
  margin: 0;
}

.total-count {
  color: #b0b0b0;
  font-size: 14px;
}

/* 筛选条件样式 */
.filter-section {
  background: rgb(20, 21, 25);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: end;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 150px;
}

.filter-item label {
  font-size: 14px;
  font-weight: 500;
  color: #e0e0e0;
}

.filter-input,
.filter-select {
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 14px;
  background: rgba(30, 30, 35, 0.8);
  color: #e0e0e0;
  transition: border-color 0.3s ease;
}

.filter-input::placeholder {
  color: #888;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #42a5f5;
  background: rgba(40, 40, 45, 0.9);
}

.filter-select:disabled {
  background-color: rgba(20, 20, 25, 0.5);
  color: #666;
  cursor: not-allowed;
  border-color: rgba(255, 255, 255, 0.1);
}

.search-btn,
.reset-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 10px;
}

.search-btn {
  background-color: #1976d2;
  color: white;
}

.search-btn:hover {
  background-color: #1565c0;
}

.reset-btn {
  background-color: rgba(60, 60, 65, 0.8);
  color: #e0e0e0;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.reset-btn:hover {
  background-color: rgba(80, 80, 85, 0.9);
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.list-item {
  display: grid;
  grid-template-columns: 120px 2fr 1fr 3fr 100px 100px 120px 100px;
  gap: 15px;
  align-items: center;
  background: rgb(20, 21, 25);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  transition: box-shadow 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.list-item:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.4);
  border-color: rgba(255, 255, 255, 0.15);
}

/* 封面图片 */
.cover-section {
  display: flex;
  justify-content: center;
}

.cover-image {
  width: 100px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 视频信息 */
.video-info-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.title {
  font-weight: 600;
  color: #f0f0f0;
  font-size: 14px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.content {
  color: #b0b0b0;
  font-size: 12px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 互动数据 */
.interaction-section {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.interaction-item {
  display: flex;
  align-items: center;
  font-size: 12px;
}

.interaction-item .label {
  color: #999;
  min-width: 35px;
}

.interaction-item .value {
  color: #e0e0e0;
  font-weight: 500;
}

/* 内容摘要 */
.summary-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.summary-label {
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

.summary-content {
  font-size: 13px;
  color: #c0c0c0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 情感分析 */
.sentiment-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.sentiment-label {
  font-size: 12px;
  color: #999;
}

.sentiment-score {
  font-weight: 600;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
}

.sentiment-positive {
  background-color: rgba(46, 125, 50, 0.2);
  color: #81c784;
  border: 1px solid rgba(129, 199, 132, 0.3);
}

.sentiment-neutral {
  background-color: rgba(245, 124, 0, 0.2);
  color: #ffb74d;
  border: 1px solid rgba(255, 183, 77, 0.3);
}

.sentiment-negative {
  background-color: rgba(211, 47, 47, 0.2);
  color: #e57373;
  border: 1px solid rgba(229, 115, 115, 0.3);
}

/* 风险机会分 */
.risk-opportunity-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.score-label {
  font-size: 12px;
  color: #999;
}

.score-value {
  font-weight: 600;
  font-size: 14px;
  color: #e0e0e0;
}

/* 等级标识 */
.level-section {
  display: flex;
  justify-content: center;
}

.level-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  min-width: 80px;
}

/* 风险等级颜色 */
.level-red {
  background-color: rgba(211, 47, 47, 0.2);
  color: #ef5350;
  border: 1px solid #ef5350;
}

.level-orange {
  background-color: rgba(245, 124, 0, 0.2);
  color: #ff9800;
  border: 1px solid #ff9800;
}

.level-yellow {
  background-color: rgba(249, 168, 37, 0.2);
  color: #ffc107;
  border: 1px solid #ffc107;
}

.level-blue {
  background-color: rgba(25, 118, 210, 0.2);
  color: #42a5f5;
  border: 1px solid #42a5f5;
}

/* 机会等级颜色 */
.level-diamond {
  background-color: rgba(123, 31, 162, 0.2);
  color: #ba68c8;
  border: 1px solid #ba68c8;
}

.level-gold {
  background-color: rgba(239, 108, 0, 0.2);
  color: #ffb300;
  border: 1px solid #ffb300;
}

.level-silver {
  background-color: rgba(97, 97, 97, 0.2);
  color: #bdbdbd;
  border: 1px solid #bdbdbd;
}

.level-bronze {
  background-color: rgba(93, 64, 55, 0.2);
  color: #a1887f;
  border: 1px solid #a1887f;
}

/* 查看详情按钮 */
.action-section {
  display: flex;
  justify-content: center;
}

.detail-btn {
  padding: 8px 16px;
  background-color: #42a5f5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: background-color 0.3s ease;
  border: 1px solid rgba(66, 165, 245, 0.3);
}

.detail-btn:hover {
  background-color: #1e88e5;
  border-color: rgba(30, 136, 229, 0.5);
}

.detail-btn:active {
  background-color: #1565c0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .list-item {
    grid-template-columns: 100px 2fr 1fr 2fr 80px 80px 100px 80px;
    gap: 10px;
    font-size: 12px;
  }

  .filter-row {
    gap: 15px;
  }

  .filter-item {
    min-width: 120px;
  }
}

@media (max-width: 768px) {
  .list-item {
    grid-template-columns: 1fr;
    gap: 10px;
    text-align: center;
  }
  
  .interaction-section,
  .sentiment-section,
  .risk-opportunity-section {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  .filter-row {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .filter-item {
    min-width: auto;
    width: 100%;
  }

  .filter-item:last-child {
    flex-direction: row;
    gap: 10px;
    justify-content: center;
  }

  .search-btn,
  .reset-btn {
    flex: 1;
    margin: 0;
  }
}
</style>
