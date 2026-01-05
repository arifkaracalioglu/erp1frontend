<template>
  <div class="page dashboard">
    <div class="dashboard-header">
      <h1>Anasayfa</h1>
      <span class="subtitle">İş görünümü</span>
    </div>

    <!-- KPI ROW --><!-- KPI ROW -->
    <div class="kpi-row">
      <div class="kpi-card clickable" @click="go('/products')">
        <span class="label">Ürünler</span>
        <span class="value">{{ s.productCount }}</span>
      </div>

      <div class="kpi-card clickable" @click="go('/customers')">
        <span class="label">Müşteriler</span>
        <span class="value">{{ s.customerCount }}</span>
      </div>

      <div class="kpi-card clickable" @click="go('/products')">
        <span class="label">Toplam Stok</span>
        <span class="value">{{ s.totalStockQuantity }}</span>
      </div>

      <div class="kpi-card wide">
        <span class="label">Stok Değeri</span>
        <span class="value">
          {{ s.totalStockValue.toFixed(2) }} ₺
        </span>
      </div>

      <div
        class="kpi-card danger clickable"
        @click="go('/products?filter=out-of-stock')"
      >
        <span class="label">Stok Miktarı Azalanlar</span>
        <span class="value">{{ s.zeroStockProductCount }}</span>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import dashboardService from '@/services/dashboardService'

const router = useRouter()

const s = ref({
  productCount: 0,
  customerCount: 0,
  zeroStockProductCount: 0,
  totalStockQuantity: 0,
  totalStockValue: 0
})

function go(path) {
  router.push(path)
}

async function load() {
  const res = await dashboardService.getSummary()
  s.value = res.data
}

onMounted(load)
</script>


<style scoped>
.dashboard {
  padding: 24px;
}

.dashboard-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 20px;
}

.dashboard-header h1 {
  font-size: 22px;
  font-weight: 600;
  color: #0f172a;
}
.kpi-card.clickable {
  cursor: pointer;
}

.kpi-card.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0,0,0,0.08);
}

.subtitle {
  font-size: 13px;
  color: #64748b;
}

/* KPI ROW */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.kpi-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 90px;
  transition: box-shadow 0.2s ease;
}

.kpi-card:hover {
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
}

.kpi-card .label {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 6px;
}

.kpi-card .value {
  font-size: 26px;
  font-weight: 600;
  color: #0f172a;
}

/* WIDE CARD */
.kpi-card.wide {
  grid-column: span 2;
}

/* DANGER */
.kpi-card.danger {
  border-color: #fecaca;
  background: #fff5f5;
}

.kpi-card.danger .value {
  color: #dc2626;
}
</style>
