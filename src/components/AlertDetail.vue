<template>
  <div class="alert-detail container mt-4">
    <h2 class="mb-4">告警详情</h2>
    <div class="card">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-3"><strong>告警ID：</strong></div>
          <div class="col-md-9">{{ $route.params.id }}</div>
        </div>
        <div class="row mb-3">
          <div class="col-md-3"><strong>告警状态：</strong></div>
          <div class="col-md-9">
            <span class="badge bg-warning">待处理</span>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-3"><strong>告警时间：</strong></div>
          <div class="col-md-9">{{ new Date().toLocaleString() }}</div>
        </div>
        <div class="row mb-3">
          <div class="col-md-3"><strong>告警级别：</strong></div>
          <div class="col-md-9">
            <span class="badge bg-danger">严重</span>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-3"><strong>告警描述：</strong></div>
          <div class="col-md-9">服务器CPU使用率超过90%</div>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <button class="btn btn-primary me-2" @click="handleProcess">处理告警</button>
      <button class="btn btn-secondary" @click="$router.go(-1)">返回</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlertDetail',
  methods: {
    handleProcess() {
      // 处理告警的逻辑
      alert('处理告警')
    }
  }
}
</script>

<style scoped>
.alert-detail {
  max-width: 800px;
}
.badge {
  font-size: 0.9em;
}
</style>