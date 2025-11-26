<script setup>
import { computed } from 'vue';

const props = defineProps({
  product: Object,
  user: Object // nullable
});

const emit = defineEmits(['edit','delete','view','buy']);

const canEdit = computed(() => props.user?.role === 'admin');
const canBuy = computed(() => !!props.user);

</script>

<template>
  <article class="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
    <div v-if="product.image_url || product.image" class="mb-3">
      <img :src="product.image_url || ('/storage/' + product.image)" alt="" class="w-full h-40 object-cover rounded" />
    </div>
    <div class="flex-1">
      <h3 class="font-semibold text-lg mb-1">{{ product.name }}</h3>
      <p class="text-sm text-gray-600 mb-2 line-clamp-2">{{ product.description || '(Không có mô tả)' }}</p>
      <div class="flex justify-between items-center text-sm text-gray-700 mt-4">
        <div class="font-bold text-blue-600">{{ Number(product.price).toLocaleString('vi-VN') }}đ</div>
        <div :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'" class="font-semibold">
          Kho: {{ product.stock }}
        </div>
      </div>
    </div>

    <div class="mt-4 flex gap-2">
      <button
        v-if="!canEdit"
        class="flex-1 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
        @click="$emit('view', product)"
        :disabled="!user">
        👁️ Xem
      </button>

      <button
        v-if="canEdit"
        class="px-3 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
        @click="$emit('edit', product)">
        ✏️ Sửa
      </button>

      <button
        v-if="canEdit"
        class="px-3 py-2 rounded bg-red-500 hover:bg-red-600 text-white font-semibold"
        @click="$emit('delete', product.id)">
        🗑️ Xóa
      </button>

      <button
        v-if="!canEdit"
        class="flex-1 px-3 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
        @click="$emit('buy', product)"
        :disabled="!canBuy">
        🛒 Mua
      </button>
    </div>
  </article>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>