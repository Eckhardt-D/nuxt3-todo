<script lang="ts" setup>
import { useTodoStore } from "~/store/todo";
import cookie from "js-cookie";

const todoStore = useTodoStore();
const newTodo = ref("");
const error = ref(false);
const loading = ref(false);

await useAsyncData("todos", async () => {
  return todoStore.fetchTodos();
});

watch(error, (value: boolean) => {
  if (value) {
    setTimeout(() => {
      error.value = false;
    }, 500);
  }
});

const saveNewTodo = async () => {
  if (!newTodo.value) {
    error.value = true;
    return;
  }

  loading.value = true;
  await todoStore.add({
    label: newTodo.value,
  });

  newTodo.value = "";
  loading.value = false;
};

const logout = () => {
  cookie.remove("nuxt3-todo-token-v1");
  location.href = "/auth";
};
</script>

<template>
  <main class="bg-gray-100 pt-18 min-h-screen">
    <nav class="p-3">
      <a class="float-right mr-5 cursor-pointer" @click="logout">Logout</a>
    </nav>
    <section class="text-center py-10">
      <h1 class="text-5xl font-bold text-gray-700">What are we doing today?</h1>
    </section>
    <section class="md:w-8/12 md:mx-auto lg:w-6/12 py-4 rounded-lg">
      <todo-input
        v-model="newTodo"
        @save="saveNewTodo"
        :error="error"
        :loading="loading"
      />
      <todo-list :items="todoStore.getSortedTodos.reverse()" />
    </section>
  </main>
</template>
