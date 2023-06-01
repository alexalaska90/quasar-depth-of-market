<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Quasar App
        </q-toolbar-title>
        <q-space />
        <q-toggle
          v-model="darkMode"
          @click="$q.dark.toggle()"
          checked-icon="dark_mode"
          color="accent"
          unchecked-icon="light_mode"
          size="xl"
        />
      </q-toolbar>
    </q-header>
    <q-page-container :class="darkMode == false ? 'bg-info' : 'bg-dark-page'">
      <router-view :darkMode="darkMode" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  data () {
    return {
      darkMode: false
    }
  }
})
</script>
