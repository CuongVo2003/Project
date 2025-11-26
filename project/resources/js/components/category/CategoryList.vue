<script setup>
const props = defineProps({
  categories: Array,
  selected: [Number, String, null],
  user: Object
});

const emit = defineEmits(['select','edit','delete','create']);
</script>

<template>
  <div class="bg-white rounded-lg shadow p-4">
    <div class="flex items-center justify-between mb-3">
      <h4 class="font-semibold">Loại thuốc</h4>
      <button v-if="props.user?.role === 'admin'" @click="$emit('create')" class="text-sm px-2 py-1 bg-purple-600 text-white rounded">Thêm</button>
    </div>

    <button
      @click="$emit('select', null)"
      :class="props.selected === null ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'"
      class="w-full text-left px-3 py-2 rounded mb-2">
      Tất cả
    </button>

    <div class="space-y-2 max-h-72 overflow-auto">
      <div v-for="c in props.categories" :key="c.id" class="flex items-center gap-2">
        <button
          @click="$emit('select', c.id)"
          :class="props.selected === c.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'"
          class="flex-1 px-3 py-2 rounded text-left">
          {{ c.name }}
        </button>

        <div v-if="props.user?.role === 'admin'" class="flex gap-1">
          <button @click="$emit('edit', c)" class="px-2 py-2 bg-yellow-400 text-white rounded text-xs">✏️</button>
          <button @click="$emit('delete', c.id)" class="px-2 py-2 bg-red-500 text-white rounded text-xs">🗑️</button>
        </div>
      </div>
    </div>

    <div v-if="props.categories.length === 0" class="text-sm text-gray-400 mt-4">Chưa có loại thuốc</div>
  </div>
</template>