<template>
  <header class="header">
    <div class="logo">
      <div class="logo-container">
        <img
          src="/ourlogo.png"
          alt="NOMS Logo"
          class="noms-logo"
          @click="handleLogoClick"
        />
        <h1 class="gradient-text">TME ALCHEMIST</h1>
        <span class="logo-divider">|</span>
        <span class="gradient-text">TME 炼金术士</span>
      </div>
      <div class="subtitle-container">
        <span class="animate-gradient"
          >TME's own AI native full chain public opinion intelligent perception
          platform
        </span>
        <span class="animate-gradient"
          >TME自己的AI原生全链路舆情智能感知平台</span
        >
      </div>
    </div>
    <nav class="header-actions">
      <button class="monitor-btn">
        <span class="btn-text">MONITORING</span>
        <span class="loading-icon">
          <svg viewBox="0 0 24 24" class="spinner">
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-dasharray="30 60"
            />
          </svg>
        </span>
      </button>
      <div class="powered-by">
        <span>Powered by</span>
        <img src="/deepseek-logo.svg" alt="DeepSeek" class="deepseek-logo" />
        <span>DeepSeek</span>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const handleLogoClick = () => {
  // 这里可以添加点击效果，比如回到首页
  console.log("Logo clicked!");
};
</script>

<style scoped>
.header {
  padding: 2rem;
  background: var(--bg-card);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 16px;
  margin: 1rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

.logo {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.gradient-text {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.75rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.05em;
}

.logo-divider {
  color: var(--text-secondary);
  font-size: 2.25rem;
  opacity: 0.4;
}

.subtitle-container {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.animate-gradient {
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0.7) 25%,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 255, 255, 0.7) 75%,
    rgba(255, 255, 255, 0.5) 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 8s linear infinite;
}

@keyframes shine {
  0% {
    background-position: 200% center;
  }
  100% {
    background-position: -200% center;
  }
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  letter-spacing: 0.05em;
}

.subtitle-cn {
  color: var(--text-secondary);
  font-size: 0.9rem;
  opacity: 0.8;
}

.monitor-btn {
  font-weight: 600;
  padding: 1em 3.5em;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
}

.btn-icon {
  font-size: 1.2em;
  transition: transform 0.2s;
}

.monitor-btn:hover .btn-icon {
  transform: translateX(4px);
}

.header-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
}

.powered-by {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  opacity: 0.8;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.deepseek-logo {
  height: 1.2rem;
  width: auto;
}

.noms-logo {
  height: 14rem;
  width: auto;
  object-fit: contain;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center bottom;
}

.noms-logo:hover {
  transform: translateY(-8px) scale(1.03);
  filter: brightness(1.1);
}

@keyframes shieldImpact {
  0% {
    transform: translateY(-8px) scale(1.03);
  }
  20% {
    transform: translateY(4px) scale(0.97);
  }
  40% {
    transform: translateY(4px) scale(0.97);
  }
  70% {
    transform: translateY(-2px) scale(1.01);
  }
  100% {
    transform: translateY(-8px) scale(1.03);
  }
}

.noms-logo:active {
  animation: shieldImpact 0.8s cubic-bezier(0.36, 0, 0.66, -0.56);
  transform-origin: center bottom;
}

.spinner {
  animation: spin 1s linear infinite;
  width: 1.2em;
  height: 1.2em;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
