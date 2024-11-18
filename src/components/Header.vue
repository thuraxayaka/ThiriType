<template>
  <header class="flex items-center justify-between">
    <div id="logo">Here's logo</div>
    <ul class="menu-links flex flex-column">
      <li class="nav-item active"><a href="#" class="nav-link"> Home </a></li>
      <li class="nav-item"><a href="#" class="nav-link"> About </a></li>
      <li class="nav-item"><a href="#" class="nav-link"> Settings </a></li>
      <li class="nav-item"><a href="#" class="nav-link"> Support Us </a></li>
      <li class="nav-item"><a href="#" class="nav-link"> Contact </a></li>
    </ul>
  </header>
</template>

<style lang="scss" scoped>
@import "../theme";
header {
  // background: $Orchid;
  color: $Orchid;
  padding: 0 0 0 10px;
  border-radius: 12px;
  #logo {
  }
  .menu-links {
    .nav-item {
      height: 100%;
      padding: 12px 10px;
      transition: transform 0.4s;
      font-family: $Font;
      &.active {
        border-bottom: 1px solid $Rose;
      }
      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scaleX(1.05);
        .nav-link {
          transition: font-weight 0.4s;
          &:hover {
            font-weight: bold;
            color: $Rose;
          }
        }
      }
    }
  }
}
</style>
