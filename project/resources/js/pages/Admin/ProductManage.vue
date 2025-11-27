<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

axios.defaults.baseURL = '/api';

const products = ref([]);
const categories = ref([]);
const loading = ref(false);
const page = ref(1);
const total = ref(0);
const q = ref('');

const showForm = ref(false);
const editing = ref(null);
const form = ref({
  category_id: '',
  name: '',
  description: '',
  price: '',
  stock: '',
  discount_percent: '',
  imageFile: null
});

onMounted(() => {
  fetchCategories();
  fetchProducts();
});

async function fetchCategories(){
  try {
    const { data } = await axios.get('/categories');
    categories.value = data.data || data;
  } catch (e) { console.error(e); }
}

async function fetchProducts(){
  loading.value = true;
  try {
    const params = { page: page.value };
    if (q.value) params.search = q.value;
    const { data } = await axios.get('/products', { params });
    products.value = data.data || data;
    total.value = data.total || products.value.length;
  } catch (e) { console.error(e); } finally { loading.value = false; }
}

function openCreate(){
  editing.value = null;
  form.value = { category_id:'', name:'', description:'', price:'', stock:'', discount_percent:0, imageFile: null };
  showForm.value = true;
}

function openEdit(p){
  editing.value = p;
  form.value = {
    category_id: p.category_id,
    name: p.name,
    description: p.description || '',
    price: p.price,
    stock: p.stock,
    discount_percent: p.discount_percent || 0,
    imageFile: null
  };
  showForm.value = true;
}

function onImageChange(e){
  const f = e.target.files[0];
  form.value.imageFile = f || null;
}

async function submit(){
  loading.value = true;
  try {
    const fd = new FormData();
    fd.append('category_id', form.value.category_id);
    fd.append('name', form.value.name);
    fd.append('description', form.value.description || '');
    fd.append('price', form.value.price);
    fd.append('stock', form.value.stock);
    fd.append('discount_percent', form.value.discount_percent || 0);
    if (form.value.imageFile) fd.append('image', form.value.imageFile);

    if (editing.value) {
      fd.append('_method', 'PUT');
      await axios.post(`/products/${editing.value.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('Cập nhật sản phẩm thành công');
    } else {
      await axios.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('Tạo sản phẩm thành công');
    }
    showForm.value = false;
    await fetchProducts();
  } catch (e) {
    console.error(e);
    alert('Lỗi: ' + (e.response?.data?.message || JSON.stringify(e.response?.data?.errors) || 'Thất bại'));
  } finally { loading.value = false; }
}

async function removeProduct(id){
  if (!confirm('Xóa sản phẩm?')) return;
  try {
    await axios.delete(`/products/${id}`);
    await fetchProducts();
    alert('Đã xóa');
  } catch (e) { alert('Xóa thất bại'); }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Quản lý sản phẩm</h1>
            <p class="text-slate-600 text-sm mt-1">Quản lý toàn bộ danh mục sản phẩm của bạn</p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
          <div class="flex gap-2 w-full sm:w-auto">
            <div class="relative flex-1 sm:w-80">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                v-model="q"
                @keyup.enter="fetchProducts"
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                class="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              @click="fetchProducts"
              class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
            >
              Tìm
            </button>
          </div>

          <button
            type="button"
            @click="openCreate"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Tạo sản phẩm
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="flex flex-col items-center gap-4">
          <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-slate-600">Đang tải sản phẩm...</p>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="p in products"
          :key="p.id"
          class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100"
        >
          <div class="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
            <img
              v-if="p.image_url"
              :src="p.image_url"
              :alt="p.name"
              class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            
            <div v-if="p.discount_percent > 0" class="absolute top-3 right-3">
              <span class="inline-flex items-center px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                -{{ p.discount_percent }}%
              </span>
            </div>

            <div class="absolute bottom-3 left-3">
              <span :class="[
                'inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full shadow-lg',
                p.stock > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              ]">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                {{ p.stock > 0 ? 'Còn hàng' : 'Hết hàng' }}
              </span>
            </div>
          </div>

          <div class="p-5">
            <div class="mb-3">
              <span class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                {{ p.category?.name || 'N/A' }}
              </span>
            </div>

            <h3 class="text-lg font-bold text-slate-900 mb-2 line-clamp-2 min-h-[3.5rem]">
              {{ p.name }}
            </h3>

            <div class="flex items-baseline gap-2 mb-4">
              <span class="text-2xl font-bold text-red-600">
                {{ (p.price_after_discount || p.price).toLocaleString() }}đ
              </span>
              <span v-if="p.discount_percent > 0" class="text-sm text-slate-400 line-through">
                {{ p.price.toLocaleString() }}đ
              </span>
            </div>

            <div class="flex items-center justify-between text-sm text-slate-600 mb-4 pb-4 border-b border-slate-100">
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                <span>Kho: <span class="font-semibold">{{ p.stock }}</span></span>
              </div>
            </div>

            <div class="flex gap-2">
              <button
                @click="openEdit(p)"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Sửa
              </button>
              <button
                @click="removeProduct(p.id)"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Xóa
              </button>
            </div>
          </div>

          <div class="h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </div>
      </div>

      <div
        v-if="showForm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
        @click.self="showForm = false"
      >
        <div class="w-full max-w-3xl bg-white rounded-2xl shadow-2xl transform transition-all max-h-[90vh] overflow-hidden flex flex-col">
          <div class="flex items-center justify-between p-6 border-b border-slate-200">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-slate-900">
                  {{ editing ? 'Sửa sản phẩm' : 'Tạo sản phẩm mới' }}
                </h2>
                <p class="text-sm text-slate-600 mt-0.5">
                  Điền đầy đủ thông tin sản phẩm
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

          <form @submit.prevent="submit" class="p-6 overflow-y-auto flex-1">
            <div class="space-y-5">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">
                    Danh mục <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.category_id"
                    class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">-- Chọn danh mục --</option>
                    <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">
                    Tên sản phẩm <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Tên sản phẩm"
                    required
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Mô tả chi tiết về sản phẩm"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">
                    Giá (đ) <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.price"
                    type="number"
                    step="0.01"
                    class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">
                    Số lượng <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.stock"
                    type="number"
                    class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">
                    Giảm giá (%)
                  </label>
                  <input
                    v-model="form.discount_percent"
                    type="number"
                    min="0"
                    max="100"
                    class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">
                    Hình ảnh
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    @change="onImageChange"
                    class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-200">
              <button
                type="button"
                @click="showForm = false"
                class="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading ? 'Đang xử lý...' : (editing ? 'Lưu thay đổi' : 'Tạo sản phẩm') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>