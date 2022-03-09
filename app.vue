<script lang="ts" setup>
import { useTodoStore } from "~/store/todo";

const todoStore = useTodoStore();
const newTodo = ref("");
const error = ref(false);

todoStore.$subscribe((_, state) => {
  if (typeof window.localStorage !== "undefined") {
    localStorage.todo_state = JSON.stringify(state);
  }
});

onMounted(() => {
  if (typeof window.localStorage !== "undefined") {
    todoStore.$state = JSON.parse(localStorage.getItem("todo_state"));
  }
});

watch(error, (value: boolean) => {
  if (value) {
    setTimeout(() => {
      error.value = false;
    }, 500);
  }
});

const saveNewTodo = () => {
  if (!newTodo.value) {
    error.value = true;
    return;
  }

  todoStore.add({
    label: newTodo.value,
  });

  newTodo.value = "";
};
</script>

<template>
  <main class="bg-gray-100 pt-18 min-h-screen">
    <section class="text-center py-10">
      <h1 class="text-5xl font-bold text-gray-700">What are we doing today?</h1>
    </section>
    <section class="md:w-8/12 md:mx-auto lg:w-6/12 py-4 rounded-lg">
      <todo-input v-model="newTodo" @save="saveNewTodo" :error="error" />
      <todo-list :items="todoStore.getSortedTodos.reverse()" />
    </section>
  </main>
</template>
