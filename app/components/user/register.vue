<script setup lang="ts">
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const agreeTerms = ref(false)
const errorMessage = ref('')
const { register } = useAuth()

const emit = defineEmits<{
  close: []
  switchToLogin: []
}>()

const handleRegister = async () => {
  errorMessage.value = ''

  if (
    !username.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    errorMessage.value = 'Please fill in all fields.'
    return
  }

  if (!agreeTerms.value) {
    errorMessage.value =
      'Please agree to the Terms of Service and Privacy Policy.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  try {
    await register(
      username.value,
      email.value,
      password.value
    )

    // Registration successful
    emit('switchToLogin')

  } catch (e: any) {
    errorMessage.value =
      e.message || 'Registration failed. Please try again.'
  }
}
</script>

<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/80 backdrop-blur-sm"
      @click="emit('close')"
    ></div>

    <!-- Modal -->
    <div class="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#12121a] shadow-2xl">
      <!-- Header gradient -->
      <div class="relative h-36 overflow-hidden bg-gradient-to-br from-red-600 to-red-900">
        <div class="absolute inset-0 opacity-30">
          <div class="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-red-500 blur-3xl"></div>
          <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-orange-500 blur-3xl"></div>
        </div>
        <button
          class="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white transition hover:bg-black/50"
          @click="emit('close')"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div class="relative flex h-full flex-col items-center justify-center">
          <div class="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-white">Create Account</h2>
          <p class="mt-1 text-sm text-red-200">Join CineBook today</p>
        </div>
      </div>

      <!-- Form -->
      <div class="p-7">
        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Error Message -->
          <div
            v-if="errorMessage"
            class="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {{ errorMessage }}
          </div>

          <!-- Username -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-300">Username</label>
            <div class="relative">
              <svg class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                v-model="username"
                type="text"
                placeholder="Choose a username"
                class="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-300">Email</label>
            <div class="relative">
              <svg class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                v-model="email"
                type="email"
                placeholder="Enter your email"
                class="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-300">Password</label>
            <div class="relative">
              <svg class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Create a password"
                class="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-12 text-sm text-white outline-none placeholder:text-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
              />
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-300">Confirm Password</label>
            <div class="relative">
              <svg class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                v-model="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Confirm your password"
                class="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
              />
            </div>
          </div>

          <!-- Terms -->
          <label class="flex cursor-pointer items-start gap-2">
            <input
              v-model="agreeTerms"
              type="checkbox"
              class="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 accent-red-600"
            />
            <span class="text-sm text-gray-400">I agree to the Terms of Service and Privacy Policy</span>
          </label>

          <!-- Submit -->
          <button
            type="submit"
            class="w-full rounded-xl bg-red-600 py-3.5 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-[0.98]"
          >
            Create Account
          </button>
        </form>

        <!-- Divider -->
        <div class="my-5 flex items-center gap-4">
          <div class="h-px flex-1 bg-white/10"></div>
          <span class="text-xs text-gray-500">or sign up with</span>
          <div class="h-px flex-1 bg-white/10"></div>
        </div>

        <!-- Social Login -->
        <div class="grid grid-cols-2 gap-3">
          <button class="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-gray-300 transition hover:border-white/20 hover:bg-white/10">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button class="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-gray-300 transition hover:border-white/20 hover:bg-white/10">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        <!-- Switch to Login -->
        <p class="mt-5 text-center text-sm text-gray-400">
          Already have an account?
          <button
            class="font-semibold text-red-500 hover:text-red-400"
            @click="emit('switchToLogin')"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
