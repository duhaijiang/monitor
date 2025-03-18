<template>
  <div class="app">
    <div class="sidebar">
      <div class="sidebar-header">
        <h3>告警管理系统</h3>
      </div>
      <nav class="sidebar-nav">
        <ul class="nav flex-column">
          <li class="nav-item">
            <router-link class="nav-link" to="/" active-class="active">
              <i class="fas fa-tachometer-alt"></i>
              <span>告警看板</span>
            </router-link>
            <ul class="nav flex-column sub-nav">
              <li class="nav-item">
                <router-link class="nav-link" to="/my-alerts" active-class="active">
                  <i class="fas fa-user-shield"></i>
                  <span>我的告警</span>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/department-alerts" active-class="active">
                  <i class="fas fa-building"></i>
                  <span>产品部门告警</span>
                </router-link>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/monitor" active-class="active">
              <i class="fas fa-bell"></i>
              <span>告警监控</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/change-events" active-class="active">
              <i class="fas fa-exchange-alt"></i>
              <span>事件管理</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/knowledge" active-class="active">
              <i class="fas fa-book"></i>
              <span>告警知识库</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/config" active-class="active">
              <i class="fas fa-cog"></i>
              <span>告警配置</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/analysis" active-class="active">
              <i class="fas fa-chart-bar"></i>
              <span>统计分析</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>

    <div class="main-content">
      <nav aria-label="breadcrumb" class="breadcrumb-nav">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#">首页</a></li>
          <li class="breadcrumb-item active" aria-current="page">告警看板</li>
        </ol>
      </nav>

      <main class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
</script>

<style>
.app {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #2f4050;
  color: #fff;
  padding: 20px 0;
}

.sidebar-header {
  padding: 0 20px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.sidebar-nav {
  padding: 20px 0;
}

.sub-nav {
  padding-left: 20px;
  margin-top: 5px;
}

.sub-nav .nav-link {
  padding: 8px 20px;
  font-size: 0.9em;
}

.sub-nav .nav-link i {
  font-size: 0.9em;
}

.nav-link {
  color: #a7b1c2;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  transition: all 0.3s;
}

.nav-link i {
  margin-right: 10px;
  width: 20px;
  text-align: center;
}

.nav-link:hover,
.nav-link.active {
  color: #fff;
  background-color: #293846;
}

.main-content {
  flex: 1;
  background-color: #f3f3f4;
  padding: 20px;
}

.breadcrumb-nav {
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.content {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>