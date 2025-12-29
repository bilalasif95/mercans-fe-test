<template>
  <div class="pdf-viewer">
    <div class="pdf-content" ref="container">
      <div class="pdf-floating-controls">
        <button @click="zoomOut" :disabled="scale <= 0.6" title="Zoom Out" class="zoom-circle-btn">
          <img src="../assets/icons/minus.svg" alt="Zoom Out" />
        </button>
        <button @click="zoomIn" :disabled="scale >= 2.4" title="Zoom In" class="zoom-circle-btn">
          <img src="../assets/icons/plus.svg" alt="Zoom In" />
        </button>
      </div>

      <div v-if="loading" class="pdf-loading">
        <div class="loader"></div>
      </div>
      <VuePdfEmbed
        :source="src"
        :scale="scale"
        :width="800"
        @rendered="onRendered"
        class="pdf-canvas-wrapper"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VuePdfEmbed from 'vue-pdf-embed';

const props = defineProps({
  src: {
    type: String,
    required: true
  }
});

const scale = ref(1.0);
const loading = ref(true);

const zoomIn = () => {
  scale.value = Number((scale.value + 0.2).toFixed(1));
};

const zoomOut = () => {
  scale.value = Number((scale.value - 0.2).toFixed(1));
};

const onRendered = () => {
  loading.value = false;
};
</script>

<style scoped>
.pdf-viewer {
  display: flex;
  flex-direction: column;
  background: var(--white);
  height: 100%;
  position: relative;
}

.pdf-content {
  flex: 1;
  overflow: auto;
  position: relative;
  display: flex;
  background: var(--app-bg);
  padding: 32px;
}

.pdf-floating-controls {
  position: absolute;
  top: 16px;
  right: 24px;
  display: flex;
  gap: 8px;
  z-index: 20;
}

.zoom-circle-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--border-light);
  background: var(--zoom-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  outline: none;
}

.zoom-circle-btn:hover:not(:disabled) {
  background: var(--zoom-hover);
  border-color: var(--text-muted);
}

.zoom-circle-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.zoom-circle-btn img {
  width: 14px;
  height: 14px;
}

.pdf-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 5;
}

.pdf-canvas-wrapper {
  margin: auto;
  background: var(--white);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Custom scrollbar */
.pdf-content::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.pdf-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
</style>
