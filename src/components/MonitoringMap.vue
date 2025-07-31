<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import type { GeoComponentOption } from 'echarts/types/dist/echarts'

// 使用在线地图数据
const MAP_URL = '/map-api/areas_v3/bound/100000_full.json'

interface LocationData {
  name: string
  value: [number, number]
  sentiment: number
  keyword: string
  platform: string
  time: string
}

const locationData = ref<LocationData[]>([
  {
    name: '北京',
    value: [116.405285, 39.904989],
    sentiment: 75,
    keyword: '蔚来',
    platform: '抖音',
    time: '2024-03-15 10:30'
  },
  {
    name: '上海',
    value: [121.472644, 31.231706],
    sentiment: -25,
    keyword: '蔚来',
    platform: '抖音',
    time: '2024-03-15 10:28'
  },
  {
    name: '广州',
    value: [113.280637, 23.125178],
    sentiment: 15,
    keyword: '蔚来',
    platform: '抖音',
    time: '2024-03-15 10:25'
  }
])

const chartInstance = ref<echarts.ECharts | null>(null)

const handleZoomIn = () => {
  if (!chartInstance.value) return
  const option = chartInstance.value.getOption()
  const geoOption = option.geo as GeoComponentOption[]
  if (!geoOption?.[0]?.zoom) return
  const zoom = geoOption[0].zoom as number
  chartInstance.value.setOption({
    geo: [{
      zoom: zoom * 1.5
    }]
  })
}

const handleZoomOut = () => {
  if (!chartInstance.value) return
  const option = chartInstance.value.getOption()
  const geoOption = option.geo as GeoComponentOption[]
  if (!geoOption?.[0]?.zoom) return
  const zoom = geoOption[0].zoom as number
  chartInstance.value.setOption({
    geo: [{
      zoom: zoom / 1.5
    }]
  })
}

const handleReset = () => {
  if (!chartInstance.value) return
  chartInstance.value.setOption({
    geo: [{
      zoom: 1.2,
      center: undefined
    }]
  })
}

const initChart = async () => {
  const chartDom = document.getElementById('monitoring-map')
  if (!chartDom) return
  
  const myChart = echarts.init(chartDom)
  chartInstance.value = myChart // 保存实例引用
  
  // 加载地图数据
  try {
    const response = await fetch(MAP_URL)
    const chinaJSON = await response.json()
    echarts.registerMap('china', chinaJSON)
    
    const getSentimentColor = (sentiment: number) => {
      if (sentiment > 30) return '#1ce783'
      if (sentiment < -30) return '#ff4d4d'
      return '#ffd700'
    }

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const data = params.data
          if (!data) return ''
          return `
            <div style="padding: 8px">
              <div style="margin-bottom: 8px">${data.name}</div>
              <div>平台：${data.platform}</div>
              <div>关键词：#${data.keyword}</div>
              <div>情感指数：${data.sentiment}</div>
              <div>时间：${data.time}</div>
            </div>
          `
        }
      },
      geo: {
        map: 'china',
        roam: true,
        zoom: 1.2,
        scaleLimit: {
          min: 1,
          max: 3
        },
        itemStyle: {
          areaColor: 'rgba(255, 255, 255, 0.05)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        },
        emphasis: {
          itemStyle: {
            areaColor: 'rgba(255, 255, 255, 0.1)'
          }
        }
      },
      series: [{
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: locationData.value,
        symbolSize: 12,
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        itemStyle: {
          color: (params: any) => getSentimentColor(params.data.sentiment)
        },
        emphasis: {
          scale: true
        }
      }]
    }

    myChart.setOption(option)
  } catch (error) {
    console.error('Failed to load map data:', error)
  }
  
  window.addEventListener('resize', () => {
    myChart.resize()
  })
}

onMounted(() => {
  initChart()
})
</script>

<template>
  <div class="map-card">
    <div class="map-header">
      <h3 class="gradient-text">舆情地理分布</h3>
      <div class="legend">
        <div class="legend-item">
          <span class="legend-dot positive"></span>
          <span class="legend-text">正面</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot neutral"></span>
          <span class="legend-text">中立</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot negative"></span>
          <span class="legend-text">负面</span>
        </div>
      </div>
    </div>
    <div class="map-container-wrapper">
      <div id="monitoring-map" class="map-container"></div>
      <div class="map-controls">
        <button class="control-btn" @click="handleZoomIn" title="放大">
          <span>+</span>
        </button>
        <button class="control-btn" @click="handleZoomOut" title="缩小">
          <span>−</span>
        </button>
        <button class="control-btn" @click="handleReset" title="重置">
          <span>⟲</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

.map-container-wrapper {
  position: relative;
  margin-top: 1.5rem;
}

.map-controls {
  position: absolute;
  right: 1rem;
  top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1;
  background: var(--bg-card);
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

.control-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.2rem;
  padding: 0;
}

.control-btn:hover {
  background: rgba(103, 63, 215, 0.1);
  color: rgb(103, 63, 215);
  border-color: rgba(103, 63, 215, 0.2);
}

.control-btn span {
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-container {
  height: 400px;
  margin-top: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
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

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.legend {
  display: flex;
  gap: 1.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-dot.positive {
  background: #1ce783;
  box-shadow: 0 0 8px rgba(28, 231, 131, 0.3);
}

.legend-dot.neutral {
  background: #ffd700;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
}

.legend-dot.negative {
  background: #ff4d4d;
  box-shadow: 0 0 8px rgba(255, 77, 77, 0.3);
}

.legend-text {
  font-size: 0.85rem;
  color: var(--text-secondary);
}
</style> 