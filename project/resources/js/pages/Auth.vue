<script setup>
import { ref } from 'vue';
import axios from 'axios';

axios.defaults.baseURL = '/api';

const mode = ref('login'); // 'login' | 'register'
const loading = ref(false);
const errors = ref(null);

const loginForm = ref({ email: '', password: '' });
const registerForm = ref({ name: '', email: '', password: '', password_confirmation: '' });

async function submitLogin() {
  loading.value = true;
  errors.value = null;
  try {
    const { data } = await axios.post('/login', loginForm.value);
    localStorage.setItem('token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    // reload to let App.vue fetch /me
    window.location.reload();
  } catch (e) {
    errors.value = e.response?.data?.message || (e.response?.data || e).errors || 'Login failed';
  } finally { loading.value = false; }
}

async function submitRegister() {
  loading.value = true;
  errors.value = null;
  try {
    const { data } = await axios.post('/register', registerForm.value);
    localStorage.setItem('token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    window.location.reload();
  } catch (e) {
    errors.value = e.response?.data?.message || (e.response?.data || e).errors || 'Register failed';
  } finally { loading.value = false; }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div class="w-full max-w-md bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold mb-4" v-if="mode === 'login'">Đăng nhập</h2>
      <h2 class="text-2xl font-bold mb-4" v-else>Đăng ký</h2>

      <div v-if="errors" class="mb-3 text-red-600 text-sm">
        <pre class="whitespace-pre-wrap text-xs">{{ errors }}</pre>
      </div>

      <form @submit.prevent="mode === 'login' ? submitLogin() : submitRegister()" class="space-y-3">
        <div v-if="mode === 'register'">
          <label class="text-sm">Họ tên</label>
          <input v-model="registerForm.name" class="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label class="text-sm">Email</label>
          <input v-if="mode === 'login'" v-model="loginForm.email" type="email" class="w-full px-3 py-2 border rounded" />
          <input v-else v-model="registerForm.email" type="email" class="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label class="text-sm">Mật khẩu</label>
          <input v-if="mode === 'login'" v-model="loginForm.password" type="password" class="w-full px-3 py-2 border rounded" />
          <input v-else v-model="registerForm.password" type="password" class="w-full px-3 py-2 border rounded" />
        </div>

        <div v-if="mode === 'register'">
          <label class="text-sm">Xác nhận mật khẩu</label>
          <input v-model="registerForm.password_confirmation" type="password" class="w-full px-3 py-2 border rounded" />
        </div>

        <div class="flex items-center justify-between">
          <button :disabled="loading" class="px-4 py-2 bg-red-600 text-white rounded">
            {{ loading ? 'Đang...' : (mode === 'login' ? 'Đăng nhập' : 'Đăng ký') }}
          </button>

          <button type="button" @click="mode = mode === 'login' ? 'register' : 'login'" class="text-sm text-gray-600 underline">
            {{ mode === 'login' ? 'Tạo tài khoản mới' : 'Đã có tài khoản? Đăng nhập' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>