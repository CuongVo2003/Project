<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
axios.defaults.baseURL = '/api';

const orders = ref([]);
const loading = ref(false);
const showDetail = ref(false);
const detail = ref(null);

onMounted(fetchOrders);

async function fetchOrders(){
  loading.value = true;
  try {
    // try admin endpoint first, fallback to /orders
    let res;
    try { res = await axios.get('/admin/orders'); }
    catch { res = await axios.get('/orders'); }
    orders.value = res.data.data || res.data;
  } catch (e) { console.error(e); } finally { loading.value = false; }
}

function openDetail(o){
  detail.value = o;
  showDetail.value = true;
}

async function changeStatus(orderId, status){
  if (!confirm('Đổi trạng thái đơn thành: ' + status + '?')) return;
  try {
    await axios.put(`/orders/${orderId}/status`, { status });
    alert('Đã cập nhật');
    await fetchOrders();
  } catch (e) { alert('Cập nhật thất bại'); }
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Quản lý đơn hàng</h1>
    <div v-if="loading" class="text-gray-500">Đang tải...</div>

    <div v-else class="space-y-3">
      <div v-for="o in orders" :key="o.id" class="bg-white rounded shadow p-4 flex items-start justify-between">
        <div>
          <div class="font-semibold">Đơn #{{ o.id }} — {{ o.user?.name || 'Khách' }}</div>
          <div class="text-sm text-gray-500">Tổng: <span class="font-bold text-red-600">{{ Number(o.total).toLocaleString() }}đ</span> • {{ o.created_at }}</div>
          <div class="text-sm mt-2">Trạng thái: <span class="font-semibold">{{ o.status }}</span></div>
        </div>

        <div class="flex flex-col gap-2">
          <button @click="openDetail(o)" class="px-3 py-1 bg-gray-200 rounded">Xem</button>
          <div class="flex gap-2">
            <button @click="changeStatus(o.id,'processing')" class="px-3 py-1 bg-yellow-500 text-white rounded">Processing</button>
            <button @click="changeStatus(o.id,'completed')" class="px-3 py-1 bg-green-600 text-white rounded">Completed</button>
            <button @click="changeStatus(o.id,'cancelled')" class="px-3 py-1 bg-red-600 text-white rounded">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetail" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg w-full max-w-2xl p-6">
        <h2 class="text-xl font-bold mb-3">Chi tiết đơn #{ { detail?.id } }</h2>
        <div v-if="detail">
          <div class="mb-3"><strong>Khách:</strong> {{ detail.user?.name || detail.shipping_name }}</div>
          <div class="mb-3"><strong>SĐT:</strong> {{ detail.shipping_phone }}</div>
          <div class="mb-3"><strong>Địa chỉ:</strong> {{ detail.shipping_address }}</div>

          <div class="mb-3">
            <h3 class="font-semibold">Sản phẩm</h3>
            <div class="mt-2 space-y-2">
              <div v-for="it in detail.items" :key="it.id" class="flex justify-between">
                <div>{{ it.product?.name || 'Sản phẩm' }} x{{ it.quantity }}</div>
                <div class="font-semibold">{{ (it.price * it.quantity).toLocaleString() }}đ</div>
              </div>
            </div>
          </div>

          <div class="text-right font-bold text-lg">Tổng: {{ Number(detail.total).toLocaleString() }}đ</div>
        </div>

        <div class="mt-4 text-right">
          <button @click="showDetail = false" class="px-4 py-2 bg-gray-200 rounded">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>