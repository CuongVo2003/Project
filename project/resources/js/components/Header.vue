<script setup>
import { ref } from 'vue';

const props = defineProps({
  user: Object,
  cartCount: Number
});

const emit = defineEmits(['navigate', 'logout']);

const searchQuery = ref('');
const showMobileMenu = ref(false);

function handleSearch() {
  emit('navigate', 'home', { search: searchQuery.value });
}

function goAdmin() {
  emit('navigate', 'admin/dashboard');
}
</script>

<template>
  <header class="bg-white shadow sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="text-2xl font-bold text-red-600 cursor-pointer" @click="emit('navigate', 'home')">
          💊 Long Châu
        </div>

        <!-- Search Bar -->
        <div class="flex-1 mx-8">
          <div class="flex">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm thuốc, vitamin..."
              class="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-600" />
            <button
              @click="handleSearch"
              class="px-6 py-2 bg-red-600 text-white rounded-r-lg hover:bg-red-700">
              🔍
            </button>
          </div>
        </div>

        <!-- Nav Icons -->
        <div class="flex items-center gap-4">
          <button
            @click="emit('navigate', 'cart')"
            class="relative p-2 hover:bg-gray-100 rounded">
            🛒
            <span v-if="cartCount > 0" class="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {{ cartCount }}
            </span>
          </button>

          <!-- Admin Button -->
          <button v-if="props.user?.role === 'admin'" @click="goAdmin" class="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
            ⚙️ Admin
          </button>

          <template v-if="props.user">
            <button @click="emit('navigate', 'profile')" class="p-2 hover:bg-gray-100 rounded">
              👤 {{ props.user.name }}
            </button>
            <button
              @click="emit('logout')"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Đăng xuất
            </button>
          </template>

          <template v-else>
            <button
              @click="emit('navigate', 'auth')"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Đăng nhập
            </button>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>