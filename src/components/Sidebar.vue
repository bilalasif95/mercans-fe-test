<template>
  <div>
    <div v-if="isMobile && !isCollapsed" class="sidebar-backdrop" @click="toggleCollapse"></div>

    <nav :class="['sidebar', { 'sidebar--collapsed': isCollapsed, 'sidebar--mobile-open': isMobile && !isCollapsed }]">
      <div class="sidebar-header">
        <div class="sidebar-header-left">
          <div class="sidebar-logo-circle">HRB</div>
          <div class="sidebar-header-text">
            <span class="sidebar-header-title">Employee</span>
            <span class="sidebar-header-subtitle">Self Service</span>
          </div>
        </div>

        <button class="sidebar-collapse-btn" type="button" @click="toggleCollapse">
          <img v-if="!isMobile && isCollapsed" src="../assets/icons/chevron-right.svg" />
          <img v-if="!isMobile && !isCollapsed" src="../assets/icons/chevron-left.svg" />
        </button>
      </div>

      <div class="sidebar-body">
        <section class="company-card">
          <div class="company-logo-wrapper">
            <img src="../assets/logo.svg" />
          </div>

          <div class="company-text">
            <div class="company-name">Boring Company</div>
            <div class="company-subtitle">Mercans USA Ltd.</div>
          </div>

          <div class="company-actions">
            <button type="button" class="company-icon">
              <img src="../assets/icons/launchpad.svg" />
            </button>
            <button type="button" class="company-icon">
              <img src="../assets/icons/news.svg" />
              <span class="badge-dot"></span>
            </button>
            <button type="button" class="company-icon">
              <img src="../assets/icons/notification.svg" />
              <span class="badge-dot"></span>
            </button>
          </div>
        </section>

        <div class="company-divider"></div>

        <ul class="sidebar-menu">
          <li v-for="item in sortedLinks" :key="item.path" class="sidebar-menu-item">
            <RouterLink :to="`/${item.path}`" class="sidebar-link" :class="{ 'sidebar-link--active': isActive(item) }"
              @click="onNavClick">
              <span class="sidebar-icon-wrap">
                <img v-if="getIconSrc(item.icon)" :src="getIconSrc(item.icon)" :alt="item.title" />
                <span v-else class="sidebar-icon-fallback"></span>
              </span>
              <span class="sidebar-link-text">{{ formatTitle(item.title) }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>

      <footer class="sidebar-footer">
        Mercans © 2025
      </footer>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { useMenu } from "../composables/useMenu";
import type { MenuLink } from "../types";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const route = useRoute();
const internalCollapsed = ref(props.modelValue);
const isMobile = ref(false);

const { menuLinks, fetchMenu } = useMenu();

const isCollapsed = computed({
  get: () => internalCollapsed.value,
  set: (val) => {
    internalCollapsed.value = val;
    emit("update:modelValue", val);
  },
});

const handleResize = () => {
  const mobile = window.innerWidth <= 768;
  isMobile.value = mobile;
  if (mobile) {
    internalCollapsed.value = true;
    emit("update:modelValue", true);
  }
};

onMounted(async () => {
  handleResize();
  window.addEventListener("resize", handleResize);
  await fetchMenu();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const onNavClick = () => {
  if (isMobile.value && !isCollapsed.value) {
    isCollapsed.value = true;
  }
};

const sortedLinks = computed(() =>
  [...menuLinks.value]
    .filter((l) => l.enabled)
    .sort((a, b) => a.ordinal - b.ordinal)
);

const isActive = (item: MenuLink) => route.path === `/${item.path}`;

const formatTitle = (key: string) =>
  key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const getIconSrc = (iconKey: string): string | undefined => {
  if (!iconKey) return undefined;
  try {
    return new URL(`../assets/icons/${iconKey}.svg`, import.meta.url).href;
  } catch {
    return undefined;
  }
};
</script>

<style scoped>
.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: var(--overlay-backdrop);
  z-index: 59;
}

.sidebar {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 260px;
  background: var(--white);
  border-right: 1px solid var(--border-light);
  transition: max-width 0.2s ease;
}

.sidebar--collapsed {
  max-width: 84px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0 18px 16px;
  background: var(--header-bg-dark);
  color: var(--white);
}

.sidebar-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sidebar-logo-circle {
  width: 54px;
  height: 54px;
  border-radius: var(--radius-full);
  background: var(--brand-orange);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  font-weight: 700;
}

.sidebar-header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-header-title {
  font-size: 14px;
  font-weight: 600;
}

.sidebar-header-subtitle {
  font-size: 13px;
}

.sidebar-collapse-btn {
  position: relative;
  width: 36px;
  height: 60px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-btn-transparent);
  background: transparent;
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.sidebar-collapse-btn img {
  width: 18px;
  height: 18px;
}

.sidebar-body {
  flex: 1;
  background: var(--white);
  display: flex;
  flex-direction: column;
}

.company-card {
  padding: 24px 16px 18px;
  text-align: center;
}

.company-logo-wrapper {
  display: flex;
  justify-content: center;
}

.company-text {
  margin-bottom: 20px;
}

.company-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.company-subtitle {
  font-size: 15px;
  color: var(--header-bg-dark);
}

.company-actions {
  display: flex;
  justify-content: center;
  gap: 28px;
}

.company-icon {
  position: relative;
  width: 32px;
  height: 32px;
  border: unset;
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.badge-dot {
  position: absolute;
  right: 4px;
  top: 3px;
  width: 8px;
  height: 8px;
  border-radius: 3px;
  background: var(--badge-warning);
  border: 2px solid var(--white);
}

.company-divider {
  margin: 18px 0 10px;
  border-top: 1px solid var(--border-divider);
}

.sidebar-menu {
  list-style: none;
  padding: 0 16px 0;
  margin: 0;
  flex: 1;
}

.sidebar-menu-item {
  margin-bottom: 10px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  color: var(--link-sidebar);
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: background 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease,
    transform 0.1s ease;
  border: 1px solid transparent;
}

.sidebar-link:hover {
  background: var(--link-hover-bg);
}

.sidebar-link--active {
  background: var(--link-active-bg);
  border-color: var(--header-bg-dark);
  box-shadow: var(--shadow-active);
}

.sidebar-icon-wrap {
  width: 22px;
  display: flex;
  justify-content: center;
}

.sidebar-icon-wrap img {
  width: 22px;
  height: 22px;
}

.sidebar-icon-fallback {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: currentColor;
}

.sidebar-link-text {
  white-space: nowrap;
}

.sidebar-footer {
  padding: 14px 12px 18px;
  text-align: center;
  font-size: 13px;
  color: var(--text-footer);
  background: var(--footer-bg);
}

.sidebar--collapsed .sidebar-header-text {
  display: none;
}

.sidebar--collapsed .sidebar-header {
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 16px 0 12px;
}

.sidebar--collapsed .sidebar-collapse-btn {
  position: static;
  margin-top: 10px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  margin-right: 0;
}

.sidebar--collapsed .company-card,
.sidebar--collapsed .company-divider {
  display: none;
}

.sidebar--collapsed .sidebar-menu {
  padding-inline: 8px;
}

.sidebar--collapsed .sidebar-link {
  justify-content: center;
  padding-inline: 10px;
}

.sidebar--collapsed .sidebar-link-text {
  display: none;
}

.sidebar--collapsed .sidebar-footer {
  font-size: 11px;
  padding-inline: 4px;
}

@media (max-width: 1024px) {
  .sidebar {
    max-width: 240px;
  }

  .sidebar--collapsed {
    max-width: 80px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    max-width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-light);
  }

  .sidebar--mobile-open {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    overflow: auto;
    z-index: 60;
  }

  .sidebar-header {
    padding-right: 16px;
  }

  .sidebar-collapse-btn {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: 1px solid var(--border-btn-mobile);
    margin-right: 0;
  }

  .sidebar-collapse-btn img {
    display: none;
  }

  .sidebar-collapse-btn::before,
  .sidebar-collapse-btn::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 18px;
    height: 2px;
    border-radius: 2px;
    background: var(--white);
    transform: translate(-50%, -50%);
    transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
  }

  .sidebar-collapse-btn::after {
    opacity: 0;
  }

  .sidebar.sidebar--collapsed .sidebar-collapse-btn::before {
    box-shadow: 0 -5px 0 var(--white), 0 5px 0 var(--white);
  }

  .sidebar.sidebar--collapsed .sidebar-collapse-btn::after {
    opacity: 0;
  }

  .sidebar:not(.sidebar--collapsed) .sidebar-collapse-btn::before {
    transform: translate(-50%, -50%) rotate(45deg);
    box-shadow: none;
  }

  .sidebar:not(.sidebar--collapsed) .sidebar-collapse-btn::after {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  .sidebar--collapsed {
    max-width: 100%;
  }

  .sidebar--collapsed .sidebar-body,
  .sidebar--collapsed .sidebar-footer {
    display: none;
  }

  .sidebar--collapsed .sidebar-header-text {
    display: flex;
  }

  .sidebar--collapsed .sidebar-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 16px 16px 18px;
  }

  .sidebar--collapsed .sidebar-collapse-btn {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    margin-top: 0;
    position: relative;
  }
}
</style>
