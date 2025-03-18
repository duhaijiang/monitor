<template>
  <div class="config">
    <!-- 告警规则列表 -->
    <div class="card mb-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">告警规则配置</h5>
        <button class="btn btn-primary btn-sm" @click="showAddRule = true">
          <i class="fas fa-plus me-1"></i>添加规则
        </button>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>规则名称</th>
                <th>监控指标</th>
                <th>告警条件</th>
                <th>告警级别</th>
                <th>通知方式</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rule in rules" :key="rule.id">
                <td>{{ rule.name }}</td>
                <td>{{ rule.metric }}</td>
                <td>{{ rule.condition }}</td>
                <td>
                  <span :class="'badge bg-' + rule.levelClass">{{ rule.level }}</span>
                </td>
                <td>
                  <i v-if="rule.notifyEmail" class="fas fa-envelope me-2"></i>
                  <i v-if="rule.notifySms" class="fas fa-sms me-2"></i>
                  <i v-if="rule.notifyWeChat" class="fab fa-weixin"></i>
                </td>
                <td>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" v-model="rule.enabled">
                  </div>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-1" @click="editRule(rule)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteRule(rule)">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 添加/编辑规则弹窗 -->
    <div class="modal fade" :class="{ show: showAddRule }" tabindex="-1" :style="{ display: showAddRule ? 'block' : 'none' }">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingRule ? '编辑规则' : '添加规则' }}</h5>
            <button type="button" class="btn-close" @click="closeRuleModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveRule">
              <div class="mb-3">
                <label class="form-label">规则名称</label>
                <input type="text" class="form-control" v-model="ruleForm.name" required>
              </div>
              <div class="mb-3">
                <label class="form-label">监控指标</label>
                <select class="form-select" v-model="ruleForm.metric" required>
                  <option value="cpu">CPU使用率</option>
                  <option value="memory">内存使用率</option>
                  <option value="disk">磁盘使用率</option>
                  <option value="network">网络流量</option>
                </select>
              </div>
              <div class="row mb-3">
                <div class="col">
                  <label class="form-label">告警条件</label>
                  <select class="form-select" v-model="ruleForm.operator">
                    <option value="gt">大于</option>
                    <option value="lt">小于</option>
                    <option value="eq">等于</option>
                  </select>
                </div>
                <div class="col">
                  <label class="form-label">阈值</label>
                  <input type="number" class="form-control" v-model="ruleForm.threshold" required>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">告警级别</label>
                <select class="form-select" v-model="ruleForm.level" required>
                  <option value="critical">严重</option>
                  <option value="warning">警告</option>
                  <option value="info">提示</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">通知方式</label>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" v-model="ruleForm.notifyEmail">
                  <label class="form-check-label">邮件通知</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" v-model="ruleForm.notifySms">
                  <label class="form-check-label">短信通知</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" v-model="ruleForm.notifyWeChat">
                  <label class="form-check-label">微信通知</label>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeRuleModal">取消</button>
            <button type="button" class="btn btn-primary" @click="saveRule">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const rules = ref([
  {
    id: 1,
    name: 'CPU使用率告警',
    metric: 'CPU使用率',
    condition: '大于90%',
    level: '严重',
    levelClass: 'danger',
    notifyEmail: true,
    notifySms: true,
    notifyWeChat: false,
    enabled: true
  },
  {
    id: 2,
    name: '内存使用率告警',
    metric: '内存使用率',
    condition: '大于85%',
    level: '警告',
    levelClass: 'warning',
    notifyEmail: true,
    notifySms: false,
    notifyWeChat: true,
    enabled: true
  }
])

const showAddRule = ref(false)
const editingRule = ref(null)

const ruleForm = reactive({
  name: '',
  metric: '',
  operator: 'gt',
  threshold: 0,
  level: 'warning',
  notifyEmail: false,
  notifySms: false,
  notifyWeChat: false
})

const editRule = (rule) => {
  editingRule.value = rule
  Object.assign(ruleForm, rule)
  showAddRule.value = true
}

const deleteRule = (rule) => {
  if (confirm('确定要删除该规则吗？')) {
    const index = rules.value.indexOf(rule)
    rules.value.splice(index, 1)
  }
}

const closeRuleModal = () => {
  showAddRule.value = false
  editingRule.value = null
  Object.assign(ruleForm, {
    name: '',
    metric: '',
    operator: 'gt',
    threshold: 0,
    level: 'warning',
    notifyEmail: false,
    notifySms: false,
    notifyWeChat: false
  })
}

const saveRule = () => {
  const newRule = {
    id: editingRule.value ? editingRule.value.id : Date.now(),
    name: ruleForm.name,
    metric: ruleForm.metric,
    condition: `${ruleForm.operator === 'gt' ? '大于' : ruleForm.operator === 'lt' ? '小于' : '等于'}${ruleForm.threshold}%`,
    level: ruleForm.level === 'critical' ? '严重' : ruleForm.level === 'warning' ? '警告' : '提示',
    levelClass: ruleForm.level,
    notifyEmail: ruleForm.notifyEmail,
    notifySms: ruleForm.notifySms,
    notifyWeChat: ruleForm.notifyWeChat,
    enabled: true
  }

  if (editingRule.value) {
    const index = rules.value.findIndex(r => r.id === editingRule.value.id)
    rules.value[index] = newRule
  } else {
    rules.value.push(newRule)
  }

  closeRuleModal()
}
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
.modal.show {
  display: block;
}
</style>