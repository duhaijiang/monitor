<template>
  <div class="alert-processing container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>告警处理</h2>
      <button class="btn btn-secondary" @click="$router.go(-1)">返回</button>
    </div>

    <div class="row">
      <div class="col-md-8">
        <!-- 告警基本信息 -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">告警信息</h5>
          </div>
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-md-3"><strong>告警ID：</strong></div>
              <div class="col-md-9">{{ alertId }}</div>
            </div>
            <div class="row mb-3">
              <div class="col-md-3"><strong>告警级别：</strong></div>
              <div class="col-md-9">
                <span class="badge" :class="severityClass">{{ alertData.severity }}</span>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-3"><strong>告警来源：</strong></div>
              <div class="col-md-9">{{ alertData.source }}</div>
            </div>
            <div class="row mb-3">
              <div class="col-md-3"><strong>发生时间：</strong></div>
              <div class="col-md-9">{{ alertData.startTime }}</div>
            </div>
            <div class="row mb-3">
              <div class="col-md-3"><strong>影响范围：</strong></div>
              <div class="col-md-9">{{ alertData.scope }}</div>
            </div>
            <div class="row mb-3">
              <div class="col-md-3"><strong>告警描述：</strong></div>
              <div class="col-md-9">{{ alertData.description }}</div>
            </div>
          </div>
        </div>

        <!-- 处理记录表单 -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">处理记录</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="submitProcess">
              <div class="mb-3">
                <label class="form-label">处理状态</label>
                <select v-model="processForm.status" class="form-select" required>
                  <option value="processing">处理中</option>
                  <option value="resolved">已解决</option>
                  <option value="ignored">已忽略</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">处理方案</label>
                <textarea
                  v-model="processForm.solution"
                  class="form-control"
                  rows="4"
                  required
                  placeholder="请输入处理方案和相关说明"
                ></textarea>
              </div>
              <button type="submit" class="btn btn-primary">提交</button>
            </form>
          </div>
        </div>
      </div>

      <!-- 处理时间轴 -->
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">处理进度</h5>
          </div>
          <div class="card-body">
            <div class="timeline">
              <div v-for="(record, index) in processRecords" :key="index" class="timeline-item">
                <div class="timeline-badge" :class="getStatusClass(record.status)"></div>
                <div class="timeline-content">
                  <h6 class="mb-1">{{ record.status }}</h6>
                  <p class="text-muted mb-1">{{ record.time }}</p>
                  <p class="mb-0">{{ record.solution }}</p>
                  <small class="text-muted">处理人：{{ record.operator }}</small>
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
export default {
  name: 'AlertProcessing',
  data() {
    return {
      alertId: this.$route.params.id,
      alertData: {
        severity: '严重',
        source: '系统监控',
        startTime: '2023-07-20 10:30:00',
        scope: 'Web服务器集群',
        description: 'CPU使用率持续超过90%，可能影响系统性能'
      },
      processForm: {
        status: 'processing',
        solution: ''
      },
      processRecords: [
        {
          status: '告警产生',
          time: '2023-07-20 10:30:00',
          solution: '系统检测到CPU使用率异常',
          operator: '系统'
        }
      ]
    }
  },
  computed: {
    severityClass() {
      const classes = {
        '严重': 'bg-danger',
        '警告': 'bg-warning',
        '提示': 'bg-info'
      }
      return classes[this.alertData.severity] || 'bg-secondary'
    }
  },
  methods: {
    getStatusClass(status) {
      const classes = {
        '告警产生': 'bg-danger',
        '处理中': 'bg-warning',
        '已解决': 'bg-success',
        '已忽略': 'bg-secondary'
      }
      return classes[status] || 'bg-info'
    },
    submitProcess() {
      // 创建新的处理记录
      const newRecord = {
        status: this.getStatusText(this.processForm.status),
        time: new Date().toLocaleString(),
        solution: this.processForm.solution,
        operator: '当前用户' // 实际项目中应该使用真实的用户信息
      }
      
      // 添加到处理记录
      this.processRecords.push(newRecord)
      
      // 重置表单
      this.processForm.solution = ''
      
      // 提示成功
      alert('处理记录已提交')
    },
    getStatusText(status) {
      const statusMap = {
        'processing': '处理中',
        'resolved': '已解决',
        'ignored': '已忽略'
      }
      return statusMap[status] || status
    }
  }
}
</script>

<style scoped>
.timeline {
  position: relative;
  padding: 20px 0;
}

.timeline-item {
  position: relative;
  padding-left: 40px;
  margin-bottom: 30px;
}

.timeline-badge {
  position: absolute;
  left: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  top: 5px;
}

.timeline-content {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 20px;
  bottom: -30px;
  width: 2px;
  background: #dee2e6;
}

.timeline-item:last-child::before {
  display: none;
}

.badge {
  font-size: 0.9em;
  padding: 0.5em 1em;
}
</style>