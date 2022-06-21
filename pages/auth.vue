<script lang="ts" setup>
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");
const loading = ref(false);
const error = ref(null);

const loginMode = ref(true);

const authorize = async () => {
  loading.value = true;
  let err;

  if (loginMode.value) {
    const response = await $fetch("/api/user/login", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });
    err = response.error;
  } else {
    const response = await $fetch("/api/user/create", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
        passwordConfirm: passwordConfirm.value,
      },
    });
    err = response.error;
  }

  loading.value = false;

  if (err) {
    error.value = err;
    setTimeout(() => (error.value = null), 3000);
  } else {
    location.href = "/";
  }
};
</script>

<template>
  <main class="min-h-screen pt-18 bg-gray-100">
    <section class="text-center py-10">
      <h1 class="text-5xl font-bold text-gray-700 mb-4">
        {{ loginMode ? "Login to your account" : "Create an account" }}
      </h1>

      <form class="flex flex-col max-w-lg mx-auto" @submit.prevent>
        <input
          v-model="email"
          class="px-2 py-3 mt-3 border-1 border-lime-200"
          placeholder="Email Address"
          type="email"
          name="email"
          id="email"
        />
        <input
          v-model="password"
          class="px-2 py-3 mt-3 border-1 border-lime-200"
          placeholder="Password"
          type="password"
          name="password"
          id="password"
        />

        <input
          v-if="!loginMode"
          v-model="passwordConfirm"
          class="px-2 py-3 mt-3 border-1 border-lime-200"
          placeholder="Re-enter your password"
          type="password"
          name="password-confirm"
          id="password-confirm"
        />

        <button
          class="p-5 bg-blue-500 text-white rounded-sm mt-5 disabled:bg-gray-400 disabled:text-white"
          :disabled="loading"
          @click="authorize"
        >
          Authorize
        </button>

        <p v-if="error" class="text-red-400 mt-3">
          {{ error }}
        </p>
        <a
          @click="loginMode = !loginMode"
          class="mt-3 underline cursor-pointer"
        >
          Or
          {{ loginMode ? "Register" : "Login" }}
          instead
        </a>
      </form>
    </section>
  </main>
</template>
