<template>
  <div class="dashboard">
    <!-- 告警概览卡片 -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card status-card">
          <h3 class="text-primary">{{ totalAlerts }}</h3>
          <p class="text-muted mb-0">总告警数</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card status-card">
          <h3 class="text-danger">{{ criticalAlerts }}</h3>
          <p class="text-muted mb-0">严重告警</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card status-card">
          <h3 class="text-warning">{{ warningAlerts }}</h3>
          <p class="text-muted mb-0">警告</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card status-card">
          <h3 class="text-success">{{ resolvedAlerts }}</h3>
          <p class="text-muted mb-0">已解决</p>
        </div>
      </div>
    </div>

    <!-- 业务维度监控 -->
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">服务器状态</h5>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between mb-3">
              <span>CPU告警</span>
              <span class="badge bg-danger">{{ serverMetrics.cpu }}个</span>
            </div>
            <div class="d-flex justify-content-between mb-3">
              <span>内存告警</span>
              <span class="badge bg-warning">{{ serverMetrics.memory }}个</span>
            </div>
            <div class="d-flex justify-content-between">
              <span>磁盘告警</span>
              <span class="badge bg-info">{{ serverMetrics.disk }}个</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">数据库状态</h5>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between mb-3">
              <span>连接数告警</span>
              <span class="badge bg-danger">{{ dbMetrics.connections }}个</span>
            </div>
            <div class="d-flex justify-content-between mb-3">
              <span>慢查询告警</span>
              <span class="badge bg-warning">{{ dbMetrics.slowQueries }}个</span>
            </div>
            <div class="d-flex justify-content-between">
              <span>复制延迟告警</span>
              <span class="badge bg-info">{{ dbMetrics.replication }}个</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">应用状态</h5>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between mb-3">
              <span>接口异常</span>
              <span class="badge bg-danger">{{ appMetrics.apiErrors }}个</span>
            </div>
            <div class="d-flex justify-content-between mb-3">
              <span>响应超时</span>
              <span class="badge bg-warning">{{ appMetrics.timeouts }}个</span>
            </div>
            <div class="d-flex justify-content-between">
              <span>业务异常</span>
              <span class="badge bg-info">{{ appMetrics.businessErrors }}个</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 告警趋势图 -->
    <div class="card mb-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">告警趋势</h5>
        <div class="btn-group">
          <button class="btn btn-outline-secondary btn-sm" @click="updateTimeRange('today')">今日</button>
          <button class="btn btn-outline-secondary btn-sm" @click="updateTimeRange('week')">本周</button>
          <button class="btn btn-outline-secondary btn-sm" @click="updateTimeRange('month')">本月</button>
        </div>
      </div>
      <div class="card-body">
        <div ref="trendChart" style="height: 300px;"></div>
      </div>
    </div>

    <!-- 产品告警TOP10 -->
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">产品告警TOP10</h5>
            <button class="btn btn-outline-primary btn-sm" @click="exportProductAlerts">导出</button>
          </div>
          <div class="card-body">
            <div ref="productAlertChart" style="height: 300px;"></div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">部门产品告警分布</h5>
            <button class="btn btn-outline-primary btn-sm" @click="exportDepartmentAlerts">导出</button>
          </div>
          <div class="card-body">
            <div ref="departmentChart" style="height: 300px;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最新告警列表 -->
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">最新告警</h5>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>时间</th>
                <th>级别</th>
                <th>告警内容</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="alert in latestAlerts" :key="alert.id">
                <td>{{ alert.time }}</td>
                <td>
                  <span :class="'badge bg-' + alert.levelClass">{{ alert.level }}</span>
                </td>
                <td>{{ alert.content }}</td>
                <td>{{ alert.status }}</td>
                <td>
                  <router-link :to="`/detail/${alert.id}`" class="btn btn-sm btn-outline-primary">查看</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- 值班信息卡片 -->
    <div class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0">值班信息</h5>
      </div>
      <div class="card-body">
        <div class="duty-info current-duty mb-4">
          <h6 class="text-primary">当前值班</h6>
          <div class="d-flex align-items-center mb-2">
            <i class="fas fa-user-clock me-2"></i>
            <span>值班人员：{{ currentDuty.name }}</span>
          </div>
          <div class="d-flex align-items-center mb-2">
            <i class="fas fa-phone-alt me-2"></i>
            <span>联系电话：{{ currentDuty.phone }}</span>
          </div>
          <div class="d-flex align-items-center">
            <i class="fas fa-calendar-alt me-2"></i>
            <span>值班时间：{{ currentDuty.startTime }} - {{ currentDuty.endTime }}</span>
          </div>
        </div>
        <div class="duty-info next-duty">
          <h6 class="text-info">下一班次</h6>
          <div class="d-flex align-items-center mb-2">
            <i class="fas fa-user me-2"></i>
            <span>值班人员：{{ nextDuty.name }}</span>
          </div>
          <div class="d-flex align-items-center mb-2">
            <i class="fas fa-phone-alt me-2"></i>
            <span>联系电话：{{ nextDuty.phone }}</span>
          </div>
          <div class="d-flex align-items-center">
            <i class="fas fa-calendar-alt me-2"></i>
            <span>值班时间：{{ nextDuty.startTime }} - {{ nextDuty.endTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

// 图表容器引用
const productAlertChart = ref(null)
const departmentChart = ref(null)
const trendChart = ref(null)

// 模拟数据
const totalAlerts = ref(156)
const criticalAlerts = ref(23)
const warningAlerts = ref(45)
const resolvedAlerts = ref(88)

// 业务维度监控数据
const serverMetrics = ref({
  cpu: 5,
  memory: 8,
  disk: 3
})

const dbMetrics = ref({
  connections: 3,
  slowQueries: 6,
  replication: 2
})

const appMetrics = ref({
  apiErrors: 12,
  timeouts: 8,
  businessErrors: 15
})

const latestAlerts = ref([
  {
    id: 1,
    time: '2024-01-20 10:30:25',
    level: '严重',
    levelClass: 'danger',
    content: 'CPU使用率超过90%',
    status: '未处理'
  },
  {
    id: 2,
    time: '2024-01-20 10:28:15',
    level: '警告',
    levelClass: 'warning',
    content: '内存使用率超过80%',
    status: '处理中'
  },
  {
    id: 3,
    time: '2024-01-20 10:25:30',
    level: '普通',
    levelClass: 'info',
    content: '磁盘使用率超过70%',
    status: '已解决'
  }
])

// 初始化趋势图
onMounted(() => {
  const chart = echarts.init(trendChart.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['严重告警', '警告', '普通']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '严重告警',
        type: 'line',
        stack: 'Total',
        data: [3, 5, 2, 8, 12, 6, 4, 3],
        itemStyle: {
          color: '#f44336'
        }
      },
      {
        name: '警告',
        type: 'line',
        stack: 'Total',
        data: [8, 12, 10, 15, 20, 18, 14, 10],
        itemStyle: {
          color: '#ff9800'
        }
      },
      {
        name: '普通',
        type: 'line',
        stack: 'Total',
        data: [15, 18, 14, 22, 25, 20, 18, 15],
        itemStyle: {
          color: '#2196f3'
        }
      }
    ]
  }
  chart.setOption(option)

  window.addEventListener('resize', () => {
    chart.resize()
  })
})

