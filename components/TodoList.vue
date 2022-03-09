<script lang="ts" setup>
import { Todos } from "~~/store/todo";

defineProps<{
  items: Todos;
}>();
</script>

<template>
  <section v-if="items.length > 0">
    <todo-item v-for="item in items" :key="item.id" :todo="item" />
  </section>
</template>
