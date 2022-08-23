<template>
  <div class="container-flow mt-3">
    <div class="row justify-content-center">
      <div class="col-5 border rounded">

        <div class="container-flow">

          <div class="row">
            <div class="col text-center">
              <h1>BattleShips</h1>
              <div v-if="this.difficultList.includes(this.difficult)" class="mb-2">
                <span>Difficult: {{ difficult }}</span><br />
                <button class="btn btn-secondary btn-sm my-1" @click="cancelGame">Cancel game</button><br />
                <button v-if="!this.duringGame()" :disabled="!this.allShips" class="btn btn-secondary btn-sm" @click="startGame">Start Game</button>
              </div>
            </div>
          </div>

          <DifficultMenu
            v-if="!this.difficultSelected() && !this.duringGame()" />

          <div class="row" id="gameConfigArea" v-if="this.difficultSelected() && !this.duringGame()">
            <div class="col-6">
              <GameBoard />
            </div>
            <div class="col-6">
              <ShipList/>
            </div>
          </div>

          <div class="row" id="game" v-if="this.difficultSelected() && this.duringGame()">
            <div class="col-6">
              <GameBoard player="player" />
            </div>
            <div class="col-6">
              <GameBoard player="cpu" />
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script>

//import $ from "jquery";
import store from './store'
import DifficultMenu from './components/DifficultMenu.vue'
import GameBoard from './components/GameBoard.vue'
import ShipList from './components/ShipList.vue'
import bs from './battleships'
export default {
  inject: ['name'],
  computed: {
    difficult: () => store.state.difficult,
    difficultList: () => store.state.difficultList,
    allShips: () => { return store.state.ships == 20; },
  },
  methods: {
    duringGame() { return store.state.savedPos !== null && typeof store.state.savedPos.player == 'object' && typeof store.state.savedPos.cpu == 'object'; },
    difficultSelected() { return this.difficultList.includes(this.difficult) },
    cancelGame() {
      store.state.difficult = null;
      store.state.savedPos = null;
      store.state.ships = 0;
    },
    startGame() {
      store.state.savedPos = {};
      store.state.savedPos.player = bs.getPos();
      bs.randomPos();
      store.state.savedPos.cpu = bs.getPos();
      bs.loadPos(store.state.savedPos.player);
    }
  },
  components: {
    DifficultMenu,
    GameBoard,
    ShipList,
  }
}
</script>

<style>
  ul {
    padding: 0;
    list-style: none;
    margin: 0px;
    padding: 0px;
  }
  li {
    color: #5555ff;
    cursor: pointer;
    padding: 0.2em;
    border-radius: 0.2em;
    list-style-position: inside;
    text-transform: capitalize;
  }
  li:hover {
    text-decoration: underline;
    background-color: #e6e6e6;
  }
</style>
