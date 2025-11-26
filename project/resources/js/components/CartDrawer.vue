<script setup>
import { computed } from 'vue';

const props = defineProps({
  items: Array,
  isOpen: Boolean
});

const emit = defineEmits(['close', 'checkout', 'update-quantity', 'remove-item']);

const total = computed(() => {
  return props.items.reduce((sum, item) => sum + (item.product.price_after_discount || item.product.price) * item.quantity, 0);
});
</script>

<template>
  <div v-if="props.isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="emit('close')">
    <div class="fixed right-0 top-0 h-screen w-96 bg-white shadow-lg overflow-y-auto" @click.stop>
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">🛒 Giỏ hàng</h2>
          <button @click="emit('close')" class="text-2xl">✕</button>
        </div>

        <div v-if="items.length === 0" class="text-center py-12 text-gray-400">
          Giỏ hàng trống
        </div>

        <div v-else class="space-y-4 mb-6">
          <div
            v-for="item in items"
            :key="item.product.id"
            class="flex gap-4 border-b pb-4">
            <img v-if="item.product.image_url" :src="item.product.image_url" alt="" class="w-16 h-16 object-cover rounded" />
            <div class="flex-1">
              <h4 class="font-semibold line-clamp-1">{{ item.product.name }}</h4>
              <p class="text-red-600 font-bold">{{ (item.product.price_after_discount || item.product.price).toLocaleString() }}đ</p>
              <div class="flex items-center gap-2 mt-2">
                <button @click="emit('update-quantity', item.product.id, item.quantity - 1)" class="px-2 py-1 bg-gray-200 rounded">-</button>
                <span class="px-3">{{ item.quantity }}</span>
                <button @click="emit('update-quantity', item.product.id, item.quantity + 1)" class="px-2 py-1 bg-gray-200 rounded">+</button>
                <button @click="emit('remove-item', item.product.id)" class="ml-auto text-red-600">🗑️</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Total -->
        <div v-if="items.length > 0" class="border-t pt-4">
          <div class="flex justify-between items-center mb-4 text-lg font-bold">
            <span>Tổng:</span>
            <span class="text-red-600">{{ total.toLocaleString() }}đ</span>
          </div>
          <button
            @click="emit('checkout')"
            class="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold">
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>