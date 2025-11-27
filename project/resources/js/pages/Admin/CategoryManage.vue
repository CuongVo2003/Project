<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

axios.defaults.baseURL = '/api';

const categories = ref([]);
const loading = ref(false);
const showForm = ref(false);
const editing = ref(null);
const form = ref({ name: '', description: '' });

onMounted(fetchCategories);

async function fetchCategories() {
  loading.value = true;
  try {
    const { data } = await axios.get('/categories');
    categories.value = data.data || data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

const hasCategories = computed(() => categories.value.length > 0);

function openCreate() {
  editing.value = null;
  form.value = { name: '', description: '' };
  showForm.value = true;
}

function openEdit(c) {
  editing.value = c;
  form.value = { name: c.name, description: c.description || '' };
  showForm.value = true;
}

async function submit() {
  try {
    if (editing.value) {
      await axios.put(`/categories/${editing.value.id}`, {
        name: form.value.name,
        description: form.value.description
      });
      alert('Cập nhật danh mục thành công');
    } else {
      await axios.post('/categories', {
        name: form.value.name,
        description: form.value.description
      });
      alert('Tạo danh mục thành công');
    }
    showForm.value = false;
    await fetchCategories();
  } catch (e) {
    alert('Lỗi: ' + (e.response?.data?.message || 'Thất bại'));
  }
}

async function removeCategory(id) {
  if (!confirm('Xóa danh mục này?')) return;
  try {
    await axios.delete(`/categories/${id}`);
    await fetchCategories();
    alert('Đã xóa danh mục');
  } catch (e) {
    alert('Xóa thất bại');
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Quản lý danh mục</h1>
            <p class="text-slate-600 text-sm mt-1">Sắp xếp các nhóm sản phẩm để người dùng dễ tìm kiếm hơn</p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              <span class="text-sm font-semibold text-slate-700">
                Tổng: <span class="text-purple-600">{{ categories.length }}</span> danh mục
              </span>
            </span>
          </div>

          <button
            type="button"
            @click="openCreate"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Tạo danh mục
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="flex flex-col items-center gap-4">
          <div class="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-slate-600">Đang tải dữ liệu...</p>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="!hasCategories"
        class="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center"
      >
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full mb-6">
          <svg class="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-slate-900 mb-2">Chưa có danh mục nào</h2>
        <p class="text-slate-600 mb-6 max-w-md mx-auto">
          Hãy tạo danh mục đầu tiên để bắt đầu quản lý sản phẩm một cách hiệu quả
        </p>
        <button
          type="button"
          @click="openCreate"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Tạo danh mục đầu tiên
        </button>
      </div>

      <!-- Grid List -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="c in categories"
          :key="c.id"
          class="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-bold text-slate-900 truncate mb-2">
                  {{ c.name }}
                </h3>
                <p v-if="c.description" class="text-sm text-slate-600 line-clamp-3">
                  {{ c.description }}
                </p>
                <p v-else class="text-sm text-slate-400 italic">
                  Chưa có mô tả
                </p>
              </div>
              <div class="ml-3 p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
              </div>
            </div>

            <div class="flex gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                @click="openEdit(c)"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Sửa
              </button>
              <button
                type="button"
                @click="removeCategory(c.id)"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Xóa
              </button>
            </div>
          </div>
          <div class="h-1 bg-gradient-to-r from-purple-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </div>
      </div>

      <!-- Modal -->
      <div
        v-if="showForm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
        @click.self="showForm = false"
      >
        <div class="w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 border-b border-slate-200">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-slate-900">
                  {{ editing ? 'Sửa danh mục' : 'Tạo danh mục mới' }}
                </h2>
                <p class="text-sm text-slate-600 mt-0.5">
                  Điền đầy đủ thông tin để giúp người dùng hiểu rõ nhóm sản phẩm
                </p>
              </div>
            </div>
            <button
              type="button"
              @click="showForm = false"
              class="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <form @submit.prevent="submit" class="p-6 space-y-5">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Tên danh mục <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Ví dụ: Thuốc giảm đau, Vitamin, Hỗ trợ tiêu hóa..."
                required
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Mô tả
              </label>
              <textarea
                v-model="form.description"
                rows="4"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="Mô tả ngắn gọn về loại sản phẩm trong danh mục này"
              />
            </div>

            <!-- Modal Footer -->
            <div class="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                @click="showForm = false"
                class="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                class="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                {{ editing ? 'Lưu thay đổi' : 'Tạo danh mục' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>