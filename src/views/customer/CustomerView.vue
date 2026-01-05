<template>
  <div class="page">
    <h1>Müşteriler</h1>

    <!-- CREATE -->
    <div class="card">
      <h3>Yeni Müşteri</h3>

      <div class="grid">
        <input v-model="form.nameSurname" placeholder="İsim Soyisim *" />
        <input v-model="form.email" placeholder="Email" />
        <input v-model="form.phone" placeholder="Telefon" />
        <input v-model="form.balance" type="number" placeholder="Para (₺)" />
        <textarea v-model="form.address" placeholder="Adres" />
        <textarea v-model="form.soldProductsDesc" placeholder="Satılan ürünler (Açıklama)" />
        <textarea v-model="form.notes" placeholder="Notlar" />
      </div>

      <button @click="createCustomer">Müşteri Ekle</button>
    </div>

    <!-- LIST -->
    <div class="card">
      <h3>Müşteri Listesi</h3>

      <table v-if="customers.length">
        <thead>
          <tr>
            <th>#</th>
            <th>İsim</th>
            <th>İletişim</th>
            <th>Para</th>
            <th width="120">Aksiyon</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(c, i) in customers" :key="c.id" @click="openCustomer(c)" class="clickable">
            <td>{{ i + 1 }}</td>
            <td>{{ c.nameSurname }}</td>
            <td>
              <div>{{ maskEmail(c.email) }}</div>
              <div>{{ maskPhone(c.phone) }}</div>
            </td>

            <td>
              <span
                class="balance"
                :class="{ pos: c.balance >= 0, neg: c.balance < 0 }"
              >
                {{ c.balance }} ₺
              </span>
            </td>
            <td>
              <button class="danger" @click="deleteCustomer(c.id)"
                @click.stop="deleteCustomer(c.id)">
                Sil
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else class="empty">Hiç müşteri bulunamadı</p>
    </div>
  </div>

  <!-- CUSTOMER DETAIL MODAL -->
  <div v-if="selectedCustomer" class="modal-overlay" @click.self="closeModal">
    <div class="modal">
      <h3>{{ selectedCustomer.nameSurname }}</h3>

      <div class="modal-section">
        <strong>İletişim</strong>
        <p>Email: {{ selectedCustomer.email || '-' }}</p>
        <p>Telefon: {{ selectedCustomer.phone || '-' }}</p>
      </div>

      <div class="modal-section">
        <strong>Adres</strong>
        <p>{{ selectedCustomer.address || 'Adres girilmemiş' }}</p>
      </div>

      <div class="modal-section">
        <strong>Satılan Ürünler</strong>
        <p>{{ selectedCustomer.soldProductsDesc || 'Bilgi yok' }}</p>
      </div>

      <div class="modal-section">
        <strong>Notlar</strong>
        <p>{{ selectedCustomer.notes || 'Not yok' }}</p>
      </div>

      <button class="close" @click="closeModal">Kapat</button>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import customerService from '@/services/customerService'
import '@/assets/styles/customer.css'

const customers = ref([])
const selectedCustomer = ref(null)

function openCustomer(customer) {
  selectedCustomer.value = customer
}

function closeModal() {
  selectedCustomer.value = null
}
function maskEmail(email) {
  if (!email) return '-'
  if (email.length <= 2) return email
  return email.slice(0, 2) + '*'.repeat(email.length - 2)
}

function maskPhone(phone) {
  if (!phone) return '-'
  if (phone.length <= 2) return phone
  return phone.slice(0, 2) + '*'.repeat(phone.length - 2)
}

const form = ref({
  nameSurname: '',
  email: '',
  phone: '',
  address: '',
  balance: 0,
  soldProductsDesc: '',
  notes: ''
})

async function loadCustomers() {
  const res = await customerService.getAll()
  customers.value = res.data
}

async function createCustomer() {
  if (!form.value.nameSurname) {
    alert('Name Surname is required')
    return
  }

  await customerService.create(form.value)

  form.value = {
    nameSurname: '',
    email: '',
    phone: '',
    address: '',
    balance: 0,
    soldProductsDesc: '',
    notes: ''
  }

  loadCustomers()
}

async function deleteCustomer(id) {
  if (!confirm('Delete this customer?')) return
  await customerService.delete(id)
  loadCustomers()
}

onMounted(loadCustomers)
</script>
