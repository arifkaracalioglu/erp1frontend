<template>
  <div class="app-container">
    <SidebarMenu />

    <div class="main-content">
      <AppHeader />
      <router-view />
    </div>
  </div>
</template>

<script setup>
import SidebarMenu from '@/components/sidebar/SidebarMenu.vue'
import AppHeader from '@/components/header/AppHeader.vue'
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  background: #f5f6fa;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
