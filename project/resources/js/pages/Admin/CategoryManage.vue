<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
axios.defaults.baseURL = '/api';

const categories = ref([]);
const loading = ref(false);
const showForm = ref(false);
const editing = ref(null);
const form = ref({ name: '', description: '' });

onMounted(fetchCategories);

async function fetchCategories(){
  loading.value = true;
  try {
    const { data } = await axios.get('/categories');
    categories.value = data.data || data;
  } catch (e) { console.error(e); } finally { loading.value = false; }
}

function openCreate(){
  editing.value = null;
  form.value = { name: '', description: '' };
  showForm.value = true;
}

function openEdit(c){
  editing.value = c;
  form.value = { name: c.name, description: c.description || '' };
  showForm.value = true;
}

async function submit(){
  try {
    if (editing.value) {
      await axios.put(`/categories/${editing.value.id}`, { name: form.value.name, description: form.value.description });
      alert('Cập nhật thành công');
    } else {
      await axios.post('/categories', { name: form.value.name, description: form.value.description });
      alert('Tạo thành công');
    }
    showForm.value = false;
    await fetchCategories();
  } catch (e) {
    alert('Lỗi: ' + (e.response?.data?.message || 'Thất bại'));
  }
}

async function removeCategory(id){
  if (!confirm('Xóa danh mục?')) return;
  try {
    await axios.delete(`/categories/${id}`);
    await fetchCategories();
    alert('Đã xóa');
  } catch (e) { alert('Xóa thất bại'); }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Quản lý danh mục</h1>
      <button @click="openCreate" class="px-4 py-2 bg-blue-600 text-white rounded">➕ Tạo</button>
    </div>

    <div v-if="loading" class="text-gray-500">Đang tải...</div>

    <div class="bg-white rounded shadow divide-y">
      <div v-for="c in categories" :key="c.id" class="p-4 flex justify-between items-center">
        <div>
          <div class="font-semibold">{{ c.name }}</div>
          <div class="text-sm text-gray-500">{{ c.description }}</div>
        </div>
        <div class="flex gap-2">
          <button @click="openEdit(c)" class="px-3 py-1 bg-yellow-500 text-white rounded">Sửa</button>
          <button @click="removeCategory(c.id)" class="px-3 py-1 bg-red-500 text-white rounded">Xóa</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg w-full max-w-md p-6">
        <h2 class="text-xl font-bold mb-3">{{ editing ? 'Sửa danh mục' : 'Tạo danh mục' }}</h2>
        <form @submit.prevent="submit" class="space-y-3">
          <div>
            <label class="text-sm">Tên</label>
            <input v-model="form.name" class="w-full px-3 py-2 border rounded" required />
          </div>
          <div>
            <label class="text-sm">Mô tả</label>
            <textarea v-model="form.description" class="w-full px-3 py-2 border rounded"></textarea>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" @click="showForm = false" class="px-4 py-2 bg-gray-200 rounded">Hủy</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>