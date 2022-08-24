<template>
  <div class="row" id="game">
    <div class="col-12 col-md-6">
      <GameBoard player="player" />
    </div>
    <div class="col-12 col-md-6">
      <GameBoard player="cpu" />
    </div>
  </div>
</template>


<script>
import $ from 'jquery'
import bs from '../battleships'
import GameBoard from './GameBoard.vue'
import store from '../store/index'
export default {
  components: {
    GameBoard
  },
  mounted() {
    bs.loadPos('.sea.player',store.state.savedPos.player);
    //bs.loadPos('.sea.cpu',store.state.savedPos.cpu);

    $('.sea .field').click(function() {
      let cp = store.state.currentPlayer;
      if ($(this).hasClass('missed') || $(this).hasClass('hited') || !$(this).closest('.sea').hasClass(cp)) {
        return true;
      }
      let x = parseInt($(this).attr('x')), y = parseInt($(this).attr('y'));
      if (bs.shotBy(x,y,cp)) {
        $(this).addClass('hited');
        $(this).removeClass('empty-field');
        store.state.combo++;
        let ship = bs.shipAt(x,y,cp);
        if (bs.shipDestroyed(ship,cp))
        {
          bs.addMarginShip(ship,'missed',cp);
        }
        else {
          bs.addCorners(x,y,'missed',cp);
        }
      }
      else {
        store.state.combo = 0;
        store.state.currentPlayer = (store.state.currentPlayer == 'cpu') ? 'player' : 'cpu';
        $(this).addClass('missed');
      }
      if ($('.sea.cpu .hited').length == 20 || $('.sea.player .hited').length == 20) {
        store.state.currentPlayer = (store.state.currentPlayer == 'cpu') ? 'player' : 'cpu';
        alert(store.state.currentPlayer + ' win!');
        return false;
      }
      if (store.state.currentPlayer == 'player') { bs.cpuThink(); }
    });

    if (store.state.currentPlayer == 'player') {
      bs.cpuThink();
    }
  }
}
</script>

<style>
.field {
  cursor: pointer !important;
}

.field.hited {
  background-color: red !important;
}
.field.missed {
  background-color: #bbb;
}
</style>
