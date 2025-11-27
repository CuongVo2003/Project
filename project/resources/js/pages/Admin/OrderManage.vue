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

function getStatusColor(status) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    processing: 'bg-blue-100 text-blue-700 border-blue-200',
    completed: 'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200'
  };
  return colors[status] || 'bg-slate-100 text-slate-700 border-slate-200';
}

function getStatusIcon(status) {
  const icons = {
    pending: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    processing: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    completed: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    cancelled: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
  };
  return icons[status] || 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Quản lý đơn hàng</h1>
            <p class="text-slate-600 text-sm mt-1">Theo dõi và xử lý các đơn hàng của khách hàng</p>
          </div>
        </div>

        <div class="flex items-center gap-2 mt-6">
          <span class="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200">
            <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <span class="text-sm font-semibold text-slate-700">
              Tổng: <span class="text-emerald-600">{{ orders.length }}</span> đơn hàng
            </span>
          </span>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="flex flex-col items-center gap-4">
          <div class="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-slate-600">Đang tải đơn hàng...</p>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="o in orders"
          :key="o.id"
          class="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100"
        >
          <div class="p-6">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-3">
                  <div class="p-2 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg">
                    <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-slate-900">
                      Đơn hàng #{{ o.id }}
                    </h3>
                    <p class="text-sm text-slate-600">
                      Khách hàng: <span class="font-semibold">{{ o.user?.name || 'Khách' }}</span>
                    </p>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-4 text-sm">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="text-slate-600">Tổng:</span>
                    <span class="font-bold text-red-600">{{ Number(o.total).toLocaleString() }}đ</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span class="text-slate-600">{{ o.created_at }}</span>
                  </div>
                </div>

                <div class="mt-3">
                  <span :class="['inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold border', getStatusColor(o.status)]">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getStatusIcon(o.status)"></path>
                    </svg>
                    {{ o.status }}
                  </span>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <button
                  @click="openDetail(o)"
                  class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  Xem chi tiết
                </button>

                <div class="grid grid-cols-3 gap-2">
                  <button
                    @click="changeStatus(o.id,'processing')"
                    class="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-xs font-medium hover:shadow-lg transform hover:scale-105 transition-all"
                    title="Đang xử lý"
                  >
                    <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                  </button>
                  <button
                    @click="changeStatus(o.id,'completed')"
                    class="px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-xs font-medium hover:shadow-lg transform hover:scale-105 transition-all"
                    title="Hoàn thành"
                  >
                    <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                  <button
                    @click="changeStatus(o.id,'cancelled')"
                    class="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-xs font-medium hover:shadow-lg transform hover:scale-105 transition-all"
                    title="Hủy"
                  >
                    <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </div>
      </div>

      <div
        v-if="showDetail"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
        @click.self="showDetail = false"
      >
        <div class="w-full max-w-3xl bg-white rounded-2xl shadow-2xl transform transition-all max-h-[90vh] overflow-hidden flex flex-col">
          <div class="flex items-center justify-between p-6 border-b border-slate-200">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-slate-900">Chi tiết đơn hàng #{{ detail?.id }}</h2>
                <p class="text-sm text-slate-600 mt-0.5">Thông tin chi tiết về đơn hàng</p>
              </div>
            </div>
            <button
              type="button"
              @click="showDetail = false"
              class="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div v-if="detail" class="p-6 overflow-y-auto flex-1">
            <div class="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 mb-6">
              <h3 class="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Thông tin khách hàng
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-slate-600">Tên:</span>
                  <span class="font-semibold text-slate-900 ml-2">{{ detail.user?.name || detail.shipping_name }}</span>
                </div>
                <div>
                  <span class="text-slate-600">Số điện thoại:</span>
                  <span class="font-semibold text-slate-900 ml-2">{{ detail.shipping_phone }}</span>
                </div>
                <div class="md:col-span-2">
                  <span class="text-slate-600">Địa chỉ:</span>
                  <span class="font-semibold text-slate-900 ml-2">{{ detail.shipping_address }}</span>
                </div>
              </div>
            </div>

            <div class="mb-6">
              <h3 class="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                Sản phẩm đã đặt
              </h3>
              <div class="space-y-3">
                <div
                  v-for="it in detail.items"
                  :key="it.id"
                  class="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div class="flex items-center gap-3 flex-1">
                    <div class="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                      <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="font-semibold text-slate-900">{{ it.product?.name || 'Sản phẩm' }}</p>
                      <p class="text-sm text-slate-600">Số lượng: {{ it.quantity }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-slate-900">{{ (it.price * it.quantity).toLocaleString() }}đ</p>
                    <p class="text-xs text-slate-600">{{ it.price.toLocaleString() }}đ × {{ it.quantity }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border-2 border-emerald-200">
              <div class="flex items-center justify-between">
                <span class="text-lg font-bold text-slate-900">Tổng cộng:</span>
                <span class="text-2xl font-bold text-emerald-600">{{ Number(detail.total).toLocaleString() }}đ</span>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-6 border-t border-slate-200 bg-slate-50">
            <button
              @click="showDetail = false"
              class="w-full px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>