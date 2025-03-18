<template>
  <div class="analysis">
    <!-- 时间范围选择 -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <select class="form-select" v-model="timeRange">
              <option value="today">今日</option>
              <option value="week">本周</option>
              <option value="month">本月</option>
              <option value="custom">自定义</option>
            </select>
          </div>
          <div class="col-md-6" v-if="timeRange === 'custom'">
            <div class="input-group">
              <input type="date" class="form-control" v-model="startDate">
              <span class="input-group-text">至</span>
              <input type="date" class="form-control" v-model="endDate">
            </div>
          </div>
          <div class="col-md-2">
            <button class="btn btn-primary w-100" @click="refreshData">刷新数据</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计图表 -->
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">告警趋势</h5>
          </div>
          <div class="card-body">
            <div ref="trendChart" style="height: 300px"></div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">告警分布</h5>
          </div>
          <div class="card-body">
            <div ref="distributionChart" style="height: 300px"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计数据 -->
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Top 10告警源</h5>
            <button class="btn btn-sm btn-outline-primary" @click="exportTopSources">导出</button>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>告警源</th>
                    <th>告警次数</th>
                    <th>占比</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="source in topSources" :key="source.name">
                    <td>{{ source.name }}</td>
                    <td>{{ source.count }}</td>
                    <td>{{ source.percentage }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">告警处理统计</h5>
            <button class="btn btn-sm btn-outline-primary" @click="exportHandlingStats">导出</button>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>处理人</th>
                    <th>处理数量</th>
                    <th>平均处理时长</th>
                    <th>处理率</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="stat in handlingStats" :key="stat.handler">
                    <td>{{ stat.handler }}</td>
                    <td>{{ stat.count }}</td>
                    <td>{{ stat.avgTime }}</td>
                    <td>{{ stat.rate }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const timeRange = ref('today')
const startDate = ref('')
const endDate = ref('')

const trendChart = ref(null)
const distributionChart = ref(null)
let trendChartInstance = null
let distributionChartInstance = null

const topSources = ref([
  { name: '服务器A', count: 156, percentage: 23.5 },
  { name: '数据库B', count: 98, percentage: 14.8 },
  { name: '应用C', count: 87, percentage: 13.1 },
  { name: '服务器D', count: 76, percentage: 11.4 },
  { name: '网关E', count: 65, percentage: 9.8 }
])

const handlingStats = ref([
  { handler: '张三', count: 45, avgTime: '15分钟', rate: 98 },
  { handler: '李四', count: 38, avgTime: '20分钟', rate: 95 },
  { handler: '王五', count: 32, avgTime: '18分钟', rate: 96 },
  { handler: '赵六', count: 28, avgTime: '25分钟', rate: 92 }
])

const initCharts = () => {
  // 初始化趋势图
  trendChartInstance = echarts.init(trendChart.value)
  trendChartInstance.setOption({
    title: { text: '告警趋势分析' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['严重', '警告', '提示'] },
    xAxis: {
      type: 'category',
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '严重',
        type: 'line',
        data: [5, 8, 12, 6, 9, 4],
        itemStyle: { color: '#dc3545' }
      },
      {
        name: '警告',
        type: 'line',
        data: [8, 12, 15, 10, 13, 7],
        itemStyle: { color: '#ffc107' }
      },
      {
        name: '提示',
        type: 'line',
        data: [12, 15, 18, 14, 16, 10],
        itemStyle: { color: '#0dcaf0' }
      }
    ]
  })

  // 初始化分布图
  distributionChartInstance = echarts.init(distributionChart.value)
  distributionChartInstance.setOption({
    title: { text: '告警类型分布' },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: [
          { value: 35, name: 'CPU告警' },
          { value: 25, name: '内存告警' },
          { value: 20, name: '磁盘告警' },
          { value: 15, name: '网络告警' },
          { value: 5, name: '其他' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  })
}

const refreshData = () => {
  // 实现数据刷新逻辑
  console.log('刷新数据', { timeRange: timeRange.value, startDate: startDate.value, endDate: endDate.value })
}

const exportTopSources = () => {
  // 实现导出Top告警源数据的逻辑
  console.log('导出Top告警源数据')
}

const exportHandlingStats = () => {
  // 实现导出处理统计数据的逻辑
  console.log('导出处理统计数据')
}

// 监听窗口大小变化，调整图表大小
const handleResize = () => {
  trendChartInstance?.resize()
  distributionChartInstance?.resize()
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

watch(timeRange, (newValue) => {
  if (newValue === 'today') {
    startDate.value = ''
    endDate.value = ''
  }
  refreshData()
})
</script>

<style scoped>
.card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>