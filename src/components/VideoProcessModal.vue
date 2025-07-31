<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  type: 'counter' | 'optimize' | 'enhance'
  show: boolean
}>()

const emit = defineEmits(['close', 'request-pipeline'])

const getTitle = () => {
  switch (props.type) {
    case 'counter':
      return '生成反制视频'
    case 'optimize':
      return '优化建议'
    case 'enhance':
      return '传播加强'
  }
}

const getSteps = () => {
  const baseSteps = [
    {
      icon: '🎥',
      title: '原视频理解',
      desc: '通过多模态大模型分析原视频内容'
    },
    {
      icon: '📦',
      title: '素材收集',
      desc: '智能收集相关素材与资源'
    },
    {
      icon: '📝',
      title: '生成文案',
      desc: '基于原视频生成优化文案'
    },
    {
      icon: '📋',
      title: '视频脚本',
      desc: '结合文案和素材生成详细脚本'
    },
    {
      icon: '🎬',
      title: '渲染视频',
      desc: '根据脚本自动渲染最终视频'
    }
  ]

  switch (props.type) {
    case 'counter':
      return baseSteps.map(step => ({
        ...step,
        desc: step.desc + '，突出正面观点'
      }))
    case 'optimize':
      return baseSteps.map(step => ({
        ...step,
        desc: step.desc + '，优化传播效果'
      }))
    case 'enhance':
      return baseSteps.map(step => ({
        ...step,
        desc: step.desc + '，强化正面影响'
      }))
  }
}

const currentStep = ref(0)

const startProcess = () => {
  if (currentStep.value < getSteps().length - 1) {
    currentStep.value++
    setTimeout(startProcess, 800)
  }
}

const handleStart = () => {
  currentStep.value = 0
  startProcess()
  setTimeout(() => {
    emit('request-pipeline')
  }, getSteps().length * 800 + 200)
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ getTitle() }}</h3>
        <button class="close-btn" @click="emit('close')">×</button>
      </div>
      
      <div class="process-steps">
        <div 
          v-for="(step, index) in getSteps()" 
          :key="index"
          class="step"
          :class="{ 
            'active': index === currentStep,
            'completed': index < currentStep
          }"
        >
          <div class="step-icon">{{ step.icon }}</div>
          <div class="step-content">
            <h4>{{ step.title }}</h4>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <div class="notice">
          <p>注意：智能视频生产管线需要大量算力支持，目前处于内测阶段。您可以向管理员申请开通此功能。</p>
        </div>
        <button class="request-btn" @click="handleStart">
          向管理员申请启动视频渲染管线
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  border: 1px solid var(--border-color);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
}

.process-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.step.active {
  background: rgba(103, 63, 215, 0.1);
  border: 1px solid rgba(103, 63, 215, 0.3);
}

.step.completed {
  background: rgba(28, 231, 131, 0.1);
  border: 1px solid rgba(28, 231, 131, 0.3);
}

.step-icon {
  font-size: 1.5rem;
}

.step-content h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.step-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.modal-footer {
  margin-top: 2rem;
  text-align: center;
}

.notice {
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.notice p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.request-btn {
  background: var(--button-gradient);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.request-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(103, 63, 215, 0.4);
}
</style> 