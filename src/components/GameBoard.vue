<template>
      <center v-if="this.player"><h2>{{ this.player }}</h2></center>
      <div class="sea mb-3" :class="this.player">
        <div class="field-row" v-for="y in 10" :key="y">
          <div class="square field empty-field" v-for="x in 10" :key="x" :x="x" :y="y" :class="'field-' + x + '-' + y">&nbsp;</div>
        </div>
      </div>
</template>


<script>
export default {
  props: ['player'],
  created() {

    console.log(this.player);
  }
}
</script>

<style>
.sea {
  border-radius: 0.3em;
  padding: 0.5em;
}
.field {
  border: 1px #eef solid;
  border-radius: 0.2em;
  background-color: #ddf;
  cursor: pointer;
  display: inline-block;
  width: 10%;
  height: 10%;
}
.field:hover {
  background-color: #ccf;
}
</style>
