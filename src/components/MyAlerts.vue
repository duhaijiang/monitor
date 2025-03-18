<template>
  <div class="my-alerts">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">我的告警</h5>
        <div>
          <button class="btn btn-outline-primary btn-sm" @click="exportData">导出数据</button>
        </div>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>时间</th>
                <th>主机名</th>
                <th>IP地址</th>
                <th>应用ID</th>
                <th>级别</th>
                <th>告警内容</th>
                <th>负责人</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="alert in myAlerts" :key="alert.id">
                <td>{{ alert.time }}</td>
                <td>{{ alert.hostname }}</td>
                <td>{{ alert.ip }}</td>
                <td>{{ alert.appId }}</td>
                <td>
                  <span :class="'badge bg-' + alert.levelClass">{{ alert.level }}</span>
                </td>
                <td>{{ alert.content }}</td>
                <td>{{ alert.owner }}</td>
                <td>{{ alert.status }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-2" @click="handleAlert(alert.id)">处理</button>
                  <router-link :to="`/detail/${alert.id}`" class="btn btn-sm btn-outline-secondary">详情</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 模拟数据
const myAlerts = ref([
  {
    id: 1,
    time: '2023-07-20 10:30',
    hostname: 'web-server-01',
    ip: '192.168.1.100',
    appId: 'APP001',
    level: '严重',
    levelClass: 'danger',
    content: 'CPU使用率超过90%',
    owner: '张三',
    status: '未处理'
  },
  {
    id: 2,
    time: '2023-07-20 09:15',
    hostname: 'db-server-02',
    ip: '192.168.1.101',
    appId: 'APP002',
    level: '警告',
    levelClass: 'warning',
    content: '内存使用率超过80%',
    owner: '李四',
    status: '处理中'
  }
])

// 处理告警
const handleAlert = (id) => {
  // 实现告警处理逻辑
  console.log('处理告警:', id)
}

// 导出数据
const exportData = () => {
  // 实现数据导出逻辑
  console.log('导出数据')
}
</script>

<style scoped>
.badge {
  font-size: 0.9em;
  padding: 0.4em 0.6em;
}
</style>