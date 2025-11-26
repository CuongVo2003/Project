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

onMounted(() => fetchProducts(), fetchCategories());

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
  <div class="max-w-7xl mx-auto p-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Quản lý sản phẩm</h1>
      <div class="flex gap-2">
        <input v-model="q" @keyup.enter="fetchProducts" placeholder="Tìm theo tên" class="px-3 py-2 border rounded" />
        <button @click="fetchProducts" class="px-4 py-2 bg-gray-200 rounded">Tìm</button>
        <button @click="openCreate" class="px-4 py-2 bg-blue-600 text-white rounded">➕ Tạo</button>
      </div>
    </div>

    <div v-if="loading" class="text-gray-500">Đang tải...</div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="p in products" :key="p.id" class="bg-white shadow rounded p-4">
        <img v-if="p.image_url" :src="p.image_url" class="w-full h-36 object-cover rounded mb-3" />
        <div class="font-semibold">{{ p.name }}</div>
        <div class="text-sm text-gray-600">{{ p.category?.name || 'N/A' }}</div>
        <div class="mt-2 flex items-center justify-between">
          <div class="text-red-600 font-bold">{{ (p.price_after_discount || p.price).toLocaleString() }}đ</div>
          <div class="text-sm text-gray-500">Kho: {{ p.stock }}</div>
        </div>
        <div class="mt-3 flex gap-2">
          <button @click="openEdit(p)" class="px-3 py-1 bg-yellow-500 text-white rounded">Sửa</button>
          <button @click="removeProduct(p.id)" class="px-3 py-1 bg-red-500 text-white rounded">Xóa</button>
        </div>
      </div>
    </div>

    <!-- Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg w-full max-w-2xl p-6">
        <h2 class="text-xl font-bold mb-4">{{ editing ? 'Sửa sản phẩm' : 'Tạo sản phẩm' }}</h2>
        <form @submit.prevent="submit" class="space-y-3">
          <div>
            <label class="text-sm block mb-1">Danh mục</label>
            <select v-model="form.category_id" class="w-full px-3 py-2 border rounded" required>
              <option value="">-- chọn --</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div>
            <label class="text-sm block mb-1">Tên</label>
            <input v-model="form.name" class="w-full px-3 py-2 border rounded" required />
          </div>
          <div>
            <label class="text-sm block mb-1">Mô tả</label>
            <textarea v-model="form.description" class="w-full px-3 py-2 border rounded"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <input v-model="form.price" type="number" step="0.01" class="px-3 py-2 border rounded" placeholder="Giá" required />
            <input v-model="form.stock" type="number" class="px-3 py-2 border rounded" placeholder="Số lượng" required />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <input v-model="form.discount_percent" type="number" class="px-3 py-2 border rounded" placeholder="% giảm" />
            <input type="file" accept="image/*" @change="onImageChange" class="px-3 py-2" />
          </div>

          <div class="flex justify-end gap-2">
            <button type="button" @click="showForm = false" class="px-4 py-2 bg-gray-200 rounded">Hủy</button>
            <button type="submit" :disabled="loading" class="px-4 py-2 bg-blue-600 text-white rounded">{{ loading ? 'Đang...' : 'Lưu' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>