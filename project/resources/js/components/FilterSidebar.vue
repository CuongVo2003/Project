<script setup>
const props = defineProps({
  categories: Array,
  filters: Object
});

const emit = defineEmits(['change-filter']);

const priceRanges = [
  { label: 'Dưới 50k', min: 0, max: 50000 },
  { label: '50k - 100k', min: 50000, max: 100000 },
  { label: '100k - 300k', min: 100000, max: 300000 },
  { label: 'Trên 300k', min: 300000, max: 999999999 }
];

function handlePriceFilter(range) {
  emit('change-filter', { min_price: range.min, max_price: range.max });
}

function handleCategoryFilter(categoryId) {
  emit('change-filter', { category_id: categoryId });
}
</script>

<template>
  <aside class="bg-white rounded-lg shadow p-6">
    <!-- Categories -->
    <div class="mb-8">
      <h3 class="font-bold text-lg mb-4">📂 Danh Mục</h3>
      <button
        @click="handleCategoryFilter(null)"
        :class="!props.filters.category_id ? 'bg-red-600 text-white' : 'bg-gray-100'"
        class="w-full text-left px-3 py-2 rounded mb-2">
        Tất cả
      </button>
      <button
        v-for="cat in props.categories"
        :key="cat.id"
        @click="handleCategoryFilter(cat.id)"
        :class="props.filters.category_id === cat.id ? 'bg-red-600 text-white' : 'bg-gray-100'"
        class="w-full text-left px-3 py-2 rounded mb-2">
        {{ cat.name }}
      </button>
    </div>

    <!-- Price Ranges -->
    <div class="mb-8">
      <h3 class="font-bold text-lg mb-4">💰 Khoảng Giá</h3>
      <button
        v-for="range in priceRanges"
        :key="range.label"
        @click="handlePriceFilter(range)"
        class="w-full text-left px-3 py-2 rounded mb-2 bg-gray-100 hover:bg-red-200">
        {{ range.label }}
      </button>
    </div>
  </aside>
</template>