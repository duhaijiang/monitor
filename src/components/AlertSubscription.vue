<template>
  <div class="alert-subscription">
    <div class="card mb-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">告警订阅管理</h5>
        <button class="btn btn-primary btn-sm" @click="showAddSubscription = true">
          <i class="fas fa-plus me-1"></i>添加订阅
        </button>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>订阅名称</th>
                <th>监控指标</th>
                <th>关联业务</th>
                <th>通知方式</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sub in subscriptions" :key="sub.id">
                <td>{{ sub.name }}</td>
                <td>
                  <span class="badge bg-info me-1" v-for="metric in sub.metrics" :key="metric">
                    {{ metric }}
                  </span>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <span class="badge bg-secondary me-1">{{ sub.service }}</span>
                    <i class="fas fa-arrow-right mx-2"></i>
                    <span class="badge bg-secondary">{{ sub.relatedService }}</span>
                  </div>
                </td>
                <td>
                  <i v-if="sub.notifyEmail" class="fas fa-envelope me-2"></i>
                  <i v-if="sub.notifyWeChat" class="fab fa-weixin me-2"></i>
                  <i v-if="sub.notifyPhone" class="fas fa-phone"></i>
                </td>
                <td>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" v-model="sub.enabled">
                  </div>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-1" @click="editSubscription(sub)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteSubscription(sub)">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 添加/编辑订阅弹窗 -->
    <div class="modal fade" :class="{ show: showAddSubscription }" tabindex="-1" :style="{ display: showAddSubscription ? 'block' : 'none' }">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingSubscription ? '编辑订阅' : '添加订阅' }}</h5>
            <button type="button" class="btn-close" @click="closeSubscriptionModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveSubscription">
              <div class="mb-3">
                <label class="form-label">订阅名称</label>
                <input type="text" class="form-control" v-model="subscriptionForm.name" required>
              </div>
              <div class="mb-3">
                <label class="form-label">监控指标</label>
                <select class="form-select" multiple v-model="subscriptionForm.metrics">
                  <option value="cpu">CPU使用率</option>
                  <option value="memory">内存使用率</option>
                  <option value="latency">接口延迟</option>
                  <option value="error_rate">错误率</option>
                  <option value="qps">QPS</option>
                </select>
              </div>
              <div class="row mb-3">
                <div class="col">
                  <label class="form-label">本业务服务</label>
                  <select class="form-select" v-model="subscriptionForm.service">
                    <option value="order">订单服务</option>
                    <option value="payment">支付服务</option>
                    <option value="user">用户服务</option>
                  </select>
                </div>
                <div class="col">
                  <label class="form-label">关联业务服务</label>
                  <select class="form-select" v-model="subscriptionForm.relatedService">
                    <option value="inventory">库存服务</option>
                    <option value="logistics">物流服务</option>
                    <option value="notification">通知服务</option>
                  </select>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">通知方式</label>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" v-model="subscriptionForm.notifyEmail">
                  <label class="form-check-label">邮件通知</label>
                </div>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" v-model="subscriptionForm.notifyWeChat">
                  <label class="form-check-label">微信通知</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" v-model="subscriptionForm.notifyPhone">
                  <label class="form-check-label">电话通知</label>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeSubscriptionModal">取消</button>
                <button type="submit" class="btn btn-primary">保存</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlertSubscription',
  data() {
    return {
      showAddSubscription: false,
      editingSubscription: null,
      subscriptions: [
        {
          id: 1,
          name: '订单服务监控',
          metrics: ['latency', 'error_rate'],
          service: 'order',
          relatedService: 'inventory',
          notifyEmail: true,
          notifyWeChat: true,
          notifyPhone: false,
          enabled: true
        },
        {
          id: 2,
          name: '支付服务监控',
          metrics: ['qps', 'error_rate'],
          service: 'payment',
          relatedService: 'notification',
          notifyEmail: true,
          notifyWeChat: false,
          notifyPhone: true,
          enabled: true
        }
      ],
      subscriptionForm: {
        name: '',
        metrics: [],
        service: '',
        relatedService: '',
        notifyEmail: false,
        notifyWeChat: false,
        notifyPhone: false
      }
    }
  },
  methods: {
    editSubscription(subscription) {
      this.editingSubscription = subscription
      this.subscriptionForm = { ...subscription }
      this.showAddSubscription = true
    },
    deleteSubscription(subscription) {
      if (confirm('确定要删除该订阅吗？')) {
        this.subscriptions = this.subscriptions.filter(s => s.id !== subscription.id)
      }
    },
    closeSubscriptionModal() {
      this.showAddSubscription = false
      this.editingSubscription = null
      this.subscriptionForm = {
        name: '',
        metrics: [],
        service: '',
        relatedService: '',
        notifyEmail: false,
        notifyWeChat: false,
        notifyPhone: false
      }
    },
    saveSubscription() {
      const subscription = {
        ...this.subscriptionForm,
        id: this.editingSubscription ? this.editingSubscription.id : Date.now(),
        enabled: true
      }

      if (this.editingSubscription) {
        const index = this.subscriptions.findIndex(s => s.id === subscription.id)
        this.subscriptions.splice(index, 1, subscription)
      } else {
        this.subscriptions.push(subscription)
      }

      this.closeSubscriptionModal()
    }
  }
}
</script>

<style scoped>
.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
  display: block;
}

.badge {
  font-size: 0.8rem;
}

.form-check-input:checked {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}
</style>