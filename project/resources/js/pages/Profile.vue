<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

axios.defaults.baseURL = '/api';

const user = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const { data } = await axios.get('/me');
    user.value = data;
  } catch (e) {
    error.value = 'Không thể lấy thông tin người dùng';
  } finally { loading.value = false; }
});

async function handleLogout() {
  try {
    await axios.post('/logout');
  } catch (_) {}
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
  window.location.reload();
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Thông tin tài khoản</h1>

    <div v-if="loading" class="text-gray-500">Đang tải...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else class="bg-white rounded-lg shadow p-6">
      <div class="mb-4">
        <h2 class="font-semibold">Họ tên</h2>
        <p>{{ user.name }}</p>
      </div>
      <div class="mb-4">
        <h2 class="font-semibold">Email</h2>
        <p>{{ user.email }}</p>
      </div>
      <div class="mb-4">
        <h2 class="font-semibold">Role</h2>
        <p>{{ user.role || 'user' }}</p>
      </div>

      <div class="flex gap-3">
        <button @click="handleLogout" class="px-4 py-2 bg-red-600 text-white rounded">Đăng xuất</button>
      </div>
    </div>
  </div>
</template>