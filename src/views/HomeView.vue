<template>
  <div class="lg:w-4/5 lg:mx-auto">
    <div className="mt-4">
      <Header/>
    </div>
    <div className="mt-40">
      <TypingNew/>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Typing from '@/components/Typing.vue';
import TypingNew from '@/components/TypingNew.vue';

export default {
  name: 'HomeView',
  components: {Header,Typing,TypingNew}
}
</script>
