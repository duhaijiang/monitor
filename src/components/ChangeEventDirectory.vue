<template>
  <div class="change-event-directory">
    <div class="container-fluid py-4">
      <!-- 搜索过滤区 -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label">变更对象类型</label>
              <select v-model="filters.objectType" class="form-select">
                <option value="">全部</option>
                <option value="product">产品</option>
                <option value="appid">应用ID</option>
                <option value="gateway">网关</option>
                <option value="mysql">MySQL数据库</option>
                <option value="topic">消息队列Topic</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">对象标识</label>
              <input type="text" class="form-control" v-model="filters.objectId" placeholder="请输入对象ID/名称">
            </div>
            <div class="col-md-3">
              <label class="form-label">变更状态</label>
              <select v-model="filters.status" class="form-select">
                <option value="">全部</option>
                <option value="pending">待执行</option>
                <option value="running">执行中</option>
                <option value="completed">已完成</option>
                <option value="failed">执行失败</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">时间范围</label>
              <div class="input-group">
                <input type="datetime-local" class="form-control" v-model="filters.startTime">
                <span class="input-group-text">至</span>
                <input type="datetime-local" class="form-control" v-model="filters.endTime">
              </div>
            </div>
            <div class="col-md-12 d-flex gap-2">
              <button class="btn btn-outline-secondary" @click="setTimeRange('today')">今天</button>
              <button class="btn btn-outline-secondary" @click="setTimeRange('last7days')">最近7天</button>
              <button class="btn btn-outline-secondary" @click="setTimeRange('last30days')">最近30天</button>
              <button class="btn btn-primary ms-auto" @click="searchEvents">查询</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 子路由内容 -->
      <router-view></router-view>

      <!-- 操作按钮区 -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0">变更事件列表</h4>
        <div>
          <router-link to="/change-events/subscriptions" class="btn btn-primary">
            <i class="fas fa-bell me-1"></i>订阅管理
          </router-link>
        </div>
      </div>

      <!-- 变更事件列表 -->
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">事件列表</h5>
          <div class="btn-group">
            <button class="btn btn-outline-secondary btn-sm" @click="refreshList">
              <i class="fas fa-sync"></i> 刷新
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>变更ID</th>
                  <th>对象类型</th>
                  <th>对象标识</th>
                  <th>变更内容</th>
                  <th>状态</th>
                  <th>开始时间</th>
                  <th>操作人</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="event in changeEvents" :key="event.id">
                  <td>{{ event.id }}</td>
                  <td>
                    <span class="badge" :class="getObjectTypeClass(event.objectType)">
                      {{ getObjectTypeLabel(event.objectType) }}
                    </span>
                  </td>
                  <td>{{ event.objectId }}</td>
                  <td>{{ event.content }}</td>
                  <td>
                    <span class="badge" :class="getStatusClass(event.status)">
                      {{ getStatusLabel(event.status) }}
                    </span>
                  </td>
                  <td>{{ formatDateTime(event.startTime) }}</td>
                  <td>{{ event.operator }}</td>
                  <td>
                    <button class="btn btn-sm btn-info me-2" @click="viewDetails(event)">
                      <i class="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 变更详情弹窗 -->
      <div class="modal fade" id="eventDetailModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">变更详情</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body" v-if="selectedEvent">
              <div class="row mb-3">
                <div class="col-md-6">
                  <h6>基本信息</h6>
                  <dl class="row">
                    <dt class="col-sm-4">变更ID</dt>
                    <dd class="col-sm-8">{{ selectedEvent.id }}</dd>
                    <dt class="col-sm-4">对象类型</dt>
                    <dd class="col-sm-8">{{ getObjectTypeLabel(selectedEvent.objectType) }}</dd>
                    <dt class="col-sm-4">对象标识</dt>
                    <dd class="col-sm-8">{{ selectedEvent.objectId }}</dd>
                    <dt class="col-sm-4">操作人</dt>
                    <dd class="col-sm-8">{{ selectedEvent.operator }}</dd>
                  </dl>
                </div>
                <div class="col-md-6">
                  <h6>执行信息</h6>
                  <dl class="row">
                    <dt class="col-sm-4">当前状态</dt>
                    <dd class="col-sm-8">
                      <span class="badge" :class="getStatusClass(selectedEvent.status)">
                        {{ getStatusLabel(selectedEvent.status) }}
                      </span>
                    </dd>
                    <dt class="col-sm-4">开始时间</dt>
                    <dd class="col-sm-8">{{ formatDateTime(selectedEvent.startTime) }}</dd>
                    <dt class="col-sm-4">结束时间</dt>
                    <dd class="col-sm-8">{{ selectedEvent.endTime ? formatDateTime(selectedEvent.endTime) : '-' }}</dd>
                  </dl>
                </div>
              </div>
              <div class="mb-3">
                <h6>变更内容</h6>
                <pre class="bg-light p-3 rounded">{{ selectedEvent.content }}</pre>
              </div>
              <div class="mb-3">
                <h6>执行日志</h6>
                <div class="bg-dark text-light p-3 rounded" style="max-height: 300px; overflow-y: auto;">
                  <div v-for="(log, index) in selectedEvent.logs" :key="index">
                    <span class="text-muted">{{ formatDateTime(log.timestamp) }}</span>
                    <span :class="getLogLevelClass(log.level)">{{ log.message }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'ChangeEventDirectory',
  setup() {
    const filters = ref({
      objectType: '',
      objectId: '',
      status: '',
      startTime: '',
      endTime: ''
    })

    const changeEvents = ref([])
    const selectedEvent = ref(null)

    const setTimeRange = (range) => {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      switch(range) {
        case 'today':
          filters.value.startTime = today.toISOString().slice(0, 16)
          filters.value.endTime = now.toISOString().slice(0, 16)
          break
        case 'last7days':
          const last7days = new Date(today)
          last7days.setDate(last7days.getDate() - 7)
          filters.value.startTime = last7days.toISOString().slice(0, 16)
          filters.value.endTime = now.toISOString().slice(0, 16)
          break
        case 'last30days':
          const last30days = new Date(today)
          last30days.setDate(last30days.getDate() - 30)
          filters.value.startTime = last30days.toISOString().slice(0, 16)
          filters.value.endTime = now.toISOString().slice(0, 16)
          break
      }
      searchEvents()
    }

    // 模拟数据加载
    const loadChangeEvents = () => {
      // TODO: 替换为实际的API调用
      changeEvents.value = [
        {
          id: 'CHG20230901001',
          objectType: 'appid',
          objectId: 'app-123456',
          content: '更新应用配置参数',
          status: 'completed',
          startTime: '2023-09-01T10:00:00',
          endTime: '2023-09-01T10:05:00',
          operator: 'admin',
          logs: [
            { timestamp: '2023-09-01T10:00:00', level: 'info', message: '开始执行变更' },
            { timestamp: '2023-09-01T10:02:00', level: 'info', message: '更新配置文件完成' },
            { timestamp: '2023-09-01T10:05:00', level: 'success', message: '变更执行成功' }
          ]
        }
      ]
    }

    const searchEvents = () => {
      // TODO: 实现搜索逻辑
      loadChangeEvents()
    }

    const refreshList = () => {
      loadChangeEvents()
    }

    const viewDetails = (event) => {
      selectedEvent.value = event
      const modal = new bootstrap.Modal(document.getElementById('eventDetailModal'))
      modal.show()
    }

    const getObjectTypeLabel = (type) => {
      const labels = {
        product: '产品',
        appid: '应用ID',
        gateway: '网关',
        mysql: 'MySQL数据库',
        topic: '消息队列Topic'
      }
      return labels[type] || type
    }

    const getObjectTypeClass = (type) => {
      const classes = {
        product: 'bg-primary',
        appid: 'bg-success',
        gateway: 'bg-info',
        mysql: 'bg-warning',
        topic: 'bg-secondary'
      }
      return classes[type] || 'bg-secondary'
    }

    const getStatusLabel = (status) => {
      const labels = {
        pending: '待执行',
        running: '执行中',
        completed: '已完成',
        failed: '执行失败'
      }
      return labels[status] || status
    }

    const getStatusClass = (status) => {
      const classes = {
        pending: 'bg-secondary',
        running: 'bg-primary',
        completed: 'bg-success',
        failed: 'bg-danger'
      }
      return classes[status] || 'bg-secondary'
    }

    const getLogLevelClass = (level) => {
      const classes = {
        info: 'text-info',
        success: 'text-success',
        warning: 'text-warning',
        error: 'text-danger'
      }
      return classes[level] || ''
    }

    const formatDateTime = (dateStr) => {
      if (!dateStr) return '-'
      return new Date(dateStr).toLocaleString()
    }

    onMounted(() => {
      loadChangeEvents()
    })

    return {
      filters,
      changeEvents,
      selectedEvent,
      searchEvents,
      refreshList,
      viewDetails,
      getObjectTypeLabel,
      getObjectTypeClass,
      getStatusLabel,
      getStatusClass,
      getLogLevelClass,
      formatDateTime,
      setTimeRange
    }
  }
}
</script>

<style scoped>
.change-event-directory {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.badge {
  font-size: 0.875em;
}

.table > :not(caption) > * > * {
  padding: 0.75rem;
}

.modal-dialog {
  max-width: 800px;
}

.bg-light {
  background-color: #f8f9fa;
}

.text-muted {
  color: #6c757d;
  margin-right: 0.5rem;
}
</style>