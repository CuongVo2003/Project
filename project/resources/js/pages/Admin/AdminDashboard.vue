<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

axios.defaults.baseURL = '/api';

const stats = ref({ products: 0, categories: 0, orders: 0 });
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    // simple counts - fetch lists and count (backend can provide endpoints for stats)
    const [p, c, o] = await Promise.all([
      axios.get('/products'), // paginated
      axios.get('/categories'),
      axios.get('/orders') // will return user's orders; admin should have admin endpoint; fallback: 0
    ]);
    stats.value.products = p.data.total ?? (p.data.length || 0);
    stats.value.categories = (c.data.data ? c.data.data.length : c.data.length) || 0;
    stats.value.orders = o.data.total ?? (o.data.length || 0);
  } catch (e) {
    // ignore permission errors
    error.value = 'Không thể tải số liệu. Kiểm tra quyền hoặc API.';
  } finally { loading.value = false; }
});
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1>

    <div v-if="loading" class="text-gray-500">Đang tải...</div>
    <div v-if="error" class="text-red-600 mb-4">{{ error }}</div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white p-4 rounded shadow">
        <div class="text-sm text-gray-500">Sản phẩm</div>
        <div class="text-2xl font-bold">{{ stats.products }}</div>
        <div class="mt-3">
          <a href="#/admin/products" class="text-sm text-blue-600 underline">Quản lý sản phẩm</a>
        </div>
      </div>

      <div class="bg-white p-4 rounded shadow">
        <div class="text-sm text-gray-500">Danh mục</div>
        <div class="text-2xl font-bold">{{ stats.categories }}</div>
        <div class="mt-3">
          <a href="#/admin/categories" class="text-sm text-blue-600 underline">Quản lý danh mục</a>
        </div>
      </div>

      <div class="bg-white p-4 rounded shadow">
        <div class="text-sm text-gray-500">Đơn hàng</div>
        <div class="text-2xl font-bold">{{ stats.orders }}</div>
        <div class="mt-3">
          <a href="#/admin/orders" class="text-sm text-blue-600 underline">Quản lý đơn hàng</a>
        </div>
      </div>
    </div>
  </div>
</template>