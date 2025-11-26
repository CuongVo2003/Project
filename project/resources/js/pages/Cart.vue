<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  user: Object
});

const emit = defineEmits(['navigate']);

const cart = ref([]);
const cartItems = ref([]);

onMounted(() => {
  loadCart();
});

function loadCart() {
  cart.value = JSON.parse(localStorage.getItem('cart') || '[]');
  cartItems.value = cart.value.map(item => ({
    ...item,
    product: item.product || {}
  }));
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity <= 0) {
    removeItem(productId);
    return;
  }

  const item = cart.value.find(i => i.product_id === productId);
  if (item) {
    item.quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart.value));
    loadCart();
  }
}

function removeItem(productId) {
  cart.value = cart.value.filter(i => i.product_id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart.value));
  loadCart();
}

const total = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    const price = item.product.price_after_discount || item.product.price || 0;
    return sum + price * item.quantity;
  }, 0);
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">🛒 Giỏ Hàng Của Bạn</h1>

    <div v-if="cartItems.length === 0" class="text-center py-16">
      <p class="text-2xl text-gray-400 mb-4">Giỏ hàng trống</p>
      <button
        @click="emit('navigate', 'home')"
        class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
        Tiếp tục mua sắm
      </button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cartItems"
          :key="item.product_id"
          class="bg-white rounded-lg shadow p-4 flex gap-4">
          <img v-if="item.product.image_url" :src="item.product.image_url" alt="" class="w-24 h-24 object-cover rounded" />
          <div class="flex-1">
            <h3 class="font-semibold text-lg">{{ item.product.name }}</h3>
            <p class="text-red-600 font-bold">{{ (item.product.price_after_discount || item.product.price).toLocaleString() }}đ</p>
            <div class="flex items-center gap-2 mt-2">
              <button @click="updateQuantity(item.product_id, item.quantity - 1)" class="px-3 py-1 bg-gray-200 rounded">-</button>
              <span class="px-4 py-1 border rounded">{{ item.quantity }}</span>
              <button @click="updateQuantity(item.product_id, item.quantity + 1)" class="px-3 py-1 bg-gray-200 rounded">+</button>
              <button @click="removeItem(item.product_id)" class="ml-auto text-red-600 font-bold">Xóa</button>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 h-fit">
        <h2 class="text-2xl font-bold mb-4">Tóm tắt đơn hàng</h2>
        <div class="space-y-3 mb-4 border-b pb-4">
          <div class="flex justify-between">
            <span>Tạm tính:</span>
            <span class="font-semibold">{{ total.toLocaleString() }}đ</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Phí vận chuyển:</span>
            <span>0đ</span>
          </div>
        </div>
        <div class="flex justify-between text-lg font-bold mb-6">
          <span>Tổng cộng:</span>
          <span class="text-red-600">{{ total.toLocaleString() }}đ</span>
        </div>
        <button
          @click="emit('navigate', 'checkout')"
          class="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold">
          Thanh toán
        </button>
      </div>
    </div>
  </div>
</template>