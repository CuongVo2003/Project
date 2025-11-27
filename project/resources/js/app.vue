<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, RouterView } from 'vue-router';
import axios from 'axios';
import Header from './components/Header.vue';

axios.defaults.baseURL = '/api';

const router = useRouter();
const user = ref(null);

const cartCount = computed(() => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
}

onMounted(async () => {
  try {
    const { data } = await axios.get('/me');
    user.value = data;
    localStorage.setItem('user', JSON.stringify(data));
  } catch (e) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common.Authorization;
    user.value = null;
  }
});

async function handleLogout() {
  try {
    await axios.post('/logout');
  } catch (_) {}
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common.Authorization;
  user.value = null;
  router.push({ name: 'home' });
}

function navigateTo(page, params = {}) {
  if (page.startsWith('admin.') && (!user.value || user.value.role !== 'admin')) {
    alert('Bạn không có quyền truy cập');
    return;
  }

  try {
    if (page === 'product') {
      router.push({ name: 'product.show', params: { id: params.id } });
    } else if (page === 'products') {
      router.push({ name: 'products', query: params });
    } else if (page === 'home') {
      router.push({ name: 'home' });
    } else if (page === 'cart') {
      router.push({ name: 'cart' });
    } else if (page === 'checkout') {
      router.push({ name: 'checkout' });
    } else if (page === 'profile') {
      router.push({ name: 'profile' });
    } else if (page === 'auth') {
      router.push({ name: 'auth' });
    } else if (page.startsWith('admin.')) {
      router.push({ name: page });
    } else {
      router.push({ name: page });
    }
  } catch (error) {
    console.error('Navigation error:', error);
  }
}

const isAdmin = computed(() => user.value?.role === 'admin');
const isAdminRoute = computed(() => router.currentRoute.value.path.startsWith('/admin'));
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
    <Header
      :user="user"
      :cart-count="cartCount"
      @navigate="navigateTo"
      @logout="handleLogout"
    />

    <nav v-if="isAdmin && isAdminRoute" class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-xl border-b border-gray-700">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex flex-wrap gap-2 md:gap-6 items-center">
          <router-link
            :to="{ name: 'admin.dashboard' }"
            class="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center gap-2 font-medium"
            active-class="bg-white/20 shadow-lg"
          >
            <span>📊</span>
            <span class="hidden sm:inline">Dashboard</span>
          </router-link>
          <router-link
            :to="{ name: 'admin.products' }"
            class="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center gap-2 font-medium"
            active-class="bg-white/20 shadow-lg"
          >
            <span>📦</span>
            <span class="hidden sm:inline">Quản lý sản phẩm</span>
          </router-link>
          <router-link
            :to="{ name: 'admin.categories' }"
            class="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center gap-2 font-medium"
            active-class="bg-white/20 shadow-lg"
          >
            <span>🏷️</span>
            <span class="hidden sm:inline">Quản lý danh mục</span>
          </router-link>
          <router-link
            :to="{ name: 'admin.orders' }"
            class="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center gap-2 font-medium"
            active-class="bg-white/20 shadow-lg"
          >
            <span>🛍️</span>
            <span class="hidden sm:inline">Quản lý đơn hàng</span>
          </router-link>

          <router-link
            :to="{ name: 'home' }"
            class="ml-auto px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg"
          >
            <span>←</span>
            <span class="hidden sm:inline">Về trang chủ</span>
          </router-link>
        </div>
      </div>
    </nav>

    <main class="min-h-[calc(100vh-64px)]">
      <RouterView
        :user="user"
        @navigate="navigateTo"
        @logout="handleLogout"
      />
    </main>

    <footer class="bg-gray-900 text-gray-300 mt-16">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-white font-bold text-lg mb-4">Về chúng tôi</h3>
            <p class="text-sm">Cửa hàng thương mại điện tử hàng đầu Việt Nam</p>
          </div>
          <div>
            <h3 class="text-white font-bold text-lg mb-4">Chính sách</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white transition">Chính sách đổi trả</a></li>
              <li><a href="#" class="hover:text-white transition">Chính sách bảo hành</a></li>
              <li><a href="#" class="hover:text-white transition">Chính sách vận chuyển</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-bold text-lg mb-4">Hỗ trợ</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white transition">Liên hệ</a></li>
              <li><a href="#" class="hover:text-white transition">FAQ</a></li>
              <li><a href="#" class="hover:text-white transition">Hướng dẫn mua hàng</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-bold text-lg mb-4">Theo dõi</h3>
            <div class="flex gap-4">
              <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition">f</a>
              <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition">📷</a>
              <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition">in</a>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© 2024 E-Commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>