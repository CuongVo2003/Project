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
const quantity = ref(1);
const selectedImage = ref(0);

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
  if (existing) existing.quantity += quantity.value;
  else cart.push({ product_id: product.value.id, quantity: quantity.value, product: product.value });
  localStorage.setItem('cart', JSON.stringify(cart));
  
  const notification = document.createElement('div');
  notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
  notification.textContent = `✓ Đã thêm ${quantity.value} sản phẩm vào giỏ hàng!`;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

function buyNow() {
  addToCart();
  setTimeout(() => {
    window.location.href = '/cart';
  }, 500);
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
    <div class="max-w-7xl mx-auto px-4">
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-600">Đang tải...</p>
      </div>

      <div v-else-if="error" class="text-center py-20">
        <div class="text-6xl mb-4">❌</div>
        <p class="text-red-600 text-xl">{{ error }}</p>
      </div>

      <div v-else-if="product">
        <nav class="mb-6 text-sm text-gray-600">
          <span class="hover:text-red-600 cursor-pointer">Trang chủ</span>
          <span class="mx-2">/</span>
          <span class="hover:text-red-600 cursor-pointer">{{ product.category?.name || 'Danh mục' }}</span>
          <span class="mx-2">/</span>
          <span class="text-gray-800 font-medium">{{ product.name }}</span>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div class="space-y-4">
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden p-6">
              <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img 
                  v-if="product.image_url" 
                  :src="product.image_url" 
                  alt="" 
                  class="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-8xl">
                  📦
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-md p-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-3xl mb-1">✅</div>
                <div class="text-xs text-gray-600">Hàng chính hãng</div>
              </div>
              <div>
                <div class="text-3xl mb-1">🚚</div>
                <div class="text-xs text-gray-600">Miễn phí vận chuyển</div>
              </div>
              <div>
                <div class="text-3xl mb-1">🔄</div>
                <div class="text-xs text-gray-600">Đổi trả 7 ngày</div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-white rounded-2xl shadow-lg p-8">
              <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ product.name }}</h1>

              <div class="flex items-center gap-3 mb-4 pb-4 border-b">
                <div class="flex text-yellow-400">
                  ⭐⭐⭐⭐⭐
                </div>
                <span class="text-gray-600">(128 đánh giá)</span>
                <span class="text-gray-400">|</span>
                <span class="text-gray-600">Đã bán 1.2k</span>
              </div>

              <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 mb-6">
                <div class="flex items-baseline gap-4">
                  <span class="text-4xl font-bold text-red-600">
                    {{ (product.price_after_discount || product.price).toLocaleString() }}đ
                  </span>
                  <span v-if="product.discount_percent" class="text-xl text-gray-400 line-through">
                    {{ product.price.toLocaleString() }}đ
                  </span>
                </div>
                <div v-if="product.discount_percent" class="mt-2">
                  <span class="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    🔥 Giảm {{ product.discount_percent }}%
                  </span>
                </div>
              </div>

              <div class="space-y-3 mb-6 text-gray-700">
                <div class="flex items-center gap-3">
                  <span class="font-semibold min-w-[120px]">📁 Danh mục:</span>
                  <span>{{ product.category?.name || 'N/A' }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="font-semibold min-w-[120px]">📦 Tồn kho:</span>
                  <span :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'" class="font-semibold">
                    {{ product.stock > 0 ? `${product.stock} sản phẩm` : 'Hết hàng' }}
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="font-semibold min-w-[120px]">🏷️ Tình trạng:</span>
                  <span class="text-green-600 font-semibold">Còn hàng</span>
                </div>
              </div>

              <div class="mb-6">
                <label class="block font-semibold text-gray-700 mb-3">Số lượng:</label>
                <div class="flex items-center gap-3 bg-gray-100 rounded-lg p-1 w-fit">
                  <button 
                    @click="quantity = Math.max(1, quantity - 1)" 
                    class="w-12 h-12 bg-white rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 font-bold shadow-sm">
                    −
                  </button>
                  <input 
                    v-model.number="quantity" 
                    type="number" 
                    min="1" 
                    :max="product.stock"
                    class="w-20 text-center font-semibold text-xl border-0 bg-transparent focus:outline-none"
                  />
                  <button 
                    @click="quantity = Math.min(product.stock, quantity + 1)" 
                    class="w-12 h-12 bg-white rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 font-bold shadow-sm">
                    +
                  </button>
                </div>
              </div>
              <div class="flex gap-4">
                <button 
                  @click="addToCart" 
                  :disabled="product.stock === 0" 
                  class="flex-1 py-4 bg-white border-2 border-red-600 text-red-600 rounded-xl hover:bg-red-50 transition-all duration-300 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  🛒 Thêm vào giỏ
                </button>
                <button 
                  @click="buyNow" 
                  :disabled="product.stock === 0" 
                  class="flex-1 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                  ⚡ Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            📝 Mô tả sản phẩm
          </h2>
          <div class="prose max-w-none text-gray-700" v-html="product.description || '<em class=\'text-gray-400\'>Không có mô tả</em>'"></div>
        </div>

        <div v-if="related.length > 0" class="mb-12">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            🔗 Sản phẩm cùng danh mục
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div 
              v-for="p in related" 
              :key="p.id" 
              class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 cursor-pointer group">
              <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                <img 
                  v-if="p.image_url" 
                  :src="p.image_url" 
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
                  📦
                </div>
              </div>
              <div class="font-semibold text-sm text-gray-800 mb-2 line-clamp-2 group-hover:text-red-600 transition">
                {{ p.name }}
              </div>
              <div class="text-red-600 font-bold text-lg">
                {{ (p.price_after_discount || p.price).toLocaleString() }}đ
              </div>
            </div>
          </div>
        </div>
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>