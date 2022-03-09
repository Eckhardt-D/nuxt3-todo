<script lang="ts" setup>
import { XCircleIcon, CheckCircleIcon } from "@heroicons/vue/outline/index.js";
import { useTodoStore } from "~~/store/todo";
import { Todo } from "~~/store/todo";

const props = defineProps<{
  todo: Todo;
}>();

const todoStore = useTodoStore();
const deleteTodo = (id: number) => todoStore.remove(id);

const updateTodoDone = (todo: Todo) => {
  const currentState = todo.done;
  todoStore.update(todo.id, { done: !currentState });
};

const parsedDate = computed(() =>
  new Intl.DateTimeFormat("en-US").format(new Date(props.todo.createdAt))
);
</script>

<template>
  <list-item-container>
    <div class="max-w-10/12 overflow-hidden whitespace-nowrap text-ellipsis">
      <h1
        :class="{
          'line-through': todo.done,
        }"
        class="text-2xl text-gray-700 select-none font-light uppercase"
        :title="todo.label"
      >
        {{ todo.label }}
      </h1>
      <p>
        <small class="text-gray-400">
          {{ parsedDate }}
        </small>
      </p>
    </div>
    <section class="flex items-center">
      <check-circle-icon
        class="w-10 h-10 transition-all duration-200 hover:text-green-400 mr-3 cursor-pointer"
        :class="{
          'text-green-400': todo.done,
          'text-gray-400': !todo.done,
        }"
        @click="updateTodoDone(todo)"
      />
      <x-circle-icon
        class="w-10 h-10 transition-all duration-200 text-red-400 cursor-pointer hover:text-red-600"
        @click="deleteTodo(todo.id)"
      />
    </section>
  </list-item-container>
</template>
