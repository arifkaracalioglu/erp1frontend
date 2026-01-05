import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/layouts/AppLayout.vue'

import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import CategoryView from '@/views/category/CategoryView.vue'
import ProductView from '@/views/product/ProductView.vue'
import StockView from '@/views/stock/StockView.vue'
import CustomerView from '@/views/customer/CustomerView.vue'
import RegisterView from '@/views/RegisterView.vue'

const routes = [
  { path: '/login', component: LoginView },
  { path: '/register',component: RegisterView},

  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', component: DashboardView },
      { path: 'categories', component: CategoryView },
      { path: 'products', component: ProductView },
      { path: 'stock', component: StockView },
      { path: 'customers', component: CustomerView }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // login gerektiren sayfa
  if (to.meta.requiresAuth) {
    if (!auth.token) {
      return next('/login')
    }

    // TOKEN VAR AMA USER YOKSA → /me çağır
    if (!auth.user) {
      try {
        await auth.loadMe()
      } catch (e) {
        auth.logout()
        return next('/login')
      }
    }
  }

  next()
})

export default router
