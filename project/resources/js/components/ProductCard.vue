<script setup>
const props = defineProps({
  product: Object,
  user: Object
});

const emit = defineEmits(['view', 'add-to-cart']);

</script>

<template>
  <div class="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
       @click="emit('view', product.id)">
    <!-- Image -->
    <div v-if="product.image_url" class="w-full h-48 bg-gray-200 overflow-hidden">
      <img :src="product.image_url" alt="" class="w-full h-full object-cover" />
    </div>
    <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center">
      <span class="text-gray-400">Không có ảnh</span>
    </div>

    <!-- Discount Badge -->
    <div v-if="product.discount_percent > 0" class="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
      -{{ product.discount_percent }}%
    </div>

    <!-- Content -->
    <div class="p-4">
      <h3 class="font-semibold text-lg line-clamp-2 mb-2">{{ product.name }}</h3>

      <!-- Price -->
      <div class="mb-3">
        <div v-if="product.discount_percent > 0" class="flex gap-2 items-center">
          <span class="text-red-600 font-bold text-lg">{{ product.price_after_discount.toLocaleString() }}đ</span>
          <span class="text-gray-400 line-through text-sm">{{ product.price.toLocaleString() }}đ</span>
        </div>
        <div v-else class="text-red-600 font-bold text-lg">{{ product.price.toLocaleString() }}đ</div>
      </div>

      <!-- Stock -->
      <div :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'" class="text-sm mb-4 font-semibold">
        {{ product.stock > 0 ? `Còn: ${product.stock}` : 'Hết hàng' }}
      </div>

      <!-- Add to Cart Button -->
      <button
        @click.stop="emit('add-to-cart', product)"
        :disabled="product.stock === 0"
        class="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400">
        🛒 Thêm vào giỏ
      </button>
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