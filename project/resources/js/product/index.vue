<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import CategoryList from '../components/category/CategoryList.vue';
import ProductCard from '../components/product/ProductCard.vue';

const props = defineProps({
  user: Object // nullable
});

const emit = defineEmits(['logout']);

axios.defaults.baseURL = '/api';

const products = ref([]);
const categories = ref([]);
const selectedCategory = ref(null);
const loading = ref(false);

// modals / forms
const showProductForm = ref(false);
const editingProduct = ref(null);
const productForm = ref({ name:'', category_id:'', description:'', price:'', stock:'' });

const showCategoryForm = ref(false);
const editingCategory = ref(null);
const categoryForm = ref({ name:'', description:'' });

const imagePreview = ref(null);
const imageFile = ref(null);

onMounted(() => {
  fetchAll();
});

async function fetchAll() {
  await Promise.all([fetchCategories(), fetchProducts()]);
}

async function fetchCategories() {
  try {
    const { data } = await axios.get('/categories');
    categories.value = data.data || data;
  } catch (e) { console.error('Error fetching categories:', e); }
}

async function fetchProducts() {
  try {
    const { data } = await axios.get('/products');
    products.value = data.data || data;
  } catch (e) { console.error('Error fetching products:', e); }
}

const filteredProducts = computed(() => {
  if (!selectedCategory.value) return products.value;
  return products.value.filter(p => p.category_id === selectedCategory.value);
});

// product actions
function onEditProduct(p) {
  editingProduct.value = p;
  productForm.value = {
    name: p.name,
    category_id: p.category_id,
    description: p.description || '',
    price: p.price,
    stock: p.stock
  };
  imagePreview.value = p.image_url || (p.image ? `/storage/${p.image}` : null);
  imageFile.value = null;
  showProductForm.value = true;
}

function onCreateProduct() {
  editingProduct.value = null;
  productForm.value = { name:'', category_id:'', description:'', price:'', stock:'' };
  imagePreview.value = null;
  imageFile.value = null;
  showProductForm.value = true;
}

function onImageChange(e) {
  const f = e.target.files[0];
  if (!f) { imageFile.value = null; imagePreview.value = null; return; }
  if (!f.type.startsWith('image/')) { alert('Chọn file ảnh'); return; }
  imageFile.value = f;
  const reader = new FileReader();
  reader.onload = (ev) => { imagePreview.value = ev.target.result; };
  reader.readAsDataURL(f);
}

