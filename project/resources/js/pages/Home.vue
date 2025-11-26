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
  alert('Thêm vào giỏ hàng thành công!');
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Sidebar Filter -->
      <aside class="lg:col-span-1">
        <FilterSidebar
          :categories="categories"
          :filters="filters"
          @change-filter="handleFilterChange" />
      </aside>

      <!-- Main Content -->
      <main class="lg:col-span-3">
        <!-- Sort & Results -->
        <div class="mb-6 flex justify-between items-center">
          <p class="text-gray-600">Tìm thấy {{ products.length }} sản phẩm</p>
          <select
            v-model="sort"
            @change="handleSortChange"
            class="px-4 py-2 border border-gray-300 rounded-lg">
            <option value="latest">Mới nhất</option>
            <option value="price_asc">Giá: Thấp → Cao</option>
            <option value="price_desc">Giá: Cao → Thấp</option>
            <option value="popular">Bán chạy</option>
          </select>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            :user="props.user"
            @view="emit('navigate', 'product', { id: $event })"
            @add-to-cart="addToCart" />
        </div>

        <div v-if="products.length === 0" class="text-center py-16 text-gray-400">
          <p class="text-2xl">📭 Không tìm thấy sản phẩm</p>
        </div>
      </main>
    </div>
  </div>
</template>