import { createRouter, createWebHistory } from 'vue-router'
import AlertDashboard from '@/components/AlertDashboard.vue'
import AlertMonitor from '@/components/AlertMonitor.vue'
import AlertConfig from '@/components/AlertConfig.vue'
import AlertKnowledgeBase from '@/components/AlertKnowledgeBase.vue'
import MyAlerts from '@/components/MyAlerts.vue'
import DepartmentAlerts from '@/components/DepartmentAlerts.vue'
import AlertAnalysis from '@/components/AlertAnalysis.vue'
import ChangeEventDirectory from '@/components/ChangeEventDirectory.vue'
import AlertSubscription from '@/components/AlertSubscription.vue'
import AlertDetail from '@/components/AlertDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AlertDashboard
    },
    {
      path: '/monitor',
      component: AlertMonitor
    },
    {
      path: '/knowledge',
      component: AlertKnowledgeBase
    },
    {
      path: '/config',
      component: AlertConfig
    },
    {
      path: '/change-events',
      component: ChangeEventDirectory,
      children: [
        {
          path: 'subscriptions',
          component: AlertSubscription
        }
      ]
    },
    {
      path: '/my-alerts',
      component: MyAlerts
    },
    {
      path: '/department-alerts',
      component: DepartmentAlerts
    },
    {
      path: '/analysis',
      component: AlertAnalysis
    },
    {
      path: '/alert/:id',
      component: AlertDetail
    }
  ]
})

export default router