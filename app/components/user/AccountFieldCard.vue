<script setup lang="ts">
interface Props {
  icon: string
  label: string
  value: string
  editing?: boolean
  inputValue?: string
  type?: 'text' | 'email'
  multiline?: boolean
  placeholder?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  editing: false,
  inputValue: '',
  type: 'text',
  multiline: false,
  placeholder: '',
  class: '',
})

const emit = defineEmits<{
  edit: []
  save: []
  cancel: []
  input: [value: string]
}>()

const iconPaths: Record<string, string> = {
  profile: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  mail: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  'message-square': 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z',
  lock: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  film: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
  database: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4',
}
</script>

<template>
  <div
    :class="[
      'group relative rounded-xl bg-[#0b0b0f] border border-white/10 p-5 transition hover:border-red-500/30 hover:bg-white/[0.02]',
      props.class,
    ]"
  >
    <div class="flex items-start gap-4">
      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600/10 border border-red-500/20">
        <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[props.icon] ?? iconPaths.profile" />
        </svg>
      </div>
      <div class="flex-1 min-w-0 pt-0.5">
        <p class="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-2">{{ props.label }}</p>

        <!-- View Mode -->
        <div v-if="!props.editing" class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold text-white truncate min-w-0" v-if="!props.multiline">{{ props.value }}</p>
            <p v-else class="text-sm text-gray-300 whitespace-pre-wrap break-words">{{ props.value }}</p>
          </div>
          <div class="flex justify-end">
            <button
              @click="$emit('edit')"
              class="shrink-0 whitespace-nowrap text-[11px] px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-300 transition hover:bg-white/10 hover:border-white/20"
            >
              <svg class="inline h-3 w-3 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit
            </button>
          </div>
        </div>

        <!-- Edit Mode -->
        <div v-else class="flex flex-col gap-3">
          <input
            v-if="!props.multiline"
            :type="props.type"
            :value="props.inputValue"
            @input="$emit('input', ($event.target as HTMLInputElement).value)"
            class="w-full bg-[#12121a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition"
            :placeholder="props.placeholder"
          />
          <textarea
            v-else
            :value="props.inputValue"
            @input="$emit('input', ($event.target as HTMLTextAreaElement).value)"
            rows="3"
            class="w-full bg-[#12121a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none transition"
            :placeholder="props.placeholder"
          />
          <div class="flex justify-end gap-2 pt-1">
            <button
              @click="$emit('cancel')"
              class="shrink-0 whitespace-nowrap text-[11px] px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-300 transition hover:bg-white/10 hover:border-white/20"
            >
              Cancel
            </button>
            <button
              @click="$emit('save')"
              class="shrink-0 whitespace-nowrap text-[11px] px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white transition hover:from-red-700 hover:to-red-800"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>