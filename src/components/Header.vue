<template>
  <header class="flex items-center justify-between">
    <img id="logo" src="@/assets/logo.svg" />

    <ul class="menu-links flex flex-column">
      <li class="nav-item active">
        <a href="/" class="nav-link"
          ><font-awesome-icon :icon="['fas', 'house']" />
        </a>
      </li>
      <li class="nav-item">
        <a href="/about" class="nav-link">
          <font-awesome-icon :icon="['fas', 'user-tie']" />
        </a>
      </li>
      <li class="nav-item">
        <a href="/settings" class="nav-link"
          ><font-awesome-icon :icon="['fas', 'gear']" />
        </a>
      </li>
    </ul>
  </header>
</template>
<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
components: {
  FontAwesomeIcon;
}
</script>
