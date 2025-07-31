<template>
  <div class="table-card">
    <h3 class="gradient-text">最新监测记录</h3>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th>平台</th>
            <th>关键词</th>
            <th>情感指数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in records" :key="index">
            <td>{{ record.time }}</td>
            <td>
              <span class="platform-tag">{{ record.platform }}</span>
            </td>
            <td>
              <span class="keyword-tag">#{{ record.keyword }}</span>
            </td>
            <td :class="record.sentiment > 0 ? 'positive' : 'negative'">
              {{ record.sentiment > 0 ? '+' : ''}}{{ record.sentiment }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

.table-container {
  margin-top: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  background: rgba(255, 255, 255, 0.02);
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td {
  font-size: 0.95rem;
}

tr:hover {
  background: rgba(255, 255, 255, 0.02);
}

.platform-tag {
  background: rgba(103, 63, 215, 0.1);
  color: rgb(103, 63, 215);
  padding: 0.25em 0.75em;
  border-radius: 4px;
  font-size: 0.9em;
}

.keyword-tag {
  color: var(--text-secondary);
  font-weight: 500;
}

.positive {
  color: #1ce783;
  font-weight: 600;
}

.negative {
  color: #ff4d4d;
  font-weight: 600;
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

<script setup lang="ts">
import { ref } from 'vue';

interface Record {
  time: string;
  platform: string;
  keyword: string;
  sentiment: number;
}

const records = ref<Record[]>([
  // 您的数据
]);
</script> 