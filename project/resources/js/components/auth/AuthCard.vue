<script setup>
import { ref } from 'vue';
import LoginForm from './login/loginForm.vue';
import RegisterForm from './register/registerForm.vue';

const props = defineProps({
  loading: Boolean,
  message: String
});

const emit = defineEmits(['login', 'register']);

const mode = ref('login'); // 'login' | 'register'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
    <!-- Background Decoration -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div class="absolute -bottom-8 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Card -->
    <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-white/20">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="text-5xl mb-3 inline-block">💊</div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Quản lý Thuốc
        </h1>
        <p class="text-gray-500 mt-2">
          {{ mode === 'login' ? 'Đăng nhập để tiếp tục' : 'Tạo tài khoản mới' }}
        </p>
      </div>

      <!-- Error Message -->
      <div v-if="message" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
        ⚠️ {{ message }}
      </div>

      <!-- Forms -->
      <LoginForm
        v-if="mode === 'login'"
        :loading="loading"
        :message="message"
        @submit="(data) => emit('login', data)"
        @switch-mode="mode = 'register'" />

      <RegisterForm
        v-else
        :loading="loading"
        :message="message"
        @submit="(data) => emit('register', data)"
        @switch-mode="mode = 'login'" />
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>