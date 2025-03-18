<template>
  <div class="knowledge-base">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">告警知识库</h5>
        <button class="btn btn-primary" @click="showAddModal = true">
          <i class="fas fa-plus"></i> 添加知识
        </button>
      </div>
      <div class="card-body">
        <!-- 搜索和筛选 -->
        <div class="row mb-4">
          <div class="col-md-4">
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                v-model="searchQuery"
                placeholder="搜索知识库..."
              >
              <button class="btn btn-outline-secondary" @click="searchKnowledge">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="selectedType">
              <option value="">全部告警类型</option>
              <option value="cpu">CPU告警</option>
              <option value="memory">内存告警</option>
              <option value="disk">磁盘告警</option>
              <option value="network">网络告警</option>
            </select>
          </div>
        </div>

        <!-- 知识列表 -->
        <div class="knowledge-list">
          <div v-for="item in knowledgeList" :key="item.id" class="knowledge-item card mb-3">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <h5 class="card-title">{{ item.title }}</h5>
                <span class="badge bg-primary">{{ item.type }}</span>
              </div>
              <p class="card-text text-muted mb-3">{{ item.description }}</p>
              <div class="solution">
                <h6>解决方案：</h6>
                <ol>
                  <li v-for="(step, index) in item.steps" :key="index">
                    {{ step }}
                  </li>
                </ol>
              </div>
              <div class="mt-3 pt-3 border-top">
                <small class="text-muted">更新时间：{{ item.updateTime }}</small>
                <div class="btn-group float-end">
                  <button class="btn btn-sm btn-outline-primary" @click="editKnowledge(item)">
                    <i class="fas fa-edit"></i> 编辑
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteKnowledge(item.id)">
                    <i class="fas fa-trash"></i> 删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑知识模态框 -->
    <div class="modal fade" :class="{ show: showAddModal }" v-if="showAddModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingItem ? '编辑知识' : '添加知识' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveKnowledge">
              <div class="mb-3">
                <label class="form-label">标题</label>
                <input type="text" class="form-control" v-model="currentItem.title" required>
              </div>
              <div class="mb-3">
                <label class="form-label">告警类型</label>
                <select class="form-select" v-model="currentItem.type" required>
                  <option value="cpu">CPU告警</option>
                  <option value="memory">内存告警</option>
                  <option value="disk">磁盘告警</option>
                  <option value="network">网络告警</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">描述</label>
                <textarea class="form-control" v-model="currentItem.description" rows="3" required></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">解决步骤</label>
                <div v-for="(step, index) in currentItem.steps" :key="index" class="d-flex mb-2">
                  <input type="text" class="form-control" v-model="currentItem.steps[index]">
                  <button type="button" class="btn btn-outline-danger ms-2" @click="removeStep(index)">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <button type="button" class="btn btn-outline-secondary" @click="addStep">
                  <i class="fas fa-plus"></i> 添加步骤
                </button>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
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
  name: 'AlertKnowledgeBase',
  data() {
    return {
      searchQuery: '',
      selectedType: '',
      showAddModal: false,
      editingItem: null,
      currentItem: {
        title: '',
        type: '',
        description: '',
        steps: ['']
      },
      knowledgeList: [
        {
          id: 21,
          title: 'Zookeeper集群异常',
          type: 'middleware',
          description: 'Zookeeper集群出现节点异常或连接问题。',
          steps: ['检查集群状态', '排查网络连接', '恢复异常节点', '优化配置参数'],
          updateTime: '2023-07-20 20:30'
        },
        {
          id: 22,
          title: 'Kafka消息延迟',
          type: 'middleware',
          description: 'Kafka消息处理出现严重延迟。',
          steps: ['检查消费者组状态', '分析延迟原因', '调整分区数量', '优化消费者配置'],
          updateTime: '2023-07-20 21:00'
        },
        {
          id: 23,
          title: 'RabbitMQ队列阻塞',
          type: 'middleware',
          description: 'RabbitMQ消息队列出现阻塞现象。',
          steps: ['检查队列状态', '分析消费者性能', '调整队列参数', '增加消费者数量'],
          updateTime: '2023-07-20 21:30'
        },
        {
          id: 24,
          title: 'Prometheus数据丢失',
          type: 'monitor',
          description: 'Prometheus监控数据出现丢失或不完整。',
          steps: ['检查存储状态', '验证采集配置', '调整保留策略', '扩展存储容量'],
          updateTime: '2023-07-20 22:00'
        },
        {
          id: 25,
          title: 'Grafana服务异常',
          type: 'monitor',
          description: 'Grafana监控面板无法访问或显示异常。',
          steps: ['检查服务状态', '验证数据源连接', '清理缓存数据', '更新配置文件'],
          updateTime: '2023-07-20 22:30'
        },
        {
          id: 26,
          title: 'Jenkins构建失败',
          type: 'ci',
          description: 'Jenkins持续集成任务构建失败。',
          steps: ['分析构建日志', '检查代码变更', '修复构建脚本', '更新依赖版本'],
          updateTime: '2023-07-20 23:00'
        },
        {
          id: 27,
          title: 'GitLab服务异常',
          type: 'scm',
          description: 'GitLab代码仓库服务访问异常。',
          steps: ['检查服务状态', '分析系统日志', '清理仓库缓存', '优化服务配置'],
          updateTime: '2023-07-20 23:30'
        },
        {
          id: 28,
          title: 'DNS解析失败',
          type: 'network',
          description: 'DNS服务解析请求失败率过高。',
          steps: ['检查DNS服务器', '验证解析配置', '清理DNS缓存', '更新DNS记录'],
          updateTime: '2023-07-21 00:00'
        },
        {
          id: 29,
          title: 'HAProxy负载异常',
          type: 'loadbalancer',
          description: 'HAProxy负载均衡器出现异常。',
          steps: ['检查服务状态', '分析后端健康检查', '优化均衡策略', '调整超时设置'],
          updateTime: '2023-07-21 00:30'
        },
        {
          id: 30,
          title: 'Nginx性能下降',
          type: 'web',
          description: 'Nginx服务器性能显著下降。',
          steps: ['分析访问日志', '优化配置参数', '清理缓存文件', '升级硬件资源'],
          updateTime: '2023-07-21 01:00'
        },
        {
          id: 1,
          title: 'CPU使用率过高',
          type: 'cpu',
          description: 'CPU使用率持续超过90%，可能导致系统响应缓慢。',
          steps: ['检查系统进程占用情况', '终止异常进程', '优化应用程序代码', '考虑扩容或负载均衡'],
          updateTime: '2023-07-20 10:30'
        },
        {
          id: 2,
          title: '内存使用率告警',
          type: 'memory',
          description: '系统内存使用率超过85%，可能导致系统性能下降。',
          steps: ['检查内存占用最大的进程', '清理系统缓存', '优化应用内存使用', '考虑增加内存容量'],
          updateTime: '2023-07-20 11:00'
        },
        {
          id: 3,
          title: '磁盘空间不足',
          type: 'disk',
          description: '磁盘使用率超过90%，可能影响系统正常运行。',
          steps: ['清理临时文件和日志', '压缩或归档旧数据', '迁移数据到其他磁盘', '扩展磁盘容量'],
          updateTime: '2023-07-20 11:30'
        },
        {
          id: 4,
          title: '网络连接异常',
          type: 'network',
          description: '网络连接出现大量超时或丢包现象。',
          steps: ['检查网络配置', '排查网络设备故障', '联系网络服务提供商', '考虑更换网络线路'],
          updateTime: '2023-07-20 12:00'
        },
        {
          id: 5,
          title: '数据库连接数过高',
          type: 'database',
          description: '数据库活动连接数接近最大限制。',
          steps: ['检查连接池配置', '优化SQL查询', '关闭空闲连接', '增加最大连接数限制'],
          updateTime: '2023-07-20 12:30'
        },
        {
          id: 6,
          title: '应用服务响应超时',
          type: 'application',
          description: '应用服务响应时间超过预设阈值。',
          steps: ['检查应用日志', '分析慢查询', '优化代码性能', '增加服务实例'],
          updateTime: '2023-07-20 13:00'
        },
        {
          id: 7,
          title: '系统负载过高',
          type: 'cpu',
          description: '系统平均负载超过CPU核心数的80%。',
          steps: ['检查系统资源使用情况', '识别高负载进程', '优化任务调度', '考虑扩容'],
          updateTime: '2023-07-20 13:30'
        },
        {
          id: 8,
          title: '内存泄漏警告',
          type: 'memory',
          description: '检测到应用程序可能存在内存泄漏。',
          steps: ['分析内存使用趋势', '检查代码内存管理', '更新程序版本', '重启服务'],
          updateTime: '2023-07-20 14:00'
        },
        {
          id: 9,
          title: '磁盘I/O性能下降',
          type: 'disk',
          description: '磁盘读写性能显著下降。',
          steps: ['检查磁盘健康状态', '优化I/O操作', '清理碎片', '更换高性能磁盘'],
          updateTime: '2023-07-20 14:30'
        },
        {
          id: 10,
          title: '网络带宽占用高',
          type: 'network',
          description: '网络带宽使用率持续超过90%。',
          steps: ['分析网络流量', '限制非关键流量', '优化数据传输', '升级网络带宽'],
          updateTime: '2023-07-20 15:00'
        },
        {
          id: 11,
          title: '数据库死锁',
          type: 'database',
          description: '数据库出现死锁情况，影响事务处理。',
          steps: ['查看死锁进程', '分析死锁原因', '优化事务逻辑', '调整锁超时设置'],
          updateTime: '2023-07-20 15:30'
        },
        {
          id: 12,
          title: '应用程序崩溃',
          type: 'application',
          description: '应用服务意外终止或崩溃。',
          steps: ['收集崩溃日志', '分析错误堆栈', '修复代码问题', '增加错误处理'],
          updateTime: '2023-07-20 16:00'
        },
        {
          id: 13,
          title: '安全漏洞告警',
          type: 'security',
          description: '检测到潜在的安全漏洞。',
          steps: ['评估漏洞风险', '应用安全补丁', '加强访问控制', '监控异常行为'],
          updateTime: '2023-07-20 16:30'
        },
        {
          id: 14,
          title: 'Redis缓存异常',
          type: 'cache',
          description: 'Redis缓存服务响应异常或连接失败。',
          steps: ['检查Redis状态', '清理过期数据', '优化内存配置', '考虑主从切换'],
          updateTime: '2023-07-20 17:00'
        },
        {
          id: 15,
          title: '消息队列堆积',
          type: 'mq',
          description: '消息队列中的消息出现大量堆积。',
          steps: ['检查消费者状态', '增加消费者数量', '优化处理逻辑', '清理无效消息'],
          updateTime: '2023-07-20 17:30'
        },
        {
          id: 16,
          title: 'Nginx错误率高',
          type: 'web',
          description: 'Nginx服务器出现大量错误响应。',
          steps: ['分析错误日志', '检查后端服务', '优化配置参数', '增加错误处理'],
          updateTime: '2023-07-20 18:00'
        },
        {
          id: 17,
          title: 'ElasticSearch集群异常',
          type: 'search',
          description: 'ES集群节点状态异常或查询响应慢。',
          steps: ['检查集群健康状态', '优化索引设置', '清理过期数据', '平衡节点负载'],
          updateTime: '2023-07-20 18:30'
        },
        {
          id: 18,
          title: 'Docker容器异常',
          type: 'container',
          description: 'Docker容器频繁重启或资源使用异常。',
          steps: ['查看容器日志', '检查资源限制', '优化镜像配置', '更新容器版本'],
          updateTime: '2023-07-20 19:00'
        },
        {
          id: 19,
          title: 'Kubernetes Pod崩溃',
          type: 'container',
          description: 'K8s Pod持续崩溃或无法启动。',
          steps: ['查看Pod状态', '检查容器日志', '验证配置正确性', '调整资源限制'],
          updateTime: '2023-07-20 19:30'
        },
        {
          id: 20,
          title: 'SSL证书过期',
          type: 'security',
          description: 'SSL证书即将过期或已经过期。',
          steps: ['检查证书有效期', '更新SSL证书', '配置自动更新', '验证证书生效'],
          updateTime: '2023-07-20 20:00'
        }
      ]
    }
  },
  data() {
    return {
      searchQuery: '',
      selectedType: '',
      showAddModal: false,
      editingItem: null,
      currentItem: {
        title: '',
        type: '',
        description: '',
        steps: ['']
      },
      knowledgeList: [
        {
          id: 21,
          title: 'Zookeeper集群异常',
          type: 'middleware',
          description: 'Zookeeper集群出现节点异常或连接问题。',
          steps: ['检查集群状态', '排查网络连接', '恢复异常节点', '优化配置参数'],
          updateTime: '2023-07-20 20:30'
        },
        {
          id: 22,
          title: 'Kafka消息延迟',
          type: 'middleware',
          description: 'Kafka消息处理出现严重延迟。',
          steps: ['检查消费者组状态', '分析延迟原因', '调整分区数量', '优化消费者配置'],
          updateTime: '2023-07-20 21:00'
        },
        {
          id: 23,
          title: 'RabbitMQ队列阻塞',
          type: 'middleware',
          description: 'RabbitMQ消息队列出现阻塞现象。',
          steps: ['检查队列状态', '分析消费者性能', '调整队列参数', '增加消费者数量'],
          updateTime: '2023-07-20 21:30'
        },
        {
          id: 24,
          title: 'Prometheus数据丢失',
          type: 'monitor',
          description: 'Prometheus监控数据出现丢失或不完整。',
          steps: ['检查存储状态', '验证采集配置', '调整保留策略', '扩展存储容量'],
          updateTime: '2023-07-20 22:00'
        },
        {
          id: 25,
          title: 'Grafana服务异常',
          type: 'monitor',
          description: 'Grafana监控面板无法访问或显示异常。',
          steps: ['检查服务状态', '验证数据源连接', '清理缓存数据', '更新配置文件'],
          updateTime: '2023-07-20 22:30'
        },
        {
          id: 26,
          title: 'Jenkins构建失败',
          type: 'ci',
          description: 'Jenkins持续集成任务构建失败。',
          steps: ['分析构建日志', '检查代码变更', '修复构建脚本', '更新依赖版本'],
          updateTime: '2023-07-20 23:00'
        },
        {
          id: 27,
          title: 'GitLab服务异常',
          type: 'scm',
          description: 'GitLab代码仓库服务访问异常。',
          steps: ['检查服务状态', '分析系统日志', '清理仓库缓存', '优化服务配置'],
          updateTime: '2023-07-20 23:30'
        },
        {
          id: 28,
          title: 'DNS解析失败',
          type: 'network',
          description: 'DNS服务解析请求失败率过高。',
          steps: ['检查DNS服务器', '验证解析配置', '清理DNS缓存', '更新DNS记录'],
          updateTime: '2023-07-21 00:00'
        },
        {
          id: 29,
          title: 'HAProxy负载异常',
          type: 'loadbalancer',
          description: 'HAProxy负载均衡器出现异常。',
          steps: ['检查服务状态', '分析后端健康检查', '优化均衡策略', '调整超时设置'],
          updateTime: '2023-07-21 00:30'
        },
        {
          id: 30,
          title: 'Nginx性能下降',
          type: 'web',
          description: 'Nginx服务器性能显著下降。',
          steps: ['分析访问日志', '优化配置参数', '清理缓存文件', '升级硬件资源'],
          updateTime: '2023-07-21 01:00'
        },
        {
          id: 1,
          title: 'CPU使用率过高解决方案',
          type: 'cpu',
          description: 'CPU使用率持续超过90%的处理方法',
          steps: [
            '使用top命令查看占用CPU较高的进程',
            '分析进程是否异常，是否存在死循环或性能问题',
            '必要时可以通过nice调整进程优先级',
            '如果是应用问题，联系开发人员优化代码'
          ],
          updateTime: '2023-07-20 14:30'
        }
      ]
    }
  },
  methods: {
    searchKnowledge() {
      // 实现搜索逻辑
    },
    addStep() {
      this.currentItem.steps.push('')
    },
    removeStep(index) {
      this.currentItem.steps.splice(index, 1)
    },
    editKnowledge(item) {
      this.editingItem = item
      this.currentItem = JSON.parse(JSON.stringify(item))
      this.showAddModal = true
    },
    deleteKnowledge(id) {
      if (confirm('确定要删除这条知识吗？')) {
        this.knowledgeList = this.knowledgeList.filter(item => item.id !== id)
      }
    },
    closeModal() {
      this.showAddModal = false
      this.editingItem = null
      this.currentItem = {
        title: '',
        type: '',
        description: '',
        steps: ['']
      }
    },
    saveKnowledge() {
      const knowledge = {
        ...this.currentItem,
        updateTime: new Date().toLocaleString()
      }
      
      if (this.editingItem) {
        // 编辑现有知识
        const index = this.knowledgeList.findIndex(item => item.id === this.editingItem.id)
        if (index !== -1) {
          this.knowledgeList[index] = { ...knowledge, id: this.editingItem.id }
        }
      } else {
        // 添加新知识
        knowledge.id = Date.now()
        this.knowledgeList.push(knowledge)
      }
      
      this.closeModal()
    }
  }
}
</script>

<style scoped>
.knowledge-base {
  padding: 20px;
}

.knowledge-item {
  transition: all 0.3s ease;
}

.knowledge-item:hover {
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.solution {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
}

.modal {
  display: block;
  background-color: rgba(0,0,0,0.5);
}

.modal.show {
  opacity: 1;
}
</style>