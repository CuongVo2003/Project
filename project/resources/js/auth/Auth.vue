<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Product from './../product/index.vue';
import AuthCard from '../components/auth/AuthCard.vue';

const mode = ref('login'); // 'login' | 'register' | 'dashboard'
const user = ref(null);
const message = ref('');
const loading = ref(false);

// set base URL cho axios
axios.defaults.baseURL = '/api';

// Check token on mount
const savedToken = localStorage.getItem('token');
if (savedToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
  fetchMe();
}

async function fetchMe() {
  try {
    const { data } = await axios.get('/me');
    user.value = data;
    mode.value = 'dashboard';
  } catch (e) {
    localStorage.removeItem('token');
    mode.value = 'login';
  }
}

async function handleLogin(credentials) {
  loading.value = true;
  message.value = '';
  try {
    const { data } = await axios.post('/login', credentials);
    localStorage.setItem('token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    user.value = data.user;
    mode.value = 'dashboard';
  } catch (e) {
    message.value = e.response?.data?.message || 'Đăng nhập thất bại';
  } finally {
    loading.value = false;
  }
}

async function handleRegister(formData) {
  loading.value = true;
  message.value = '';
  try {
    const { data } = await axios.post('/register', formData);
    localStorage.setItem('token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    user.value = data.user;
    mode.value = 'dashboard';
  } catch (e) {
    message.value = e.response?.data?.message || e.response?.data?.errors 
      ? JSON.stringify(e.response.data.errors) 
      : 'Đăng ký thất bại';
  } finally {
    loading.value = false;
  }
}

async function handleLogout() {
  loading.value = true;
  try {
    await axios.post('/logout');
  } catch (e) {
    // ignore
  }
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
  user.value = null;
  mode.value = 'login';
  loading.value = false;
}
</script>

<template>
  <!-- DASHBOARD -->
  <div v-if="mode === 'dashboard'">
    <Product :user="user" @logout="handleLogout" />
  </div>

  <!-- AUTH FORMS -->
  <AuthCard
    v-else
    :loading="loading"
    :message="message"
    @login="handleLogin"
    @register="handleRegister" />
</template>

<style scoped>
body {
  margin: 0;
}
</style>