<template>
  <div class="min-h-screen bg-[#0b0b0f] text-white">

    <!-- ==================== MOBILE OVERLAY ==================== -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/60 z-40 lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- ==================== SIDEBAR ==================== -->
    <AdminSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- ==================== MAIN CONTENT ==================== -->
    <div class="lg:ml-64">

      <!-- ==================== TOP NAVBAR ==================== -->
      <header
        class="h-20 sticky top-0 z-30 bg-[#0b0b0f]/90 backdrop-blur-xl
               border-b border-gray-800"
      >
        <div class="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          <button
            @click="sidebarOpen = true"
            class="lg:hidden w-10 h-10 rounded-lg bg-[#15151c]
                   border border-gray-800 text-gray-300 flex items-center justify-center"
          >
            <Icon name="mdi:menu" class="text-lg" />
          </button>

          <div class="hidden sm:flex items-center relative w-64 lg:w-80">
            <span class="absolute left-4 text-gray-500">
              <Icon name="mdi:magnify" />
            </span>
            <input
              type="text"
              placeholder="Search settings..."
              class="w-full bg-[#15151c] border border-gray-800
                     rounded-xl py-2.5 pl-11 pr-4
                     text-sm text-white placeholder-gray-500
                     focus:outline-none focus:border-red-500"
            />
          </div>

          <div class="flex items-center gap-3 ml-auto">
            <button
              @click="saveSettings"
              :disabled="saving"
              class="flex items-center gap-2 bg-red-600 hover:bg-red-500
                     px-4 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50"
            >
              <Icon name="mdi:content-save" />
              <span class="hidden sm:inline">{{ saving ? 'Saving...' : 'Save Changes' }}</span>
            </button>
          </div>
        </div>
      </header>

      <!-- ==================== PAGE CONTENT ==================== -->
      <main class="p-4 sm:p-6 lg:p-8">

        <!-- Page Title -->
        <div class="mb-8">
          <h2 class="text-2xl sm:text-3xl font-bold">Settings</h2>
          <p class="text-gray-500 mt-1">Manage your application preferences and configuration</p>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="flex items-center justify-center py-20">
          <div class="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
          <Icon name="mdi:alert-circle" class="text-4xl text-red-400 mb-3" />
          <p class="text-red-400">Failed to load settings</p>
        </div>

        <!-- Settings Content -->
        <template v-else>

          <!-- General Settings -->
          <section class="bg-[#15151c] border border-gray-800 rounded-2xl p-6 mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-10 h-10 rounded-xl bg-blue-500/10
                       flex items-center justify-center text-blue-400"
              >
                <Icon name="mdi:cog" />
              </div>
              <div>
                <h3 class="text-lg font-semibold">General Settings</h3>
                <p class="text-sm text-gray-500">Basic application configuration</p>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm text-gray-400 mb-2">Application Name</label>
                <input
                  v-model="settings.general.appName"
                  type="text"
                  class="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl
                         px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
                  placeholder="MovieFlix"
                />
              </div>

              <div>
                <label class="block text-sm text-gray-400 mb-2">Application Description</label>
                <textarea
                  v-model="settings.general.appDescription"
                  rows="3"
                  class="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl
                         px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 resize-none"
                  placeholder="Your movie streaming platform"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-400 mb-2">Language</label>
                  <select
                    v-model="settings.general.language"
                    class="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl
                           px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
                  >
                    <option value="en">English</option>
                    <option value="km">Khmer</option>
                    <option value="zh">Chinese</option>
                    <option value="ko">Korean</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm text-gray-400 mb-2">Timezone</label>
                  <select
                    v-model="settings.general.timezone"
                    class="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl
                           px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="Asia/Phnom_Penh">Asia/Phnom_Penh (ICT)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Asia/Shanghai">Asia/Shanghai (CST)</option>
                    <option value="Asia/Seoul">Asia/Seoul (KST)</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <!-- Security Settings -->
          <section class="bg-[#15151c] border border-gray-800 rounded-2xl p-6 mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-10 h-10 rounded-xl bg-green-500/10
                       flex items-center justify-center text-green-400"
              >
                <Icon name="mdi:shield-lock" />
              </div>
              <div>
                <h3 class="text-lg font-semibold">Security Settings</h3>
                <p class="text-sm text-gray-500">Authentication and access control</p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-[#0b0b0f] rounded-xl border border-gray-800">
                <div class="flex items-center gap-3">
                  <Icon name="mdi:two-factor-authentication" class="text-xl text-gray-400" />
                  <div>
                    <p class="text-sm font-medium">Two-Factor Authentication</p>
                    <p class="text-xs text-gray-500">Require 2FA for admin accounts</p>
                  </div>
                </div>
                <button
                  @click="settings.security.twoFactorAuth = !settings.security.twoFactorAuth"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    settings.security.twoFactorAuth ? 'bg-red-600' : 'bg-gray-700'
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                    ]"
                  ></span>
                </button>
              </div>

              <div class="flex items-center justify-between p-4 bg-[#0b0b0f] rounded-xl border border-gray-800">
                <div class="flex items-center gap-3">
                  <Icon name="mdi:email-lock" class="text-xl text-gray-400" />
                  <div>
                    <p class="text-sm font-medium">Email Verification</p>
                    <p class="text-xs text-gray-500">Require email verification for new users</p>
                  </div>
                </div>
                <button
                  @click="settings.security.emailVerification = !settings.security.emailVerification"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    settings.security.emailVerification ? 'bg-red-600' : 'bg-gray-700'
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      settings.security.emailVerification ? 'translate-x-6' : 'translate-x-1'
                    ]"
                  ></span>
                </button>
              </div>

              <div>
                <label class="block text-sm text-gray-400 mb-2">Session Timeout (minutes)</label>
                <input
                  v-model.number="settings.security.sessionTimeout"
                  type="number"
                  min="5"
                  max="1440"
                  class="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl
                         px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </section>

          <!-- Notification Settings -->
          <section class="bg-[#15151c] border border-gray-800 rounded-2xl p-6 mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-10 h-10 rounded-xl bg-yellow-500/10
                       flex items-center justify-center text-yellow-400"
              >
                <Icon name="mdi:bell" />
              </div>
              <div>
                <h3 class="text-lg font-semibold">Notification Settings</h3>
                <p class="text-sm text-gray-500">Configure system notifications</p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-[#0b0b0f] rounded-xl border border-gray-800">
                <div class="flex items-center gap-3">
                  <Icon name="mdi:email-outline" class="text-xl text-gray-400" />
                  <div>
                    <p class="text-sm font-medium">Email Notifications</p>
                    <p class="text-xs text-gray-500">Send email notifications for important events</p>
                  </div>
                </div>
                <button
                  @click="settings.notifications.email = !settings.notifications.email"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    settings.notifications.email ? 'bg-red-600' : 'bg-gray-700'
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                    ]"
                  ></span>
                </button>
              </div>

              <div class="flex items-center justify-between p-4 bg-[#0b0b0f] rounded-xl border border-gray-800">
                <div class="flex items-center gap-3">
                  <Icon name="mdi:message-outline" class="text-xl text-gray-400" />
                  <div>
                    <p class="text-sm font-medium">Push Notifications</p>
                    <p class="text-xs text-gray-500">Send push notifications to users</p>
                  </div>
                </div>
                <button
                  @click="settings.notifications.push = !settings.notifications.push"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    settings.notifications.push ? 'bg-red-600' : 'bg-gray-700'
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      settings.notifications.push ? 'translate-x-6' : 'translate-x-1'
                    ]"
                  ></span>
                </button>
              </div>

              <div class="flex items-center justify-between p-4 bg-[#0b0b0f] rounded-xl border border-gray-800">
                <div class="flex items-center gap-3">
                  <Icon name="mdi:newspaper-variant-outline" class="text-xl text-gray-400" />
                  <div>
                    <p class="text-sm font-medium">Newsletter</p>
                    <p class="text-xs text-gray-500">Send weekly newsletter to subscribers</p>
                  </div>
                </div>
                <button
                  @click="settings.notifications.newsletter = !settings.notifications.newsletter"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    settings.notifications.newsletter ? 'bg-red-600' : 'bg-gray-700'
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      settings.notifications.newsletter ? 'translate-x-6' : 'translate-x-1'
                    ]"
                  ></span>
                </button>
              </div>
            </div>
          </section>

          <!-- API Settings -->
          <section class="bg-[#15151c] border border-gray-800 rounded-2xl p-6 mb-6">
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-10 h-10 rounded-xl bg-purple-500/10
                       flex items-center justify-center text-purple-400"
              >
                <Icon name="mdi:api" />
              </div>
              <div>
                <h3 class="text-lg font-semibold">API Configuration</h3>
                <p class="text-sm text-gray-500">External API keys and endpoints</p>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm text-gray-400 mb-2">TMDB API Key</label>
                <input
                  v-model="settings.api.tmdbKey"
                  type="text"
                  class="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl
                         px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 font-mono"
                  placeholder="Enter your TMDB API key"
                />
              </div>

              <div>
                <label class="block text-sm text-gray-400 mb-2">API Base URL</label>
                <input
                  v-model="settings.api.baseUrl"
                  type="text"
                  class="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl
                         px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 font-mono"
                  placeholder="http://localhost:8000"
                />
              </div>

              <div>
                <label class="block text-sm text-gray-400 mb-2">Cache Duration (seconds)</label>
                <input
                  v-model.number="settings.api.cacheDuration"
                  type="number"
                  min="0"
                  class="w-full bg-[#0b0b0f] border border-gray-800 rounded-xl
                         px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </section>

          <!-- Danger Zone -->
          <section class="bg-[#15151c] border border-red-500/30 rounded-2xl p-6">
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-10 h-10 rounded-xl bg-red-500/10
                       flex items-center justify-center text-red-400"
              >
                <Icon name="mdi:alert" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-red-400">Danger Zone</h3>
                <p class="text-sm text-gray-500">Irreversible and destructive actions</p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-[#0b0b0f] rounded-xl border border-gray-800">
                <div>
                  <p class="text-sm font-medium">Clear All Cache</p>
                  <p class="text-xs text-gray-500">Remove all cached data and images</p>
                </div>
                <button
                  @click="clearCache"
                  class="px-4 py-2 rounded-xl text-sm font-medium
                         bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                >
                  Clear Cache
                </button>
              </div>

              <div class="flex items-center justify-between p-4 bg-[#0b0b0f] rounded-xl border border-gray-800">
                <div>
                  <p class="text-sm font-medium">Reset to Defaults</p>
                  <p class="text-xs text-gray-500">Reset all settings to default values</p>
                </div>
                <button
                  @click="resetSettings"
                  class="px-4 py-2 rounded-xl text-sm font-medium
                         bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                >
                  Reset Settings
                </button>
              </div>
            </div>
          </section>

        </template>
      </main>
    </div>

    <!-- ==================== SAVE SUCCESS TOAST ==================== -->
    <div
      v-if="showToast"
      class="fixed bottom-6 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-xl
             shadow-lg shadow-green-500/20 flex items-center gap-2 animate-pulse"
    >
      <Icon name="mdi:check-circle" />
      <span class="text-sm font-medium">Settings saved successfully!</span>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

definePageMeta({ layout: 'admin', middleware: ['auth'], role: 'admin' })

const sidebarOpen = ref(false)
const saving = ref(false)
const showToast = ref(false)
const pending = ref(false)
const error = ref(null)

const defaultSettings = {
  general: {
    appName: 'MovieFlix',
    appDescription: 'Your ultimate movie streaming platform',
    language: 'en',
    timezone: 'Asia/Phnom_Penh'
  },
  security: {
    twoFactorAuth: false,
    emailVerification: true,
    sessionTimeout: 60
  },
  notifications: {
    email: true,
    push: false,
    newsletter: true
  },
  api: {
    tmdbKey: '',
    baseUrl: 'http://localhost:8000',
    cacheDuration: 3600
  }
}

const settings = reactive(JSON.parse(JSON.stringify(defaultSettings)))

const saveSettings = async () => {
  saving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    console.log('Settings saved:', JSON.parse(JSON.stringify(settings)))
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  } catch (e) {
    alert('Failed to save settings: ' + e.message)
  } finally {
    saving.value = false
  }
}

const clearCache = async () => {
  if (!confirm('Are you sure you want to clear all cached data?')) return
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    alert('Cache cleared successfully!')
  } catch (e) {
    alert('Failed to clear cache: ' + e.message)
  }
}

const resetSettings = async () => {
  if (!confirm('Are you sure you want to reset all settings to default values?')) return
  try {
    Object.assign(settings, JSON.parse(JSON.stringify(defaultSettings)))
    alert('Settings reset to defaults!')
  } catch (e) {
    alert('Failed to reset settings: ' + e.message)
  }
}

onMounted(() => {
  pending.value = true
  setTimeout(() => {
    pending.value = false
  }, 500)
})
</script>
