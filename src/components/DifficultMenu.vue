<template>
  <div class="row">
    <div class="col">
      <h4 class="text-center">New game:</h4>
      <ul>
        <DifficultButton
          v-for="(difficult,index) in difficultList"
          :key="index"
          :difficult="difficult"
           @click="selectDifficult" />
      </ul>
    </div>
  </div>
</template>

<script>
import store from '../store'
import DifficultButton from './DifficultButton.vue'
export default {
  props: ['selected'],
  components: {
    DifficultButton,
  },
  computed: {
    difficult: () => store.state.difficult,
    difficultList: () => store.state.difficultList,
  },
  methods: {
    selectDifficult(e) {
      store.state.difficult = e.target.textContent;
    }
  }
}
</script>
