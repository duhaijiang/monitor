<template>
  <div class="monitor">
    <!-- TOP未处理告警 -->
    <div class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0">TOP未处理告警</h5>
      </div>
      <div class="card-body">
        <div class="list-group">
          <div v-for="alert in topUnhandledAlerts" :key="alert.id" class="list-group-item">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <span :class="['badge', 'bg-' + alert.levelClass, 'me-2']">{{ alert.level }}</span>
                {{ alert.content }}
              </div>
              <small class="text-muted">{{ alert.time }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <div class="input-group">
              <input type="text" class="form-control" v-model="searchQuery" placeholder="搜索告警信息...">
              <button class="btn btn-primary" @click="search"><i class="fas fa-search"></i></button>
            </div>
          </div>
          <div class="col-md-6">
            <div class="btn-group">
              <button class="btn" :class="[filter === 'all' ? 'btn-primary' : 'btn-outline-primary']" @click="filter = 'all'">全部</button>
              <button class="btn" :class="[filter === 'critical' ? 'btn-primary' : 'btn-outline-primary']" @click="filter = 'critical'">严重</button>
              <button class="btn" :class="[filter === 'warning' ? 'btn-primary' : 'btn-outline-primary']" @click="filter = 'warning'">警告</button>
              <button class="btn" :class="[filter === 'normal' ? 'btn-primary' : 'btn-outline-primary']" @click="filter = 'normal'">普通</button>
            </div>
          </div>
          <div class="col-md-2">
            <button class="btn btn-outline-primary w-100" @click="showAdvancedFilter = true">高级筛选</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 告警列表 -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">告警列表</h5>
        <div>
          <button class="btn btn-outline-secondary btn-sm me-2" @click="handleBatchProcess">批量处理</button>
          <button class="btn btn-primary btn-sm" @click="exportData">导出数据</button>
        </div>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th><input type="checkbox" class="form-check-input" v-model="selectAll" @change="toggleSelectAll"></th>
                <th>工单号</th>
                <th>告警内容</th>
                <th>操作</th>
                <th @click="sort('level')" style="cursor: pointer">
                  告警级别
                  <i class="fas" :class="getSortIcon('level')"></i>
                </th>
                <th>资源类型</th>
                <th>来源</th>
                <th @click="sort('time')" style="cursor: pointer">
                  时间
                  <i class="fas" :class="getSortIcon('time')"></i>
                </th>
                <th @click="sort('status')" style="cursor: pointer">
                  状态
                  <i class="fas" :class="getSortIcon('status')"></i>
                </th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="alert in sortedAlerts" :key="alert.id">
                <td><input type="checkbox" class="form-check-input" v-model="alert.selected"></td>
                <td>{{ alert.ticketId }}</td>
                <td>{{ alert.content }}</td>
                <td>
                  <router-link :to="`/alert/${alert.id}`" class="btn btn-sm btn-outline-primary">查看详情</router-link>
                </td>
                <td>
                  <span :class="['badge', 'bg-' + alert.levelClass, 'me-2']">{{ alert.level }}</span>
                </td>
                <td>{{ alert.resourceType }}</td>
                <td>{{ alert.source }}</td>
                <td>{{ alert.time }}</td>
                <td>{{ alert.status }}</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <router-link :to="`/detail/${alert.id}`" class="btn btn-outline-primary">查看</router-link>
                    <button class="btn btn-outline-success" @click="handleProcess(alert)">处理</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <nav class="mt-3">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="currentPage--">上一页</a>
            </li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
              <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="currentPage++">下一页</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- 高级筛选弹窗 -->
    <div class="modal fade" :class="{ show: showAdvancedFilter }" tabindex="-1" :style="{ display: showAdvancedFilter ? 'block' : 'none' }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">高级筛选</h5>
            <button type="button" class="btn-close" @click="showAdvancedFilter = false"></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label class="form-label">时间范围</label>
                <div class="row g-2">
                  <div class="col-6">
                    <input type="datetime-local" class="form-control" v-model="advancedFilters.startTime">
                  </div>
                  <div class="col-6">
                    <input type="datetime-local" class="form-control" v-model="advancedFilters.endTime">
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">资源类型</label>
                <select class="form-select" v-model="advancedFilters.resourceType">
                  <option value="">全部</option>
                  <option value="server">服务器</option>
                  <option value="database">数据库</option>
                  <option value="network">网络设备</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">告警来源</label>
                <select class="form-select" v-model="advancedFilters.source">
                  <option value="">全部</option>
                  <option value="system">系统监控</option>
                  <option value="application">应用监控</option>
                  <option value="security">安全监控</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showAdvancedFilter = false">取消</button>
            <button type="button" class="btn btn-primary" @click="applyAdvancedFilters">应用筛选</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" :class="{ show: showAdvancedFilter }" v-if="showAdvancedFilter"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 状态管理
const searchQuery = ref('')
const filter = ref('all')
const showAdvancedFilter = ref(false)
const selectAll = ref(false)
const currentPage = ref(1)
const totalPages = ref(5)
const sortKey = ref('')
const sortOrder = ref('asc')

// 高级筛选状态
const advancedFilters = ref({
  startTime: '',
  endTime: '',
  resourceType: '',
  source: ''
})

// 模拟告警数据
const alerts = ref([
  {
    id: 1,
    ticketId: 'ALT20230001',
    content: 'CPU使用率超过90%',
    level: '严重',
    levelClass: 'danger',
    resourceType: '服务器',
    source: '系统监控',
    time: '2023-07-20 10:30',
    status: '未处理',
    selected: false
  }
])

// 计算属性
const topUnhandledAlerts = computed(() => {
  return alerts.value
    .filter(alert => alert.status === '未处理')
    .sort((a, b) => {
      const levelOrder = { '严重': 3, '警告': 2, '普通': 1 }
      return levelOrder[b.level] - levelOrder[a.level]
    })
    .slice(0, 5)
})

const filteredAlerts = computed(() => {
  let result = alerts.value
  if (searchQuery.value) {
    result = result.filter(alert =>
      alert.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      alert.ticketId.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  if (filter.value !== 'all') {
    const levelMap = {
      critical: '严重',
      warning: '警告',
      normal: '普通'
    }
    result = result.filter(alert => alert.level === levelMap[filter.value])
  }
  return result
})

const sortedAlerts = computed(() => {
  return [...filteredAlerts.value].sort((a, b) => {
    const levelOrder = { '严重': 3, '警告': 2, '普通': 1 }
    if (sortKey.value === 'level') {
      const comparison = levelOrder[b.level] - levelOrder[a.level]
      return sortOrder.value === 'asc' ? -comparison : comparison
    } else if (sortKey.value === 'time') {
      const comparison = new Date(b.time) - new Date(a.time)
      return sortOrder.value === 'asc' ? -comparison : comparison
    } else if (sortKey.value === 'status') {
      const statusOrder = { '未处理': 2, '处理中': 1, '已完成': 0 }
      const comparison = statusOrder[b.status] - statusOrder[a.status]
      return sortOrder.value === 'asc' ? -comparison : comparison
    }
    return 0
  })
})

// 方法
const toggleSelectAll = () => {
  alerts.value.forEach(alert => alert.selected = selectAll.value)
}

const search = () => {
  currentPage.value = 1
  // 实际应用中这里会调用API进行搜索
}

const applyAdvancedFilters = () => {
  showAdvancedFilter.value = false
  currentPage.value = 1
  // 实际应用中这里会调用API进行筛选
}

const handleBatchProcess = () => {
  const selectedAlerts = alerts.value.filter(alert => alert.selected)
  // 实际应用中这里会调用API进行批量处理
  console.log('批量处理:', selectedAlerts)
}

const handleProcess = (alert) => {
  // 实际应用中这里会调用API处理告警
  console.log('处理告警:', alert)
}

const exportData = () => {
  // 实际应用中这里会调用API导出数据
  console.log('导出数据')
}

const sort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const getSortIcon = (key) => {
  if (sortKey.value !== key) return 'fa-sort'
  return sortOrder.value === 'asc' ? 'fa-sort-up' : 'fa-sort-down'
}
</script>

<style scoped>
.list-group-item {
  border-left: none;
  border-right: none;
  padding: 0.5rem 1rem;
}
.list-group-item:first-child {
  border-top: none;
}
.list-group-item:last-child {
  border-bottom: none;
}
</style>