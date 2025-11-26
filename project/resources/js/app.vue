<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Header from './components/Header.vue';
import Home from './pages/Home.vue';
import ProductDetail from './pages/ProductDetail.vue';
import Cart from './pages/Cart.vue';
import Checkout from './pages/Checkout.vue';
import Profile from './pages/Profile.vue';
import Auth from './pages/Auth.vue';
import AdminDashboard from './pages/Admin/AdminDashboard.vue';
import ProductManage from './pages/Admin/ProductManage.vue';
import CategoryManage from './pages/Admin/CategoryManage.vue';
import OrderManage from './pages/Admin/OrderManage.vue';

axios.defaults.baseURL = '/api';

const user = ref(null);
const currentPage = ref('home');
const cartCount = computed(() => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

onMounted(async () => {
  try {
    const { data } = await axios.get('/me');
    user.value = data;
  } catch (e) {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    user.value = null;
  }
});

async function handleLogout() {
  try {
    await axios.post('/logout');
  } catch (_) {}
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
  user.value = null;
  currentPage.value = 'home';
}

function navigateTo(page, params = {}) {
  // nếu user không phải admin nhưng cố gắng vào admin page → chặn
  if (page.startsWith('admin/') && (!user.value || user.value.role !== 'admin')) {
    alert('Bạn không có quyền truy cập');
    return;
  }
  currentPage.value = page;
}

function handleLogin() {
  window.location.reload();
}

function handleRegister() {
  window.location.reload();
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Header 
      :user="user" 
      :cart-count="cartCount"
      @navigate="navigateTo"
      @logout="handleLogout" />

    <!-- Navigation bar cho admin -->
    <nav v-if="user?.role === 'admin'" class="bg-gray-800 text-white px-4 py-3">
      <div class="max-w-7xl mx-auto flex gap-6">
        <button @click="navigateTo('admin/dashboard')" class="hover:text-yellow-400">Dashboard</button>
        <button @click="navigateTo('admin/products')" class="hover:text-yellow-400">Quản lý sản phẩm</button>
        <button @click="navigateTo('admin/categories')" class="hover:text-yellow-400">Quản lý danh mục</button>
        <button @click="navigateTo('admin/orders')" class="hover:text-yellow-400">Quản lý đơn hàng</button>
        <button @click="navigateTo('home')" class="ml-auto hover:text-yellow-400">← Về trang chủ</button>
      </div>
    </nav>

    <main>
      <Home v-if="currentPage === 'home'" :user="user" @navigate="navigateTo" />
      <ProductDetail v-else-if="currentPage === 'product'" :user="user" @navigate="navigateTo" />
      <Cart v-else-if="currentPage === 'cart'" :user="user" @navigate="navigateTo" />
      <Checkout v-else-if="currentPage === 'checkout'" :user="user" @navigate="navigateTo" />
      <Profile v-else-if="currentPage === 'profile'" :user="user" @logout="handleLogout" />
      <Auth v-else-if="currentPage === 'auth'" @login="handleLogin" @register="handleRegister" />

      <!-- Admin Pages -->
      <AdminDashboard v-else-if="currentPage === 'admin/dashboard'" :user="user" />
      <ProductManage v-else-if="currentPage === 'admin/products'" :user="user" />
      <CategoryManage v-else-if="currentPage === 'admin/categories'" :user="user" />
      <OrderManage v-else-if="currentPage === 'admin/orders'" :user="user" />
    </main>
  </div>
</template>