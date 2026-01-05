<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="title">ERP1</h1>
      <p class="subtitle">Yeni Hesap Oluştur</p>

      <input v-model="companyName" placeholder="Firma Adı" />
      <br /><br />

      <input v-model="username" placeholder="Username" />
      <br /><br />

      <input v-model="password" type="password" placeholder="Password" />
      <br /><br />

      <button :disabled="loading" @click="register">
        {{ loading ? 'Creating...' : 'Register' }}
      </button>

      <p class="error" v-if="error">{{ error }}</p>

      <p class="link">
        Zaten hesabın var mı?
        <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const companyName = ref('')
const username = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)

const auth = useAuthStore()
const router = useRouter()

async function register() {
  loading.value = true
  error.value = null

  try {
    await auth.register(
      companyName.value,
      username.value,
      password.value
    )
    router.push('/')
  } catch (e) {
    error.value = e.response?.data?.message || 'Register failed'
  } finally {
    loading.value = false
  }
}
</script>
