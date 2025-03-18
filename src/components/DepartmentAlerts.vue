<template>
  <div class="department-alerts">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">产品部门告警</h5>
        <div>
          <button class="btn btn-outline-primary btn-sm" @click="exportData">导出数据</button>
        </div>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>部门</th>
                <th>产品</th>
                <th>时间</th>
                <th>级别</th>
                <th>告警内容</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="alert in departmentAlerts" :key="alert.id">
                <td>{{ alert.department }}</td>
                <td>{{ alert.product }}</td>
                <td>{{ alert.time }}</td>
                <td>
                  <span :class="'badge bg-' + alert.levelClass">{{ alert.level }}</span>
                </td>
                <td>{{ alert.content }}</td>
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
const departmentAlerts = ref([
  {
    id: 1,
    department: '技术部',
    product: '用户中心',
    time: '2024-01-20 10:30',
    level: '严重',
    levelClass: 'danger',
    content: 'API响应时间超过3秒',
    status: '未处理'
  },
  {
    id: 2,
    department: '技术部',
    product: '订单系统',
    time: '2024-01-20 09:15',
    level: '警告',
    levelClass: 'warning',
    content: '数据库连接数过高',
    status: '处理中'
  },
  {
    id: 3,
    department: '运维部',
    product: '监控平台',
    time: '2024-01-20 11:20',
    level: '严重',
    levelClass: 'danger',
    content: '服务器CPU使用率超过90%',
    status: '未处理'
  },
  {
    id: 4,
    department: '业务部',
    product: '支付系统',
    time: '2024-01-20 08:45',
    level: '信息',
    levelClass: 'info',
    content: '系统性能优化提醒',
    status: '已解决'
  },
  {
    id: 5,
    department: '运维部',
    product: '日志系统',
    time: '2024-01-20 10:50',
    level: '警告',
    levelClass: 'warning',
    content: '磁盘空间使用率超过80%',
    status: '处理中'
  },
  {
    id: 6,
    department: '技术部',
    product: '消息队列',
    time: '2024-01-20 09:30',
    level: '严重',
    levelClass: 'danger',
    content: '消息堆积超过阈值',
    status: '未处理'
  },
  {
    id: 7,
    department: '业务部',
    product: '会员系统',
    time: '2024-01-20 11:00',
    level: '信息',
    levelClass: 'info',
    content: '会员注册量异常波动',
    status: '已解决'
  },
  {
    id: 8,
    department: '运维部',
    product: '容器平台',
    time: '2024-01-20 10:15',
    level: '警告',
    levelClass: 'warning',
    content: '节点资源不足预警',
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