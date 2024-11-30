<template>
  <footer class="flex items-end justify-between w-100">
    <div class="footer-links flex items-center gap-4">
      <a href="#"><font-awesome-icon :icon="['fas', 'code']" /> github</a>
      <a href="#"><font-awesome-icon :icon="['fas', 'envelope']" /> contact</a>
    </div>
    <div class="flex flex-col gap-1 items-center w-full">
      <div class="shortcut flex items-center gap-2">
        <span class="btn">Ctrl</span>
        <span class="plus">+</span>
        <span class="btn">Q</span>
        <span class="dash">-</span>
        <span class="text">Restart Test</span>
      </div>

      <div class="shortcut flex items-center gap-2">
        <span class="btn">Ctrl</span>
        <span class="plus">+</span>
        <span class="btn">Shift</span>
        <span class="plus">+</span>
        <span class="btn">P</span>
        <span class="dash">-</span>
        <span class="text">Show Menu</span>
      </div>
    </div>
    <div class="theme-switcher gap-4 flex items-center">
      <font-awesome-icon :icon="['fas', 'palette']" />
      <select v-model="selectedTheme">
        <option disabled>Themes</option>
        <option>Tokyo Night</option>
        <option>Outrun</option>
        <option>Lavender Twilight</option>
        <option>Cyberpunk 2077</option>
      </select>
    </div>
  </footer>
</template>
<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useTypingStore } from "@/stores/store";
import { ref, toRefs, watch } from "vue";
components: {
  FontAwesomeIcon;
}
const typingStore = useTypingStore();
const { theme } = toRefs(typingStore);
const selectedTheme = ref(theme);

watch(selectedTheme, (themeName) => {
  switch (themeName) {
    case "Tokyo Night":
      theme.value = "Tokyo Night";
      typingStore.changeTheme();
      break;
    case "Outrun":
      theme.value = "Outrun";
      typingStore.changeTheme();
      break;
    case "Lavender Twilight":
      theme.value = "Lavender Twilight";
      typingStore.changeTheme();
      break;
    default:
      typingStore.changeTheme("Tokyo Night");
  }
});
</script>
