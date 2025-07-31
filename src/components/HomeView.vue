<script setup lang="ts">
import DashboardHeader from "./DashboardHeader.vue";
import TrendingStats from "./TrendingStats.vue";
import OpinionChart from "./OpinionChart.vue";
import MonitoringMap from "./MonitoringMap.vue";
</script>

<template>
  <div class="dashboard">
    <DashboardHeader />
    <main>
      <TrendingStats />
    </main>

    <footer class="powered-by">
      <div class="status">
        <span class="status-dot"></span>
        <span>Available</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: var(--bg-dark);
}

main {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.powered-by {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  opacity: 0.8;
  padding: 0.5rem 1rem;
  background: var(--bg-card);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.deepseek-logo {
  height: 1.2rem;
  width: auto;
}

.status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: #1ce783;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 8px rgba(28, 231, 131, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(28, 231, 131, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(28, 231, 131, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(28, 231, 131, 0);
  }
}
</style>
