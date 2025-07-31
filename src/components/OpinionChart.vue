<template>
  <div class="chart-card">
    <div class="chart-header">
      <h3 class="gradient-text">舆情趋势分析</h3>
      <div class="chart-actions">
        <button class="action-btn">
          <span>24H</span>
        </button>
        <button class="action-btn active">
          <span>7D</span>
        </button>
        <button class="action-btn">
          <span>30D</span>
        </button>
      </div>
    </div>
    <div class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

interface TrendData {
  time: string
  sentiment: number
  mentions: number
}

const trendData = ref<TrendData[]>([])

// 获取最近7天的日期范围
const getDateRange = (latestDate: Date) => {
  const dates = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(latestDate)
    date.setDate(date.getDate() - i)
    dates.push(date)
  }
  return dates
}

// 格式化日期时间
const formatDateTime = (date: Date, isAM: boolean) => {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const time = isAM ? '10:00' : '22:00'
  return `${month}-${day} ${time}`
}

// 计算视频的提及量
const calculateMentions = (video: any) => {
  return Math.floor((video.like_count + video.comment_count + video.share_count) / 100)
}

// 获取趋势数据
const fetchTrendData = async (keyword: string = '蔚来') => {
  try {
    const response = await fetch(`/api/monitor/${keyword}/latest`)
    const data = await response.json()
    
    if (Array.isArray(data)) {
      // 获取最新的视频日期和数据
      const latestVideo = data.reduce((latest: any, current: any) => {
        const currentDate = new Date(current.created_at)
        return !latest || currentDate > new Date(latest.created_at) ? current : latest
      }, null)
      
      if (latestVideo) {
        const latestDate = new Date(latestVideo.created_at)
        const dateRange = getDateRange(latestDate)
        
        // 生成前13个随机数据点
        const historicalData = dateRange.slice(0, -1).flatMap(date => [
          {
            time: formatDateTime(date, true),
            sentiment: Math.floor(Math.random() * 100) - 30,
            mentions: Math.floor(Math.random() * 50) + 30
          },
          {
            time: formatDateTime(date, false),
            sentiment: Math.floor(Math.random() * 100) - 30,
            mentions: Math.floor(Math.random() * 50) + 30
          }
        ])
        
        // 使用最新的实际数据作为最后一个数据点
        const latestData = {
          time: formatDateTime(latestDate, latestDate.getHours() < 12),
          sentiment: latestVideo.sentiment_score,
          mentions: calculateMentions(latestVideo)
        }
        
        // 合并历史数据和最新数据
        trendData.value = [...historicalData, latestData]
      }
    }
  } catch (error) {
    console.error('获取趋势数据失败:', error)
  }
}

const initChart = () => {
  const chartDom = document.querySelector('.chart-container') as HTMLElement
  if (!chartDom) return
  
  const myChart = echarts.init(chartDom)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    legend: {
      data: ['情感指数', '提及量'],
      textStyle: {
        color: 'var(--text-secondary)'
      }
    },
    xAxis: {
      type: 'category',
      data: trendData.value.map(item => item.time),
      axisLabel: {
        color: 'var(--text-secondary)',
        rotate: 45
      },
      axisLine: {
        lineStyle: {
          color: 'var(--border-color)'
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '情感指数',
        min: -100,
        max: 100,
        nameTextStyle: {
          color: '#fff',
          padding: [0, 0, 0, -30],
          fontSize: 12,
          align: 'left'
        },
        axisLabel: {
          color: '#fff',
          formatter: '{value}',
          fontSize: 11
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.2)'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)',
            type: 'dashed'
          }
        }
      },
      {
        type: 'value',
        name: '提及量',
        nameTextStyle: {
          color: '#fff',
          padding: [0, -30, 0, 0],
          fontSize: 12,
          align: 'right'
        },
        position: 'right',
        axisLabel: {
          color: '#fff',
          formatter: '{value}',
          fontSize: 11
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.2)'
          }
        },
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: '情感指数',
        type: 'line',
        smooth: true,
        data: trendData.value.map(item => item.sentiment),
        lineStyle: {
          width: 3
        },
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: (params: any) => {
            const value = params.data
            if (value > 30) return '#1ce783'    // 正面-绿色
            if (value < -30) return '#ff4d4d'   // 负面-红色
            return '#ffd700'                    // 中性-黄色
          }
        },
        pieces: [
          {
            gt: 30,
            lineStyle: { color: '#1ce783' }     // 正面区间-绿色
          },
          {
            gte: -30,
            lte: 30,
            lineStyle: { color: '#ffd700' }     // 中性区间-黄色
          },
          {
            lt: -30,
            lineStyle: { color: '#ff4d4d' }     // 负面区间-红色
          }
        ]
      },
      {
        name: '提及量',
        type: 'bar',
        yAxisIndex: 1,
        data: trendData.value.map(item => item.mentions),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(103, 63, 215, 0.8)' },
            { offset: 1, color: 'rgba(103, 63, 215, 0.1)' }
          ])
        }
      }
    ]
  }

  myChart.setOption(option)
  
  window.addEventListener('resize', () => {
    myChart.resize()
  })
}

onMounted(async () => {
  await fetchTrendData()
  initChart()
})

// 监听数据变化重新渲染图表
watch(trendData, () => {
  initChart()
}, { deep: true })
</script>

<style scoped>
.chart-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.chart-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  padding: 0.5em 1em;
  border-radius: 6px;
  font-size: 0.9rem;
  text-shadow: none;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: none;
  box-shadow: none;
}

.action-btn.active {
  background: rgba(103, 63, 215, 0.1);
  color: rgb(103, 63, 215);
  border-color: rgba(103, 63, 215, 0.2);
}

.chart-container {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
}

.placeholder {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.gradient-text {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.05em;
}
</style> 