<template>
  <div class="page">
    <h1>Ürünler</h1>
    <button @click="downloadPdf">
      📄 PDF Çıktı Al
    </button>

    <!-- CREATE -->
    <div class="card">
      <h3>Yeni Ürün</h3>

      <div class="grid">
        <input v-model="form.name" placeholder="Ürün İsmi" />

        <input
          v-model.number="form.price"
          type="number"
          step="0.01"
          placeholder="Satış Fiyatı"
        />

        <input
          v-model.number="form.costPrice"
          type="number"
          step="0.01"
          placeholder="Maliyet (Opsiyonel)"
        />

        <input
          v-model.number="form.stockQuantity"
          type="number"
          placeholder="Başlangıç Stok"
        />

        <input
          v-model.number="form.minimumStockQuantity"
          type="number"
          placeholder="Min. Stok (Opsiyonel)"
        />

        <select v-model="form.categoryId">
          <option disabled value="">Kategori Seç</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
      </div>


      <textarea
        v-model="form.description"
        placeholder="Açıklama"
      />

      <button @click="createProduct">Ürün Ekle</button>
    </div>

    <!-- FILTER -->
    <div class="card">
      <h3>Kategoriye Göre Ayır</h3>
      <select v-model="selectedCategory" @change="filterProducts">
        <option value="">Hepsi</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>
    </div>

    <!-- LIST -->
    <div class="card">
      <h3>Product List</h3>

      <table v-if="products.length">
        <thead>
          <tr>
            <th>#</th>
            <th>İsim</th>
            <th>Kategori</th>
            <th>Fiyat</th>
            <th>Stok</th>
            <th>Min</th>
            <th>Kâr</th>
            <th>Tahmini Bitiş</th>
            <th width="120">Aksiyon</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, i) in products" :key="p.id">
            <td>{{ i + 1 }}</td>
            <td>{{ p.name }}</td>
            <td>{{ p.category.name }}</td>
            <td>{{ p.price }}</td>  
            <td>
              <span
                :class="{
                  low: p.minimumStockQuantity !== null &&
                       p.stockQuantity <= p.minimumStockQuantity
                }"
              >
                {{ p.stockQuantity }}
              </span>
            </td>


            <td>
              <span v-if="p.minimumStockQuantity !== null">
                {{ p.minimumStockQuantity }}
              </span>
              <small v-else style="color:#aaa">–</small>
            </td>


            <td>
              <template v-if="p.costPrice !== null">
                <strong>
                  {{ (p.price - p.costPrice).toFixed(2) }} ₺
                </strong>
              </template>
              <small v-else style="color:#aaa">–</small>
            </td>


            <td>
              <template v-if="stockForecasts[p.id]">
                <small>
                  ⏳ {{ stockForecasts[p.id].estimatedDaysLeft }} gün<br />
                  📅 {{ stockForecasts[p.id].estimatedOutDate }}
                </small>
              </template>

              <template v-else>
                <small style="color:#aaa">Hesaplanamadı</small>
              </template>
            </td>


            <td>
              <div class="stock-actions">
                <input
                  type="number"
                  min="1"
                  v-model.number="stockInputs[p.id]"
                  placeholder="Adet"
                />

                <button @click="stockIn(p.id)">+</button>
                <button class="danger" @click="stockOut(p.id)">-</button>

                <button class="danger" @click="deleteProduct(p.id)">
                  Sil
                </button>
              </div>
            </td>

          </tr>
        </tbody>
      </table>

      <p v-else class="empty">No products found</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import productService from '@/services/productService'
import categoryService from '@/services/categoryService'
const stockInputs = ref({})
const stockForecasts = ref({})
const products = ref([])
const categories = ref([])
const selectedCategory = ref('')

const form = ref({
  name: '',
  price: null,
  costPrice: null,
  stockQuantity: null,
  minimumStockQuantity: null,
  categoryId: '',
  description: ''
})

async function loadStockForecasts(productList) {
  for (const p of productList) {
    try {
      const res = await productService.getStockForecast(p.id)
      stockForecasts.value[p.id] = res.data
    } catch (e) {
      stockForecasts.value[p.id] = null
      console.warn('Forecast error for product', p.id)
    }
  }
}

async function stockIn(productId) {
  const qty = stockInputs.value[productId]
  if (!qty || qty <= 0) {
    alert('Quantity required')
    return
  }

  await productService.stockIn(productId, qty)
  stockInputs.value[productId] = ''
  loadProducts()
}

async function stockOut(productId) {
  const qty = stockInputs.value[productId]
  if (!qty || qty <= 0) {
    alert('Quantity required')
    return
  }

  await productService.stockOut(productId, qty)
  stockInputs.value[productId] = ''
  loadProducts()
}


async function loadCategories() {
  const res = await categoryService.getAll()
  categories.value = res.data
}

async function loadProducts() {
  const res = await productService.getAll()
  products.value = res.data
  await loadStockForecasts(products.value)
}


async function filterProducts() {
  let res
  if (!selectedCategory.value) {
    res = await productService.getAll()
  } else {
    res = await productService.getByCategory(selectedCategory.value)
  }

  products.value = res.data
  await loadStockForecasts(products.value)
}


async function createProduct() {
  await productService.create(form.value)
  form.value = {
    name: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    description: ''
  }
  loadProducts()
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return
  await productService.delete(id)
  loadProducts()
}
async function downloadPdf() {
  const res = await productService.getPdf()

  const blob = new Blob([res.data], { type: 'application/pdf' })
  const url = window.URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'urunler.pdf'
  a.click()

  window.URL.revokeObjectURL(url)
}

onMounted(() => {
  loadCategories()
  loadProducts()
})
</script>

<style scoped>

.stock-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.stock-actions input {
  width: 60px;
  padding: 5px;
}

.stock-actions button {
  padding: 5px 8px;
  font-weight: bold;
}


.page {
  max-width: 1100px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,.05);
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

textarea {
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  min-height: 80px;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.low {
  color: #ff4d4f;
  font-weight: bold;
}
.low::after {
  content: " ⚠";
}

th, td {
  padding: 10px;
  border-bottom: 1px solid #eee;
  text-align: left;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
th:nth-child(1),
td:nth-child(1) { width: 40px; }

th:nth-child(2),
td:nth-child(2) { width: 160px; }

th:nth-child(3),
td:nth-child(3) { width: 120px; }

th:nth-child(4),
td:nth-child(4) { width: 90px; }

th:nth-child(5),
td:nth-child(5) { width: 80px; }

th:nth-child(6),
td:nth-child(6) { width: 70px; }

th:nth-child(7),
td:nth-child(7) { width: 90px; }

th:nth-child(8),
td:nth-child(8) {
  width: 150px;
  white-space: normal; /* sadece bu kolon çok satırlı */
}

th:nth-child(9),
td:nth-child(9) { width: 180px; }
.stock-actions {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: nowrap;
}


.low {
  color: #ff4d4f;
  font-weight: bold;
}

button.danger {
  background: #ff4d4f;
}

.empty {
  color: #888;
}
</style>
