<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import FilterSidebar from '../components/FilterSidebar.vue';
import ProductCard from '../components/ProductCard.vue';

const props = defineProps({
  user: Object
});

const emit = defineEmits(['navigate']);

axios.defaults.baseURL = '/api';

const products = ref([]);
const categories = ref([]);
const filters = ref({ category_id: null, min_price: 0, max_price: 999999999 });
const sort = ref('latest');
const currentPage = ref(1);
const showFilters = ref(false);

onMounted(() => {
  fetchCategories();
  fetchProducts();
});

async function fetchCategories() {
  try {
    const { data } = await axios.get('/categories');
    categories.value = data;
  } catch (e) {
    console.error(e);
  }
}

async function fetchProducts() {
  try {
    const params = { ...filters.value, sort: sort.value, page: currentPage.value };
    const { data } = await axios.get('/products', { params });
    products.value = data.data;
  } catch (e) {
    console.error(e);
  }
}

function handleFilterChange(newFilters) {
  filters.value = { ...filters.value, ...newFilters };
  currentPage.value = 1;
  fetchProducts();
}

function handleSortChange(newSort) {
  sort.value = newSort;
  fetchProducts();
}

function addToCart(product) {
  if (!props.user) {
    alert('Vui lòng đăng nhập trước');
    emit('navigate', 'auth');
    return;
  }

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existing = cart.find(item => item.product_id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ product_id: product.id, quantity: 1, product });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  
  const notification = document.createElement('div');
  notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
  notification.textContent = '✓ Đã thêm vào giỏ hàng!';
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}
</script>

<template>
  <div class="bg-gradient-to-b from-gray-50 to-white">
    <div class="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white">
      <div class="max-w-7xl mx-auto px-4 py-16">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            🛍️ Chào mừng đến với cửa hàng
          </h1>
          <p class="text-xl md:text-2xl mb-8 opacity-90">
            Khám phá hàng ngàn sản phẩm chất lượng với giá tốt nhất
          </p>
          <div class="flex justify-center gap-4">
            <div class="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <div class="text-3xl font-bold">1000+</div>
              <div class="text-sm">Sản phẩm</div>
            </div>
            <div class="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <div class="text-3xl font-bold">24/7</div>
              <div class="text-sm">Hỗ trợ</div>
            </div>
            <div class="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <div class="text-3xl font-bold">Free</div>
              <div class="text-sm">Vận chuyển</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="lg:hidden mb-4">
          <button
            @click="showFilters = !showFilters"
            class="w-full px-4 py-3 bg-white rounded-lg shadow-md flex items-center justify-between hover:shadow-lg transition"
          >
            <span class="font-semibold">🔍 Bộ lọc</span>
            <span>{{ showFilters ? '▲' : '▼' }}</span>
          </button>
        </div>

        <aside 
          :class="[
            'lg:col-span-1',
            showFilters ? 'block' : 'hidden lg:block'
          ]"
        >
          <div class="sticky top-4">
            <FilterSidebar
              :categories="categories"
              :filters="filters"
              @change-filter="handleFilterChange" />
          </div>
        </aside>

        <main class="lg:col-span-3">
          <div class="mb-6 bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="text-2xl">📦</span>
              <p class="text-gray-700 font-medium">
                Tìm thấy <span class="text-red-600 font-bold">{{ products.length }}</span> sản phẩm
              </p>
            </div>
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <label class="text-sm text-gray-600 whitespace-nowrap">Sắp xếp:</label>
              <select
                v-model="sort"
                @change="handleSortChange"
                class="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              >
                <option value="latest">🆕 Mới nhất</option>
                <option value="price_asc">💰 Giá: Thấp → Cao</option>
                <option value="price_desc">💎 Giá: Cao → Thấp</option>
                <option value="popular">🔥 Bán chạy</option>
              </select>
            </div>
          </div>

          <div v-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
              :user="props.user"
              @view="emit('navigate', 'product', { id: $event })"
              @add-to-cart="addToCart" />
          </div>

          <div v-else class="text-center py-20">
            <div class="text-8xl mb-6">🔍</div>
            <h3 class="text-2xl font-bold text-gray-700 mb-2">Không tìm thấy sản phẩm</h3>
            <p class="text-gray-500 mb-6">Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm khác</p>
            <button
              @click="filters = { category_id: null, min_price: 0, max_price: 999999999 }; fetchProducts()"
              class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-lg"
            >
              Xóa bộ lọc
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style>