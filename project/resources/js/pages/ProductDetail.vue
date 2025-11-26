<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

axios.defaults.baseURL = '/api';

const route = useRoute ? useRoute() : null;
const router = useRouter ? useRouter() : null;

const props = defineProps({
  id: [String, Number]
});

const product = ref(null);
const related = ref([]);
const loading = ref(true);
const error = ref(null);

// determine id: prop > route.params.id > query.id
const productId = props.id || (route && (route.params.id || route.query.id)) || null;

onMounted(async () => {
  if (!productId) {
    error.value = 'Không xác định sản phẩm';
    loading.value = false;
    return;
  }
  try {
    const { data } = await axios.get(`/products/${productId}`);
    product.value = data;
    // fetch related by same category (first 6)
    if (product.value?.category_id) {
      const { data: r } = await axios.get('/products', { params: { category_id: product.value.category_id, page: 1 } });
      related.value = (r.data || r).filter(p => p.id !== product.value.id).slice(0,6);
    }
  } catch (e) {
    error.value = 'Không thể tải sản phẩm';
  } finally { loading.value = false; }
});

function addToCart() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existing = cart.find(i => i.product_id === product.value.id);
  if (existing) existing.quantity += 1;
  else cart.push({ product_id: product.value.id, quantity: 1, product: product.value });
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Đã thêm vào giỏ hàng');
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <div v-if="loading" class="text-gray-500">Đang tải...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1">
        <div v-if="product.image_url" class="w-full h-80 bg-gray-100 overflow-hidden rounded">
          <img :src="product.image_url" alt="" class="w-full h-full object-cover" />
        </div>
      </div>

      <div class="lg:col-span-2">
        <h1 class="text-2xl font-bold mb-2">{{ product.name }}</h1>
        <div class="mb-3 text-red-600 text-xl font-bold">
          {{ (product.price_after_discount || product.price).toLocaleString() }}đ
          <span v-if="product.discount_percent" class="ml-3 text-sm line-through text-gray-400">{{ product.price.toLocaleString() }}đ</span>
        </div>
        <div class="mb-4 text-sm text-gray-700">
          <strong>Danh mục:</strong> {{ product.category?.name || 'N/A' }} |
          <strong>Tồn kho:</strong> {{ product.stock }}
        </div>

        <div class="prose mb-6" v-html="product.description || '<em>Không có mô tả</em>'"></div>

        <div class="flex gap-3">
          <button @click="addToCart" :disabled="product.stock === 0" class="px-4 py-2 bg-red-600 text-white rounded">
            🛒 Thêm vào giỏ
          </button>
          <button @click="alert('Mua ngay (demo)')" :disabled="product.stock === 0" class="px-4 py-2 bg-green-600 text-white rounded">
            Mua ngay
          </button>
        </div>

        <div class="mt-8">
          <h3 class="text-lg font-semibold mb-3">Sản phẩm cùng danh mục</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="p in related" :key="p.id" class="bg-white rounded shadow p-3">
              <img v-if="p.image_url" :src="p.image_url" class="w-full h-28 object-cover rounded mb-2" />
              <div class="font-semibold">{{ p.name }}</div>
              <div class="text-red-600 font-bold">{{ (p.price_after_discount || p.price).toLocaleString() }}đ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>