// ...existing code...
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Auth from './auth/Auth.vue';
import ProductPage from './product/index.vue';

axios.defaults.baseURL = '/api';

const user = ref(null);
const mode = ref('loading'); // 'auth' | 'product'

const token = localStorage.getItem('token');
if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

onMounted(async () => {
  try {
    const { data } = await axios.get('/me');
    user.value = data;
    mode.value = 'product';
  } catch (e) {
    user.value = null;
    mode.value = 'auth';
  }
});

function handleLoginSuccess(payload) {
  // payload should contain { token, user }
  localStorage.setItem('token', payload.token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`;
  user.value = payload.user;
  mode.value = 'product';
}

async function handleLogout() {
  try { await axios.post('/logout'); } catch(e){/* ignore */ }
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
  user.value = null;
  mode.value = 'auth';
}
</script>

<template>
  <div>
    <Auth v-if="mode === 'auth'" @login-success="handleLoginSuccess" />
    <ProductPage v-else :user="user" @logout="handleLogout" />
  </div>
</template>
<style scoped>
body { margin: 0; }
</style>
// ...existing code...