async function submitProduct() {
  if (!productForm.value.category_id) { 
    alert('Vui lòng chọn loại thuốc'); 
    return; 
  }
  if (!productForm.value.name.trim()) { 
    alert('Vui lòng nhập tên thuốc'); 
    return; 
  }
  if (!productForm.value.price) { 
    alert('Vui lòng nhập giá'); 
    return; 
  }
  if (!productForm.value.stock) { 
    alert('Vui lòng nhập số lượng'); 
    return; 
  }

  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('category_id', productForm.value.category_id);
    formData.append('name', productForm.value.name);
    formData.append('description', productForm.value.description || '');
    formData.append('price', productForm.value.price);
    formData.append('stock', productForm.value.stock);
    if (imageFile.value) formData.append('image', imageFile.value);

    if (editingProduct.value) {
      // Laravel accepts POST + _method=PUT for multipart
      formData.append('_method', 'PUT');
      await axios.post(`/products/${editingProduct.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      await axios.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }

    await fetchProducts();
    showProductForm.value = false;
  } catch (e) {
    alert('Lỗi: ' + (e.response?.data?.message || JSON.stringify(e.response?.data?.errors) || 'Thất bại'));
  } finally {
    loading.value = false;
  }
}

async function removeProduct(id) {
  if (!confirm('Bạn có chắc muốn xóa thuốc này?')) return;
  loading.value = true;
  try {
    await axios.delete(`/products/${id}`);
    alert('Xóa thuốc thành công');
    await fetchProducts();
  } catch (e) { 
    alert('Lỗi: ' + (e.response?.data?.message || 'Xóa thất bại')); 
  } finally { 
    loading.value = false; 
  }
}

// category actions
function onEditCategory(c) { 
  editingCategory.value = c; 
  categoryForm.value = { name: c.name, description: c.description || '' }; 
  showCategoryForm.value = true; 
}

function onCreateCategory() { 
  editingCategory.value = null; 
  categoryForm.value = { name:'', description:'' }; 
  showCategoryForm.value = true; 
}

async function submitCategory() {
  if (!categoryForm.value.name.trim()) { 
    alert('Vui lòng nhập tên loại thuốc'); 
    return; 
  }
  
  loading.value = true;
  try {
    if (editingCategory.value) {
      await axios.put(`/categories/${editingCategory.value.id}`, categoryForm.value);
      alert('Cập nhật loại thuốc thành công');
    } else {
      await axios.post('/categories', categoryForm.value);
      alert('Thêm loại thuốc thành công');
    }
    await fetchCategories();
    showCategoryForm.value = false;
  } catch (e) { 
    alert('Lỗi: ' + (e.response?.data?.message || 'Thao tác thất bại')); 
  } finally { 
    loading.value = false; 
  }
}

async function removeCategory(id) {
  if (!confirm('Bạn có chắc muốn xóa loại thuốc này?')) return;
  loading.value = true;
  try {
    await axios.delete(`/categories/${id}`);
    alert('Xóa loại thuốc thành công');
    await fetchCategories();
    if (selectedCategory.value === id) selectedCategory.value = null;
  } catch (e) { 
    alert('Lỗi: ' + (e.response?.data?.message || 'Xóa thất bại')); 
  } finally { 
    loading.value = false; 
  }
}

// view / buy handlers
function onViewProduct(p) {
  if (!props.user) { alert('Vui lòng đăng nhập để xem chi tiết'); return; }
  alert(`Chi tiết: ${p.name}`);
}

function onBuyProduct(p) {
  if (!props.user) { alert('Vui lòng đăng nhập để mua'); return; }
  alert(`Mua: ${p.name}`);
}

function handleLogout() {
  emit('logout');
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- HEADER -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold">💊 Quản lý Thuốc</h1>
        <div v-if="props.user" class="flex items-center gap-4">
          <div>
            <p class="font-semibold">{{ props.user.name }}</p>
            <p class="text-sm text-gray-500">{{ props.user.role === 'admin' ? '👤 Admin' : '👤 User' }}</p>
          </div>
          <button @click="handleLogout" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Đăng xuất
          </button>
        </div>
      </div>
    </header>

    <!-- ACTION BUTTONS -->
    <div v-if="props.user?.role === 'admin'" class="max-w-7xl mx-auto px-4 py-4 flex gap-3">
      <button
        @click="onCreateProduct"
        class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">
        ➕ Thêm Thuốc
      </button>
      <button
        @click="onCreateCategory"
        class="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold">
        ➕ Thêm Loại Thuốc
      </button>
    </div>

    <!-- MAIN CONTENT -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside class="lg:col-span-1">
          <CategoryList
            :categories="categories"
            :selected="selectedCategory"
            :user="props.user"
            @select="selectedCategory = $event"
            @edit="onEditCategory"
            @delete="removeCategory"
            @create="onCreateCategory" />
        </aside>

        <main class="lg:col-span-3">
          <div class="mb-6">
            <h2 class="text-2xl font-bold mb-2">Danh sách thuốc</h2>
            <p class="text-gray-600">Hiển thị: {{ filteredProducts.length }} sản phẩm</p>
          </div>

          <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <ProductCard
              v-for="p in filteredProducts"
              :key="p.id"
              :product="p"
              :user="props.user"
              @edit="onEditProduct"
              @delete="removeProduct"
              @view="onViewProduct"
              @buy="onBuyProduct" />
          </div>

          <div v-else class="text-center py-12">
            <p class="text-gray-400 text-lg">📭 Chưa có sản phẩm nào</p>
          </div>
        </main>
      </div>
    </div>

    <!-- Product Modal -->
    <div v-if="showProductForm && props.user?.role === 'admin'" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl">
        <h3 class="text-2xl font-bold mb-6">{{ editingProduct ? '✏️ Sửa Thuốc' : '➕ Thêm Thuốc' }}</h3>
        
        <form @submit.prevent="submitProduct" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-2">Loại Thuốc *</label>
            <select 
              v-model="productForm.category_id" 
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              required>
              <option value="">-- Chọn loại thuốc --</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2">Tên Thuốc *</label>
            <input 
              v-model="productForm.name" 
              type="text"
              placeholder="Ví dụ: Paracetamol"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              required />
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2">Mô Tả</label>
            <textarea 
              v-model="productForm.description" 
              placeholder="Nhập mô tả thuốc..."
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              rows="3"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-2">Giá (VNĐ) *</label>
              <input 
                v-model="productForm.price" 
                type="number"
                placeholder="0"
                min="0"
                step="0.01"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required />
            </div>

            <div>
              <label class="block text-sm font-semibold mb-2">Số Lượng *</label>
              <input 
                v-model="productForm.stock" 
                type="number"
                placeholder="0"
                min="0"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2">Ảnh sản phẩm</label>
            <input type="file" accept="image/*" @change="onImageChange" class="w-full" />
            <div v-if="imagePreview" class="mt-3">
              <img :src="imagePreview" alt="preview" class="max-h-48 rounded shadow" />
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button 
              type="button" 
              @click="showProductForm = false" 
              class="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold">
              Hủy
            </button>
            <button 
              type="submit" 
              :disabled="loading" 
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400">
              {{ loading ? '⏳ Đang xử lý...' : editingProduct ? '💾 Cập Nhật' : '➕ Thêm' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Category Modal -->
    <div v-if="showCategoryForm && props.user?.role === 'admin'" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
        <h3 class="text-2xl font-bold mb-6">{{ editingCategory ? '✏️ Sửa Loại' : '➕ Thêm Loại' }}</h3>
        
        <form @submit.prevent="submitCategory" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-2">Tên Loại Thuốc *</label>
            <input 
              v-model="categoryForm.name" 
              type="text"
              placeholder="Ví dụ: Thuốc hạ sốt"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required />
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2">Mô Tả</label>
            <textarea 
              v-model="categoryForm.description" 
              placeholder="Nhập mô tả loại thuốc..."
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              rows="3"></textarea>
          </div>

          <div class="flex gap-3 pt-4">
            <button 
              type="button" 
              @click="showCategoryForm = false" 
              class="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold">
              Hủy
            </button>
            <button 
              type="submit" 
              :disabled="loading" 
              class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold disabled:bg-gray-400">
              {{ loading ? '⏳ Đang xử lý...' : editingCategory ? '💾 Cập Nhật' : '➕ Thêm' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>