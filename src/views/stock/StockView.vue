<template>
  <div class="page">
    <h1>Stok Hareketleri</h1>
    <button class="btn btn-secondary" @click="exportPdf">
      PDF Çıktı Al
    </button>

    <div class="pagination" v-if="totalPages > 1">
      <button
        :disabled="page === 0"
        @click="page--; loadMovements()"
      >
        ◀
      </button>

      <span>
        Sayfa {{ page + 1 }} / {{ totalPages }}
      </span>

      <button
        :disabled="page + 1 >= totalPages"
        @click="page++; loadMovements()"
      >
        ▶
      </button>
    </div>

    <!-- FILTER -->
    <div class="card filter">
      <select v-model="selectedProduct" @change="filterMovements">
        <option value="">Tüm ürünler</option>
        <option
          v-for="p in products"
          :key="p.id"
          :value="p.id"
        >
          {{ p.name }}
        </option>
      </select>
    </div>

    <!-- LIST -->
    <div class="card">
      <table v-if="movements.length">
        <thead>
          <tr>
            <th>#</th>
            <th>Ürün</th>
            <th>Tip</th>
            <th>Adet</th>
            <th>Önce</th>
            <th>Sonra</th>
            <th>Tarih</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(m, i) in movements" :key="m.id">
            <td>{{ page * size + i + 1 }}</td>
            <td>
              <span v-if="m.product">
                {{ m.product.name }}
              </span>
              <span v-else class="deleted">
                Silinmiş Ürün
              </span>
            </td>


            <td>
              <span :class="m.type === 'IN' ? 'in' : m.type === 'OUT' ? 'out' : ''">
                {{ typeToTr(m.type) }}
              </span>
            </td>

            <td>{{ m.quantity }}</td>
            <td>{{ m.stockBefore }}</td>
            <td>{{ m.stockAfter }}</td>
            <td>{{ formatDate(m.createdAt) }}</td>
          </tr>
        </tbody>
      </table>

      <p v-else class="empty">No stock movements</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import stockMovementService from '@/services/stockMovementService'
import productService from '@/services/productService'
import '@/assets/styles/stock-movements.css'

const movements = ref([])
const products = ref([])
const page = ref(0)
const size = ref(20)
const totalPages = ref(0)
const totalElements = ref(0)

const selectedProduct = ref('')
const loading = ref(false)

function typeToTr(type) {
  if (!type) return ''

  switch (type.toUpperCase()) {
    case 'IN':
      return 'İçeri'
    case 'OUT':
      return 'Dışarı'
    default:
      return type
  }
}

const exportPdf = async () => {
  const response = await stockMovementService.exportPdf({
    page: page.value,
    size: size.value,
    productId: selectedProduct.value || null
  })

  const blob = new Blob([response.data], { type: 'application/pdf' })
  const url = window.URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'stok-hareketleri.pdf'
  a.click()

  window.URL.revokeObjectURL(url)
}



async function loadProducts() {
  const res = await productService.getAll()
  products.value = res.data
}
async function filterMovements() {
  page.value = 0
  await loadMovements()
}

async function loadMovements() {
  loading.value = true

  const res = await stockMovementService.getPaged({
    page: page.value,
    size: size.value,
    productId: selectedProduct.value
  })

  movements.value = res.data.content
  totalPages.value = res.data.totalPages
  totalElements.value = res.data.totalElements

  loading.value = false
}

function formatDate(date) {
  return new Date(date).toLocaleString("tr-TR")
}

onMounted(() => {
  loadProducts()
  loadMovements()
})
</script>
