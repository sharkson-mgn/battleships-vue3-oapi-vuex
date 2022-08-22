import { createStore } from 'vuex'

export default createStore({
  state: {
    difficult: 'easy',
    difficultList: ['easy','medium','hard'],
    battleField: {
      player: null,
      bot: null,
    },
    allShips: false,
  },
  getters: {
    shipList() {
      let ships = [];
      for (let i = 1; i < 5; i++) {
        for (let g = 1; g <= i; g++) {
          ships.push({
            long: 5-i
          });
        }
      }
      return ships;
    }
  },
  mutations: {
  },
  actions: {

  },
  modules: {
  }
})
