<template>
  <div :class="['app-shell', { 'app-shell--sidebar-collapsed': isSidebarCollapsed }]">
    <aside class="app-sidebar">
      <Sidebar v-model="isSidebarCollapsed" />
    </aside>

    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Sidebar from "./components/Sidebar.vue";

const isSidebarCollapsed = ref(false);
</script>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--app-bg);
  overflow-x: hidden;
}

.app-sidebar {
  flex: 0 0 auto;
  width: 260px;
  transition: width 0.2s ease;
  position: relative;
  z-index: 5;
}

.app-shell--sidebar-collapsed .app-sidebar {
  width: 84px;
}

.app-main {
  flex: 1;
  padding: 32px 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow-x: hidden;
}

@media (max-width: 1024px) {
  .app-sidebar {
    width: 240px;
  }

  .app-shell--sidebar-collapsed .app-sidebar {
    width: 80px;
  }

  .app-main {
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .app-shell {
    flex-direction: column;
  }

  .app-sidebar {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 60;
  }

  .app-shell--sidebar-collapsed .app-sidebar {
    width: 100%;
  }

  .app-main {
    padding: 20px 16px;
    padding-top: 112px;
    max-width: 100%;
    overflow-x: hidden;
  }
}
</style>
