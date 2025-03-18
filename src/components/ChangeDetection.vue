<template>
  <div class="change-detection">
    <!-- SLO指标监控 -->
    <div class="card mb-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">核心SLO指标监控</h5>
        <button class="btn btn-primary btn-sm" @click="refreshMetrics">
          <i class="fas fa-sync-alt me-1"></i>刷新
        </button>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6 mb-4">
            <div class="metric-card">
              <h6>接口可用性</h6>
              <div class="d-flex justify-content-between align-items-center">
                <div class="metric-value" :class="{'text-danger': metrics.availability < 99}">
                  {{ metrics.availability }}%
                </div>
                <div class="metric-trend">
                  <i class="fas" :class="getTrendIcon(metrics.availabilityTrend)"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-4">
            <div class="metric-card">
              <h6>响应时间</h6>
              <div class="d-flex justify-content-between align-items-center">
                <div class="metric-value" :class="{'text-danger': metrics.responseTime > 1000}">
                  {{ metrics.responseTime }}ms
                </div>
                <div class="metric-trend">
                  <i class="fas" :class="getTrendIcon(metrics.responseTimeTrend)"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 变更检测 -->
    <div class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0">变更检测</h5>
      </div>
      <div class="card-body">
        <div class="mb-4">
          <h6 class="mb-3">前置检查</h6>
          <div class="check-list">
            <div v-for="check in preChecks" :key="check.id" class="check-item">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span>{{ check.name }}</span>
                <span :class="getStatusClass(check.status)">{{ check.status }}</span>
              </div>
              <div class="progress" style="height: 4px">
                <div class="progress-bar" :class="getProgressClass(check.status)" :style="{width: check.progress + '%'}"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <h6 class="mb-3">变更冲突检测</h6>
          <div class="conflict-list">
            <div v-for="conflict in conflicts" :key="conflict.id" class="alert" :class="getConflictClass(conflict.level)">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="mb-1">{{ conflict.title }}</h6>
                  <p class="mb-0">{{ conflict.description }}</p>
                </div>
                <button class="btn btn-sm" :class="getConflictButtonClass(conflict.level)">处理</button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h6 class="mb-3">时间窗口限制</h6>
          <div class="time-window">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" v-model="timeWindow.enabled">
              <label class="form-check-label">启用时间窗口限制</label>
            </div>
            <div v-if="timeWindow.enabled" class="row g-3">
              <div class="col-md-6">
                <label class="form-label">开始时间</label>
                <input type="time" class="form-control" v-model="timeWindow.start">
              </div>
              <div class="col-md-6">
                <label class="form-label">结束时间</label>
                <input type="time" class="form-control" v-model="timeWindow.end">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChangeDetection',
  data() {
    return {
      metrics: {
        availability: 99.95,
        availabilityTrend: 'up',
        responseTime: 200,
        responseTimeTrend: 'down'
      },
      preChecks: [
        { id: 1, name: '配置文件检查', status: 'success', progress: 100 },
        { id: 2, name: '依赖服务检查', status: 'warning', progress: 80 },
        { id: 3, name: '资源准备检查', status: 'pending', progress: 30 }
      ],
      conflicts: [
        {
          id: 1,
          title: '数据库变更冲突',
          description: '检测到并行的数据库架构变更计划',
          level: 'danger'
        },
        {
          id: 2,
          title: '配置变更提醒',
          description: '当前变更可能影响关联服务的配置',
          level: 'warning'
        }
      ],
      timeWindow: {
        enabled: true,
        start: '22:00',
        end: '06:00'
      }
    }
  },
  methods: {
    refreshMetrics() {
      // 刷新指标数据
    },
    getTrendIcon(trend) {
      return trend === 'up' ? 'fa-arrow-up text-success' : 'fa-arrow-down text-danger'
    },
    getStatusClass(status) {
      const classes = {
        success: 'text-success',
        warning: 'text-warning',
        error: 'text-danger',
        pending: 'text-muted'
      }
      return classes[status] || 'text-muted'
    },
    getProgressClass(status) {
      const classes = {
        success: 'bg-success',
        warning: 'bg-warning',
        error: 'bg-danger',
        pending: 'bg-info'
      }
      return classes[status] || 'bg-info'
    },
    getConflictClass(level) {
      return `alert-${level}`
    },
    getConflictButtonClass(level) {
      return `btn-outline-${level}`
    }
  }
}
</script>

<style scoped>
.metric-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: bold;
}

.check-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.conflict-list .alert {
  margin-bottom: 1rem;
}

.time-window {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}
</style>