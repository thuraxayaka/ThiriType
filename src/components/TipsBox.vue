<template>
  <div :class="['tips-box']">
    <div :class="['inner-box']">
      <p class="bubble-text">{{ tips }}</p>

      <button
        :class="['cursor-pointer', 'outline-none', 'confirm-button']"
        @click="handleClick"
      >
        Got it
      </button>
    </div>
  </div>
</template>
<script setup>
import { defineProps, ref, defineEmits } from "vue";

const props = defineProps({
  message: String,
});
const tips = ref(props.message);

const emit = defineEmits(["confirm"]);

const handleClick = () => {
  emit("confirm");
};
</script>
