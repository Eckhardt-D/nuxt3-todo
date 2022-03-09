<script lang="ts" setup>
const props = defineProps<{
  modelValue: string;
  error: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "save"): void;
}>();

const localTodoValue = computed({
  get() {
    return props.modelValue;
  },
  set(value: string) {
    emit("update:modelValue", value);
  },
});
</script>

<template>
  <div
    class="w-10/12 sm:w-8/12 max-w-lg mx-auto h-24 bg-white rounded-md shadow-sm p-5 px-10 flex items-center justify-between mb-5"
  >
    <input
      v-model="localTodoValue"
      type="text"
      placeholder="Create a todo"
      :class="{
        'border-red-300': error,
        'border-gray-300': !error,
      }"
      class="border rounded py-2 px-4 w-9/12 focus:outline-1 focus:outline-blue-100"
      @keypress.enter="$emit('save')"
    />
    <button
      class="w-3/12 py-2 ml-2 rounded border border-gray-300 hover:bg-green-100 transition-all duration-200"
      @click="$emit('save')"
    >
      Add
    </button>
  </div>
</template>
