<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

axios.defaults.baseURL = '/api';

const user = ref(null);
const loading = ref(true);
const error = ref(null);
const activeTab = ref('info');

onMounted(async () => {
  try {
    const { data } = await axios.get('/me');
    user.value = data;
  } catch (e) {
    error.value = 'Không thể lấy thông tin người dùng';
  } finally { loading.value = false; }
});

async function handleLogout() {
  try {
    await axios.post('/logout');
  } catch (_) {}
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
  window.location.reload();
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
    <div class="max-w-5xl mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          👤 Tài Khoản Của Tôi
        </h1>
        <p class="text-gray-600">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
      </div>
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-600">Đang tải...</p>
      </div>
      <div v-else-if="error" class="text-center py-20">
        <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
          <div class="text-6xl mb-4">❌</div>
          <p class="text-red-600 text-xl mb-6">{{ error }}</p>
          <button 
            @click="window.location.reload()" 
            class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Thử lại
          </button>
        </div>
      </div>
      <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">

        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-red-600 to-orange-500 p-6 text-white text-center">
              <div class="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-3 flex items-center justify-center text-4xl font-bold">
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
              <h2 class="font-bold text-xl mb-1">{{ user.name }}</h2>
              <p class="text-sm opacity-90">{{ user.email }}</p>
            </div>

            <div class="p-2">
              <button
                @click="activeTab = 'info'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 font-medium',
                  activeTab === 'info' ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'
                ]">
                <span class="text-xl">📋</span>
                <span>Thông tin cá nhân</span>
              </button>
              <button
                @click="activeTab = 'orders'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 font-medium',
                  activeTab === 'orders' ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'
                ]">
                <span class="text-xl">📦</span>
                <span>Đơn hàng của tôi</span>
              </button>
              <button
                @click="activeTab = 'security'"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 font-medium',
                  activeTab === 'security' ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'
                ]">
                <span class="text-xl">🔒</span>
                <span>Bảo mật</span>
              </button>
              <hr class="my-2">
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-3 font-medium">
                <span class="text-xl">🚪</span>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-3">
          <div v-if="activeTab === 'info'" class="bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              📋 Thông tin cá nhân
            </h2>

            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-50 rounded-lg p-5">
                  <label class="block text-sm font-semibold text-gray-600 mb-2">Họ và tên</label>
                  <p class="text-lg font-semibold text-gray-800">{{ user.name }}</p>
                </div>

                <div class="bg-gray-50 rounded-lg p-5">
                  <label class="block text-sm font-semibold text-gray-600 mb-2">Email</label>
                  <p class="text-lg font-semibold text-gray-800">{{ user.email }}</p>
                </div>

                <div class="bg-gray-50 rounded-lg p-5">
                  <label class="block text-sm font-semibold text-gray-600 mb-2">Vai trò</label>
                  <span :class="[
                    'inline-block px-4 py-1 rounded-full text-sm font-semibold',
                    user.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  ]">
                    {{ user.role === 'admin' ? '👑 Quản trị viên' : '👤 Khách hàng' }}
                  </span>
                </div>

                <div class="bg-gray-50 rounded-lg p-5">
                  <label class="block text-sm font-semibold text-gray-600 mb-2">Thành viên từ</label>
                  <p class="text-lg font-semibold text-gray-800">{{ new Date().getFullYear() }}</p>
                </div>
              </div>

              <div class="pt-4 border-t">
                <button class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold flex items-center gap-2">
                  <span>✏️</span>
                  <span>Chỉnh sửa thông tin</span>
                </button>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'orders'" class="bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              📦 Đơn hàng của tôi
            </h2>

            <div class="text-center py-12">
              <div class="text-6xl mb-4">📭</div>
              <p class="text-gray-500 text-lg mb-6">Bạn chưa có đơn hàng nào</p>
              <button class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold">
                Bắt đầu mua sắm
              </button>
            </div>
          </div>

          <div v-if="activeTab === 'security'" class="bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              🔒 Bảo mật tài khoản
            </h2>

            <div class="space-y-6">
              <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="font-bold text-lg text-gray-800 mb-1">Đổi mật khẩu</h3>
                    <p class="text-sm text-gray-600">Cập nhật mật khẩu định kỳ để bảo vệ tài khoản</p>
                  </div>
                  <span class="text-3xl">🔑</span>
                </div>
                <button class="px-6 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-red-600 hover:text-red-600 transition-all duration-300 font-semibold">
                  Thay đổi mật khẩu
                </button>
              </div>

              <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="font-bold text-lg text-gray-800 mb-1">Xác thực 2 bước</h3>
                    <p class="text-sm text-gray-600">Tăng cường bảo mật với xác thực 2 yếu tố</p>
                  </div>
                  <span class="text-3xl">📱</span>
                </div>
                <button class="px-6 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-red-600 hover:text-red-600 transition-all duration-300 font-semibold">
                  Kích hoạt
                </button>
              </div>

              <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="font-bold text-lg text-gray-800 mb-1">Lịch sử đăng nhập</h3>
                    <p class="text-sm text-gray-600">Xem các thiết bị đã đăng nhập vào tài khoản</p>
                  </div>
                  <span class="text-3xl">📊</span>
                </div>
                <button class="px-6 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-red-600 hover:text-red-600 transition-all duration-300 font-semibold">
                  Xem lịch sử
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>