<template>
  <div class="page">
    <h1>Kategoriler</h1>

    <!-- CREATE -->
    <div class="card">
      <h3>Yeni Kategori</h3>
      <div class="row">
        <input
          class="add-input"
          v-model="newCategory"
          placeholder=Kategori İsmi
        />
        <button @click="createCategory">Ekle</button>
      </div>
    </div>

    <!-- LIST -->
    <div class="card">
      <h3>Kategori Listesi</h3>

      <table v-if="categories.length">
        <thead>
          <tr>
            <th>#</th>
            <th>İsim</th>
            <th width="120">Aksiyon</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(c, i) in categories" :key="c.id">
            <td>{{ i + 1 }}</td>
            <td>{{ c.name }}</td>
            <td>
              <button class="danger" @click="deleteCategory(c.id)">
                Sil
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else class="empty">Hiç kategori bulunamadı</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import categoryService from '@/services/categoryService'

const categories = ref([])
const newCategory = ref('')

async function loadCategories() {
  const res = await categoryService.getAll()
  categories.value = res.data
}

async function createCategory() {
  if (!newCategory.value.trim()) return

  await categoryService.create(newCategory.value)
  newCategory.value = ''
  loadCategories()
}

async function deleteCategory(id) {
  if (!confirm('Delete this category?')) return
  await categoryService.delete(id)
  loadCategories()
}

onMounted(loadCategories)
</script>

<style scoped>

.page {
  max-width: 80vw;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,.05);
}

.add-input{
  min-width:50vw;
}

.row {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

button {
  padding: 8px 12px;
}

button.danger {
  background: #ff4d4f;
}

.empty {
  color: #888;
  margin-top: 10px;
}
</style>
