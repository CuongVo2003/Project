<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  user: Object
});

const emit = defineEmits(['navigate']);

axios.defaults.baseURL = '/api';

const cart = ref([]);
const loading = ref(false);
const form = ref({
  shipping_name: props.user?.name || '',
  shipping_phone: '',
  shipping_address: ''
});

onMounted(() => {
  cart.value = JSON.parse(localStorage.getItem('cart') || '[]');
});

const total = computed(() => {
  return cart.value.reduce((sum, item) => {
    const price = item.product?.price_after_discount || item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);
});

async function submitOrder() {
  if (!form.value.shipping_name || !form.value.shipping_phone || !form.value.shipping_address) {
    alert('Vui lòng điền đầy đủ thông tin giao hàng');
    return;
  }

  loading.value = true;
  try {
    const payload = {
      items: cart.value.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      })),
      ...form.value
    };

    const { data } = await axios.post('/orders', payload);
    alert('Đặt hàng thành công! Mã đơn: ' + data.id);
    localStorage.removeItem('cart');
    emit('navigate', 'home');
  } catch (e) {
    alert('Lỗi: ' + (e.response?.data?.message || 'Đặt hàng thất bại'));
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">💳 Thanh Toán</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Form -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-2xl font-bold mb-6">Thông tin giao hàng</h2>
          <form @submit.prevent="submitOrder" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold mb-2">Họ và tên *</label>
              <input v-model="form.shipping_name" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
            </div>

            <div>
              <label class="block text-sm font-semibold mb-2">Số điện thoại *</label>
              <input v-model="form.shipping_phone" type="tel" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
            </div>

            <div>
              <label class="block text-sm font-semibold mb-2">Địa chỉ giao hàng *</label>
              <textarea v-model="form.shipping_address" class="w-full px-4 py-2 border border-gray-300 rounded-lg" rows="3" required></textarea>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold disabled:bg-gray-400">
              {{ loading ? 'Đang xử lý...' : 'Đặt Hàng' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="bg-white rounded-lg shadow p-6 h-fit">
        <h2 class="text-2xl font-bold mb-4">Đơn hàng của bạn</h2>
        <div class="space-y-3 mb-4 border-b pb-4 max-h-64 overflow-y-auto">
          <div v-for="item in cart" :key="item.product_id" class="flex justify-between text-sm">
            <span>{{ item.product?.name }} x{{ item.quantity }}</span>
            <span class="font-semibold">{{ ((item.product?.price_after_discount || item.product?.price || 0) * item.quantity).toLocaleString() }}đ</span>
          </div>
        </div>
        <div class="flex justify-between text-lg font-bold">
          <span>Tổng:</span>
          <span class="text-red-600">{{ total.toLocaleString() }}đ</span>
        </div>
      </div>
    </div>
  </div>
</template>