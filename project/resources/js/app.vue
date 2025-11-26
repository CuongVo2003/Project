<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute, RouterView, RouterLink } from 'vue-router';
import axios from 'axios';
import Header from './components/Header.vue';

axios.defaults.baseURL = '/api';

const router = useRouter();
const route = useRoute();

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
  } catch (e) {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common.Authorization;
    user.value = null;
  }
});

async function handleLogout() {
  try {
    await axios.post('/logout');
  } catch (_) {}
  localStorage.removeItem('token');
  delete axios.defaults.headers.common.Authorization;
  user.value = null;
  router.push({ name: 'home' });
}

function navigateTo(page, params = {}) {
  if (page.startsWith('admin.') && (!user.value || user.value.role !== 'admin')) {
    alert('Bạn không có quyền truy cập');
    return;
  }

  switch (page) {
    case 'home':
      router.push({ name: 'home' });
      break;
    case 'product':
      router.push({ name: 'product.show', params: { id: params.id } });
      break;
    case 'cart':
      router.push({ name: 'cart' });
      break;
    case 'checkout':
      router.push({ name: 'checkout' });
      break;
    case 'profile':
      router.push({ name: 'profile' });
      break;
    case 'auth':
      router.push({ name: 'auth' });
      break;
    default:
      router.push({ name: page });
  }
}

const isAdmin = computed(() => user.value?.role === 'admin');
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Header
      :user="user"
      :cart-count="cartCount"
      @navigate="navigateTo"
      @logout="handleLogout"
    />

    <nav v-if="isAdmin" class="bg-gray-800 text-white px-4 py-3">
      <div class="max-w-7xl mx-auto flex gap-6 items-center">
        <RouterLink
          :to="{ name: 'admin.dashboard' }"
          class="hover:text-yellow-400"
        >
          Dashboard
        </RouterLink>
        <RouterLink
          :to="{ name: 'admin.products' }"
          class="hover:text-yellow-400"
        >
          Quản lý sản phẩm
        </RouterLink>
        <RouterLink
          :to="{ name: 'admin.categories' }"
          class="hover:text-yellow-400"
        >
          Quản lý danh mục
        </RouterLink>
        <RouterLink
          :to="{ name: 'admin.orders' }"
          class="hover:text-yellow-400"
        >
          Quản lý đơn hàng
        </RouterLink>

        <RouterLink
          :to="{ name: 'home' }"
          class="ml-auto hover:text-yellow-400"
        >
          ← Về trang chủ
        </RouterLink>
      </div>
    </nav>

    <main>
      <RouterView v-slot="{ Component }">
        <component
          :is="Component"
          :user="user"
          @navigate="navigateTo"
          @logout="handleLogout"
        />
      </RouterView>
    </main>
  </div>
</template>
