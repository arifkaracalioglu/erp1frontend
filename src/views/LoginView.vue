<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="title">ERP1</h1>
      <p class="subtitle">Enterprise Resource Planning</p>

      <input v-model="username" placeholder="Username" />
      <br /><br />
      <input v-model="password" type="password" placeholder="Password" />
      <br /><br />

      <button :disabled="loading" @click="login">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>

      <p class="link">
        Hesabın yok mu?
        <router-link to="/register">Kayıt Ol</router-link>
      </p>

      <p class="error" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)

const auth = useAuthStore()
const router = useRouter()

async function login() {
  loading.value = true
  error.value = null
  try {
    await auth.login(username.value, password.value)
    router.push('/')
  } catch {
    error.value = 'Invalid username or password'
  } finally {
    loading.value = false
  }
}
</script>
