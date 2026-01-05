<template>
  <aside class="sidebar">
    <h2 class="logo">ERP1</h2>

    <nav class="menu">
      <router-link
        v-for="item in menu"
        :key="item.path"
        :to="item.path"
        class="menu-item"
        active-class="active"
      >
        {{ item.name }}
      </router-link>
    </nav>

    <button class="logout" @click="logout">
      Logout
    </button>
  </aside>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const logout = () => {
  auth.logout()
  router.push('/login')
}

const menu = [
  { name: 'Anasayfa', path: '/' },
  { name: 'Kategoriler', path: '/categories' },
  { name: 'Ürünler', path: '/products' },
  { name: 'Stok Hareketleri', path: '/stock' },
  { name: 'Müşteriler', path: '/customers' }

  // Orders, Users, Reports...
]
</script>

<style scoped>
.sidebar {
  width: 240px;
  background: #1e293b;
  color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.logo {
  font-size: 20px;
  margin-bottom: 30px;
}

.menu {
  flex: 1;
}

.menu-item {
  display: block;
  padding: 10px 15px;
  color: #cbd5e1;
  text-decoration: none;
  border-radius: 6px;
  margin-bottom: 8px;
}

.menu-item:hover,
.menu-item.active {
  background: #334155;
  color: #fff;
}

.logout {
  background: #ef4444;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
}

.logout:hover {
  background: #dc2626;
}
</style>
