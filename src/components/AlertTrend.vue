<template>
  <div class="alert-trend container mt-4">
    <div class="card mb-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">告警趋势</h5>
        <div class="d-flex gap-2">
          <select class="form-select form-select-sm" v-model="timeRange">
            <option value="1h">最近1小时</option>
            <option value="6h">最近6小时</option>
            <option value="24h">最近24小时</option>
            <option value="7d">最近7天</option>
          </select>
          <select class="form-select form-select-sm" v-model="alertType">
            <option value="all">全部类型</option>
            <option value="cpu">CPU告警</option>
            <option value="memory">内存告警</option>
            <option value="disk">磁盘告警</option>
          </select>
        </div>
      </div>
      <div class="card-body">
        <div class="trend-chart" style="height: 300px;"></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">告警列表</h5>
        <div class="d-flex gap-2">
          <select class="form-select form-select-sm" v-model="status">
            <option value="all">全部状态</option>
            <option value="pending">待处理</option>
            <option value="processing">处理中</option>
            <option value="resolved">已解决</option>
          </select>
          <div class="input-group input-group-sm">
            <input type="text" class="form-control" placeholder="搜索告警..." v-model="searchQuery">
            <button class="btn btn-primary" type="button">搜索</button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>告警ID</th>
                <th>告警内容</th>
                <th>告警级别</th>
                <th>状态</th>
                <th>时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="alert in alerts" :key="alert.id">
                <td>{{ alert.id }}</td>
                <td>{{ alert.content }}</td>
                <td>
                  <span :class="'badge bg-' + alert.levelClass">{{ alert.level }}</span>
                </td>
                <td>{{ alert.status }}</td>
                <td>{{ alert.time }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-2" @click="handleAlert(alert.id)">处理</button>
                  <router-link :to="`/alert/${alert.id}`" class="btn btn-sm btn-outline-secondary">详情</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlertTrend',
  data() {
    return {
      timeRange: '24h',
      alertType: 'all',
      status: 'all',
      searchQuery: '',
      alerts: [
        {
          id: 'ALT001',
          content: 'CPU使用率超过90%',
          level: '严重',
          levelClass: 'danger',
          status: '待处理',
          time: '2023-09-14 14:30'
        },
        {
          id: 'ALT002',
          content: '内存使用率超过85%',
          level: '警告',
          levelClass: 'warning',
          status: '处理中',
          time: '2023-09-14 14:25'
        }
      ]
    }
  },
  methods: {
    handleAlert(id) {
      // 处理告警的逻辑
      console.log('处理告警:', id)
    }
  },
  mounted() {
    // 在这里初始化趋势图
    // 可以使用 ECharts 等图表库
  }
}
</script>

<style scoped>
.trend-chart {
  background-color: #f8f9fa;
  border-radius: 4px;
}
.badge {
  font-size: 0.9em;
}
</style>