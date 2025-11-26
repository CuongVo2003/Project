<script setup>
import { ref } from 'vue';

const props = defineProps({
  loading: Boolean,
  message: String
});

const emit = defineEmits(['submit', 'switch-mode']);

const email = ref('');
const password = ref('');

function handleSubmit() {
  emit('submit', {
    email: email.value,
    password: password.value
  });
  email.value = '';
  password.value = '';
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">📧 Email</label>
      <input
        v-model="email"
        type="email"
        placeholder="admin@admin.com"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
        required />
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">🔐 Mật khẩu</label>
      <input
        v-model="password"
        type="password"
        placeholder="••••••••"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
        required />
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
      {{ loading ? '⏳ Đang xử lý...' : '🔓 Đăng nhập' }}
    </button>

    <p class="text-sm text-center text-gray-600">
      Chưa có tài khoản?
      <button type="button" class="text-blue-600 font-semibold hover:underline" @click="emit('switch-mode')">
        Đăng ký ngay
      </button>
    </p>
  </form>
</template>