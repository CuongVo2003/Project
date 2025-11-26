<script setup>
import { ref } from 'vue';

const props = defineProps({
  loading: Boolean,
  message: String
});

const emit = defineEmits(['submit', 'switch-mode']);

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');

function handleSubmit() {
  if (password.value !== passwordConfirmation.value) {
    alert('Mật khẩu không khớp!');
    return;
  }

  emit('submit', {
    name: name.value,
    email: email.value,
    password: password.value,
    password_confirmation: passwordConfirmation.value
  });

  name.value = '';
  email.value = '';
  password.value = '';
  passwordConfirmation.value = '';
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">👤 Họ tên</label>
      <input
        v-model="name"
        type="text"
        placeholder="Nhập họ tên của bạn"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition duration-200"
        required />
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">📧 Email</label>
      <input
        v-model="email"
        type="email"
        placeholder="user@example.com"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition duration-200"
        required />
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">🔐 Mật khẩu</label>
      <input
        v-model="password"
        type="password"
        placeholder="Tối thiểu 6 ký tự"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition duration-200"
        minlength="6"
        required />
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">🔐 Nhập lại mật khẩu</label>
      <input
        v-model="passwordConfirmation"
        type="password"
        placeholder="Nhập lại mật khẩu"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition duration-200"
        minlength="6"
        required />
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
      {{ loading ? '⏳ Đang xử lý...' : '✍️ Đăng ký' }}
    </button>

    <p class="text-sm text-center text-gray-600">
      Đã có tài khoản?
      <button type="button" class="text-blue-600 font-semibold hover:underline" @click="emit('switch-mode')">
        Đăng nhập
      </button>
    </p>
  </form>
</template>