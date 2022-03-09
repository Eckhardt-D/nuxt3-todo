# Nuxt 3 Todo App

This is the source code for Kaizen Code's Nuxt3 TDD todo app video. Live version is [here](https://nuxt3-todo.vercel.app/);

```bash
git clone https://github.com/Eckhardt-D/nuxt3-todo.git
```

## Install

```bash
cd nuxt3-todo && yarn
```

## Develop

```bash
yarn dev
```

## Deploy

```bash
npm i -g vercel && vercel
```

Note for deploy you need to change the settings:

- build directory: `.output`
- build command: `nuxi build`
- dev command: `nuxi dev`
