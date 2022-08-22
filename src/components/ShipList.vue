<template>
  <div class="container border rounded">
    <div class="row d-flex shipbox">
      <div class="col">
      <div v-for="(ship,index) in this.shipList" :key="index" class="d-inline-flex shipsel m-1" :class="'long-' + ship.long + ' ship-' + index" :ship="index" :long="ship.long">&nbsp;</div>
      </div>
    </div>
    <div class="row justify-content-between">
      <div class="col-auto align-self-start">
        <button class="btn btn-sm btn-secondary my-1" @click="addRotate">Rotate</button>
      </div>
      <div class="col-auto align-self-end">
        <button class="btn btn-sm btn-secondary my-1 mx-1" @click="resetPos">Reset</button>
        <button class="btn btn-sm btn-secondary my-1" @click="randomPos">Random</button>
      </div>
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
    addRotate() {
      if ($('.shipsel').hasClass('rotated')) {
        $('.shipsel').each(function(){
          $(this).stop(true,false).animate({
            width: ($('.field').eq(0).innerWidth()*parseInt($(this).attr('long'))) + 'px',
            height: ($('.field').eq(0).innerHeight()) + 'px',
          });
        })
      } else {
        $('.shipsel').each(function(){
          $(this).stop(true,false).animate({
            width: ($('.field').eq(0).innerWidth()) + 'px',
            height: ($('.field').eq(0).innerHeight()*parseInt($(this).attr('long'))) + 'px',
          });
        })
      }
      $('.shipsel').toggleClass('rotated');
    },
    randomPos() {
      $(".sea .field").addClass('empty-field').removeClass('shipped rotated').removeClass (function (index, className) {
          return (className.match (/shipped-\d+/g) || []).join(' ');
      }).removeAttr('long ship');
      $('.shipsel').css('visibility','hidden');
      $('.shipsel').each(function() {
        let colision = false, cy, cx, vert;
        let long = parseInt($(this).attr('long'));
        let move = Math.floor(long / 3);
        let from = move*-1, to = long-move;
        let ship = $(this).attr('ship');
        do {
          colision = false;
          cy = Math.floor(Math.random() * (10 - 1)) + 1;
          cx = Math.floor(Math.random() * (10 - 1)) + 1;
          vert = Math.random() < 0.5;

          for (let y = (vert ? from : 0) + -1; y <= (vert ? to : 1); y++) {
            for (let x = (vert ? 0 : from) + -1; x <= (vert ? 1 : to); x++) {


              let el = $('.field-' + (cx+x) + '-' + (cy+y));

              if ((cy + y < 0 || cy + y > 11 || cx + x < 0 || cx + x > 11) || ($(el).hasClass('shipped') && !$(el).hasClass('shipped-'+$(this).attr('ship')))) {
                colision = true;
                continue;
              }

            }
          }
        } while (colision);

        for (let i = from; i < to; i++) {
          let el = $('.field-' + (cx+(vert ? 0 : i)) + '-' + (cy+(vert ? i : 0)));
          $(el).addClass('shipped shipped-'+ship+(vert ? ' rotated' : '')).removeClass('empty-field').attr('ship',ship).attr('long',long);
        }
      });
    },
    resetPos() {
      $(".sea .field").addClass('empty-field').removeClass('shipped rotated').removeClass (function (index, className) {
          return (className.match (/shipped-\d+/g) || []).join(' ');
      }).removeAttr('long ship');
      $('.shipsel').css('visibility','visible');
    }
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
        $('.colision').removeClass('.colision');
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
        let vert = $(ui.target).hasClass('rotated');
        let opts = {};
        if (vert) {
          opts.height = ($('.field').eq(0).innerHeight()*parseInt(long)) + 'px';
          opts.width = ($('.field').eq(0).innerWidth()) + 'px';
        }
        else
        {
          opts.width = ($('.field').eq(0).innerWidth()*parseInt(long)) + 'px'
        }
        return $('<div class="shipsel m-1 shipsel-helper'+(vert ? ' rotated' : '')+'" long="'+long+'">&nbsp;</div>').css(opts).attr('ship',$(ui.target).attr('ship'));
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
        let vert = $(ui.draggable).hasClass('rotated');
        for (let y = (vert ? from : 0) + -1; y <= (vert ? to : 1); y++) {
          for (let x = (vert ? 0 : from) + -1; x <= (vert ? 1 : to); x++) {

            if (cy + y < 0 || cy + y > 11 || cx + x < 0 || cx + x > 11) {
              colision = true;
            }

            let el = $('.field-' + (cx+x) + '-' + (cy+y));

            let classToAdd = 'sea-field-margin';

            if ($(el).hasClass('shipped') && !$(el).hasClass('shipped-'+$(ui.draggable).attr('ship'))) {
              colision = true;
              classToAdd = 'sea-field-warring';
            }

            $(el).addClass(classToAdd);

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
          let el = $('.field-' + (cx+(vert ? 0 : i)) + '-' + (cy+(vert ? i : 0)));
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

        let vert = $(ui.helper).hasClass('rotated');

        ship = $(ui.helper).attr('ship');

        for (let i = from; i < to; i++) {
          let el = $('.field-' + (cx+(vert ? 0 : i)) + '-' + (cy+(vert ? i : 0)));
          $(el).addClass('shipped shipped-'+ship+(vert ? ' rotated' : '')).removeClass('empty-field').attr('ship',ship).attr('long',long);
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
