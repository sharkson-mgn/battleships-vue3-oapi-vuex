<template>
  <div class="container border rounded">
    <div class="row d-flex shipbox">
      <div v-for="(ship,index) in this.shipList" :key="index" class="shipsel m-1" :class="'long-' + ship.long + ' ship-' + index" :ship="index" :long="ship.long">&nbsp;</div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import 'jqueryui';
import store from '../store'
export default {
  computed: {
    shipList: () => store.getters.shipList,
  },
  methods: {
  },
  mounted() {
    $('.shipsel').draggable({
      revert: true,
    }).css({
      'height': $('.field').eq(0).innerHeight() + 'px',
    }).each(function(){
      $(this).css({
        width: ($('.field').eq(0).innerWidth()*parseInt($(this).attr('long'))) + 'px',
      });
    });

    $('.shipbox').droppable({
      accept: '.field',
      drop: function(event,ui) {
        let ship = $(ui.helper).attr('ship');
        $('.shipsel.ship-'+ship).css('visibility','visible');
        $('.shipped.shipped-'+ship).removeClass('shipped shipped-'+ship).addClass('empty-field').removeAttr('long ship');
      },
      over: function() {
        $('.shipbox').parent().css('border-color','yellow');
      }
    });

    $('.sea .field').draggable({
      revert: function(droppable) {
        return (droppable === false || $('.colision').length);
      },
      helper: function(ui){
        let long = $(ui.target).attr('long');
        return $('<div class="shipsel m-1 shipsel-helper" long="'+long+'">&nbsp;</div>').css({
          width: ($('.field').eq(0).innerWidth()*parseInt(long)) + 'px'
        }).attr('ship',$(ui.target).attr('ship'));
      },
      cancel: '.empty-field',
    });

    $('.sea .field').droppable({
      over: function(event,ui) {

        $('.field').removeClass('sea-field-hover sea-field-warring sea-field-margin');
        $('.shipsel').removeClass('shipsel-warring');

        let long = parseInt($(ui.draggable).attr('long'));
        let [cx,cy] = /field-(\d+)-(\d+)/.exec(this.classList.value).slice(1).map((x)=>{return parseInt(x)});
        let move = Math.floor(long / 3);

        let from = move*-1, to = long-move;

        let colision = false;
        //detect colision and draw margin
        for (let y = -1; y <= 1; y++) {
          for (let x = from - 1; x < to + 1; x++) {

            if (cy+y < 0 || cy+y > 11 || cx + x < 0 || cx + x > 11) {
              colision = true;
            }

            let el = $('.field-' + (cx+x) + '-' + (cy+y));

            if ($(el).hasClass('shipped') && !$(el).hasClass('shipped-'+$(ui.draggable).attr('ship'))) {
              colision = true;
            }
            

            $(el).addClass('sea-field-margin');

          }
        }

        let className = colision ? 'sea-field-warring' : 'sea-field-hover';

        if (colision) {
          $(ui.helper).addClass('shipsel-warring');
          $(this).addClass('colision');
        }
        else {
          $('.colision').removeClass('colision');
        }


        for (let i = from; i < to; i++) {
          let el = $('.field-' + (cx+i) + '-' + cy);
          if (!$(el).hasClass('shipped')) {
            $(el).addClass(className);
          }
        }
      },
      deactivate: function() {
        $('.field').removeClass('sea-field-hover sea-field-warring sea-field-margin');
        $('.shipsel').removeClass('shipsel-warring');
      },
      drop: function(event,ui) {

        let ship;

        let long = $(ui.helper).attr('long');

        let [cx,cy] = /field-(\d+)-(\d+)/.exec(this.classList.value).slice(1).map((x)=>{return parseInt(x)});
        let move = Math.floor(long / 3);
        let from = move*-1, to = long-move;

        if ($('.colision').length) {
          return false;
        }

        if ($(ui.draggable).hasClass('shipsel')) {
          $(ui.draggable).css('visibility','hidden');
        }
        else {
          ship = $(ui.draggable).attr('ship');
          $('.shipped.shipped-'+ship).removeClass('shipped shipped-'+ship).addClass('empty-field').removeAttr('long ship');
        }

        ship = $(ui.helper).attr('ship');

        for (let i = from; i < to; i++) {
          let el = $('.field-' + (cx+i) + '-' + cy);
          $(el).addClass('shipped shipped-'+ship).removeClass('empty-field').attr('ship',ship).attr('long',long);
        }
      }
    });
  }
}
</script>

<style>

.shipsel, .shipped {
  border: 1px grey solid;
  border-radius: 0.2em;
  cursor: move;
  background-color: #ddd;
}

.shipped {
  border-radius: 0.2em;
  cursor: pointer;
  display: inline-block;
  width: 10%;
  height: 10%;
}

.shipsel-warring {
  background-color: #faa;
}

.sea-field-hover {
  background-color: #bdf;
}
/* # #eef <> #bdf */
.sea-field-margin {
  background-color: #ccd;
}

.sea-field-warring {
  background-color: #fdd;
}

.shipbox-hover {
  border-color: yellow;
}


</style>
