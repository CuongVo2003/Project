<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  user: Object
});

const emit = defineEmits(['navigate']);

const categories = ref([]);
const featuredProducts = ref([]);
const loading = ref(true);

onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    fetchFeaturedProducts()
  ]);
  loading.value = false;
});

async function fetchCategories() {
  try {
    const { data } = await axios.get('/categories');
    categories.value = data.slice(0, 6);
  } catch (e) {
    console.error(e);
  }
}

async function fetchFeaturedProducts() {
  try {
    const { data } = await axios.get('/products', {
      params: { sort: 'latest', per_page: 8 }
    });
    featuredProducts.value = data.data || data;
  } catch (e) {
    console.error(e);
  }
}

function goToProducts(categoryId = null) {
  if (categoryId) {
    emit('navigate', 'products', { category: categoryId });
  } else {
    emit('navigate', 'products');
  }
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

const categoryIcons = ['💊', '🥤', '✨', '🌿', '🩺', '👶', '💄', '🏥'];
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Hero Banner -->
    <section class="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white overflow-hidden relative">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 class="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Sức khỏe là<br/>
              <span class="text-yellow-300">Hạnh phúc</span> của bạn
            </h1>
            <p class="text-xl mb-8 opacity-90">
              Hơn 10,000+ sản phẩm chính hãng với giá tốt nhất thị trường
            </p>
            <div class="flex gap-4">
              <button
                @click="goToProducts()"
                class="px-8 py-4 bg-white text-red-600 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                🛍️ Mua sắm ngay
              </button>
              <button class="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-white/30 transition-all duration-300">
                📱 Tải app
              </button>
            </div>
          </div>
          <div class="hidden md:flex justify-center">
            <div class="relative">
              <div class="w-80 h-80 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center text-9xl animate-float">
                💊
              </div>
              <div class="absolute -top-8 -right-8 w-24 h-24 bg-yellow-400 rounded-2xl flex items-center justify-center text-4xl animate-bounce">
                ⭐
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div class="text-5xl mb-3">🚚</div>
          <h3 class="font-bold text-gray-800 mb-1">Giao hàng 2h</h3>
          <p class="text-sm text-gray-600">Miễn phí với đơn >500k</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div class="text-5xl mb-3">💯</div>
          <h3 class="font-bold text-gray-800 mb-1">Chính hãng 100%</h3>
          <p class="text-sm text-gray-600">Cam kết hoàn tiền</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div class="text-5xl mb-3">🎁</div>
          <h3 class="font-bold text-gray-800 mb-1">Ưu đãi độc quyền</h3>
          <p class="text-sm text-gray-600">Giảm giá đến 50%</p>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div class="text-5xl mb-3">📞</div>
          <h3 class="font-bold text-gray-800 mb-1">Tư vấn 24/7</h3>
          <p class="text-sm text-gray-600">Dược sĩ tận tâm</p>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 py-16">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-3xl font-bold text-gray-800 mb-2">Danh mục nổi bật</h2>
          <p class="text-gray-600">Khám phá các sản phẩm theo danh mục</p>
        </div>
        <button
          @click="goToProducts()"
          class="text-red-600 font-semibold hover:text-red-700 flex items-center gap-2">
          Xem tất cả →
        </button>
      </div>

      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div v-for="i in 6" :key="i" class="bg-white rounded-2xl p-6 shadow-md animate-pulse">
          <div class="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-2xl"></div>
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <button
          v-for="(cat, idx) in categories"
          :key="cat.id"
          @click="goToProducts(cat.id)"
          class="bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
          <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
            {{ categoryIcons[idx] || '📦' }}
          </div>
          <h3 class="font-bold text-gray-800 mb-1 text-sm">{{ cat.name }}</h3>
          <p class="text-xs text-gray-500">{{ cat.products?.length || 0 }} sản phẩm</p>
        </button>
      </div>
    </section>

    <section class="bg-gradient-to-br from-red-50 to-orange-50 py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h2 class="text-3xl font-bold text-gray-800">Sản phẩm bán chạy</h2>
              <span class="px-4 py-1 bg-red-600 text-white rounded-full text-sm font-bold animate-pulse">
                🔥 HOT
              </span>
            </div>
            <p class="text-gray-600">Sản phẩm được yêu thích nhất</p>
          </div>
        </div>

        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="bg-white rounded-2xl shadow-lg animate-pulse">
            <div class="w-full h-48 bg-gray-200"></div>
            <div class="p-4">
              <div class="h-4 bg-gray-200 rounded mb-2"></div>
              <div class="h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div
            v-for="product in featuredProducts"
            :key="product.id"
            class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer">
            <div class="relative" @click="emit('navigate', 'product', { id: product.id })">
              <div class="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                <img
                  v-if="product.image_url"
                  :src="product.image_url"
                  :alt="product.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                <div v-else class="text-6xl">📦</div>
              </div>
              <div
                v-if="product.discount_percent > 0"
                class="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                -{{ product.discount_percent }}%
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-bold text-gray-800 line-clamp-2 mb-2 min-h-[3rem]">
                {{ product.name }}
              </h3>
              <div class="flex items-baseline gap-2 mb-3">
                <span class="text-xl font-bold text-red-600">
                  {{ (product.price_after_discount || product.price).toLocaleString() }}₫
                </span>
                <span v-if="product.discount_percent > 0" class="text-sm text-gray-400 line-through">
                  {{ product.price.toLocaleString() }}₫
                </span>
              </div>
              <button
                @click="addToCart(product)"
                :disabled="product.stock === 0"
                class="w-full py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                :class="product.stock > 0
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500'">
                {{ product.stock > 0 ? '🛒 Thêm vào giỏ' : 'Hết hàng' }}
              </button>
            </div>
          </div>
        </div>

        <div class="text-center mt-8">
          <button
            @click="goToProducts()"
            class="px-8 py-3 bg-white text-red-600 rounded-xl font-bold hover:shadow-xl transition-all duration-300">
            Xem tất cả sản phẩm →
          </button>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-800 mb-2">Tại sao chọn chúng tôi?</h2>
        <p class="text-gray-600">Chúng tôi cam kết mang đến trải nghiệm tốt nhất</p>
      </div>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-4xl">
            🏆
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Uy tín hàng đầu</h3>
          <p class="text-gray-600">10+ năm kinh nghiệm trong ngành dược phẩm</p>
        </div>
        <div class="text-center">
          <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-4xl">
            ✅
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Hàng chính hãng</h3>
          <p class="text-gray-600">100% sản phẩm nhập khẩu từ nguồn chính thống</p>
        </div>
        <div class="text-center">
          <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl">
            💝
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Chăm sóc tận tâm</h3>
          <p class="text-gray-600">Đội ngũ dược sĩ tư vấn 24/7 miễn phí</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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