// 值班信息数据
const currentDuty = ref({
  name: '张三',
  phone: '13800138000',
  startTime: '2024-01-20 08:00',
  endTime: '2024-01-20 20:00'
})

const nextDuty = ref({
  name: '李四',
  phone: '13900139000',
  startTime: '2024-01-20 20:00',
  endTime: '2024-01-21 08:00'
})

// 产品告警TOP10数据
const productAlerts = ref([
  { name: '用户认证系统', count: 156 },
  { name: '订单管理平台', count: 128 },
  { name: '支付网关服务', count: 95 },
  { name: '库存管理系统', count: 87 },
  { name: '数据分析平台', count: 76 },
  { name: '消息推送服务', count: 65 },
  { name: '日志监控系统', count: 58 },
  { name: '商品管理系统', count: 47 },
  { name: '会员服务中心', count: 39 },
  { name: '搜索推荐系统', count: 32 }
])

// 部门产品告警分布数据
const departmentAlerts = ref([
  { name: '核心技术部', value: 285, children: [
    { name: '用户认证系统', value: 156 },
    { name: '支付网关服务', value: 95 },
    { name: '消息推送服务', value: 34 }
  ]},
  { name: '业务研发部', value: 215, children: [
    { name: '订单管理平台', value: 128 },
    { name: '商品管理系统', value: 47 },
    { name: '会员服务中心', value: 40 }
  ]},
  { name: '平台技术部', value: 163, children: [
    { name: '数据分析平台', value: 76 },
    { name: '日志监控系统', value: 58 },
    { name: '搜索推荐系统', value: 29 }
  ]},
  { name: '运维安全部', value: 87, children: [
    { name: '库存管理系统', value: 87 }
  ]}
])

// 初始化图表
onMounted(() => {
  // 初始化产品告警TOP10图表
  const productChart = echarts.init(productAlertChart.value)
  productChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      data: productAlerts.value.map(item => item.name),
      axisTick: { alignWithLabel: true }
    }],
    yAxis: [{ type: 'value' }],
    series: [{
      name: '告警数量',
      type: 'bar',
      barWidth: '60%',
      data: productAlerts.value.map(item => item.count)
    }]
  })

  // 初始化部门产品告警分布图表
  const departmentChart = echarts.init(departmentChart.value)
  departmentChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    },
    series: [{
      name: '部门产品告警',
      type: 'treemap',
      data: departmentAlerts.value,
      label: {
        show: true,
        formatter: '{b}\n{c}'
      }
    }]
  })

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    productChart.resize()
    departmentChart.resize()
  })
})

// 导出功能
const exportProductAlerts = () => {
  // 实现产品告警数据导出逻辑
  console.log('导出产品告警数据')
}

const exportDepartmentAlerts = () => {
  // 实现部门告警数据导出逻辑
  console.log('导出部门告警数据')
}

// 更新时间范围
const updateTimeRange = (range) => {
  // 根据选择的时间范围更新图表数据
  console.log('更新时间范围:', range)
}

</script>

<style scoped>
.status-card {
  text-align: center;
  padding: 1.5rem;
}

.status-card h3 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.badge {
  font-size: 0.8rem;
  padding: 0.4em 0.6em;
}
</style>