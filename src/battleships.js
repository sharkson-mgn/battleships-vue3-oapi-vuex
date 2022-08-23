import $ from "jquery";
import store from './store'
export default {

  getPos() {
    let ships = [], ship;
    for (let s = 0; s < 10; s++) {
      ship = $('.shipped-'+s).eq(0);
      ships.push({
        x: ship.attr('x'),
        y: ship.attr('y'),
        vert: ship.hasClass('rotated'),
      });
    }
    return ships;
  },

  addRotate() {
    let isRotated = $('.shipsel').hasClass('rotated');
    $('.shipsel').each(function(){
      $(this).stop(true,false).animate({
        width: (isRotated ? $('.field').eq(0).innerWidth()*parseInt($(this).attr('long')) : $('.field').eq(0).innerWidth()) + 'px',
        height: (isRotated ? $('.field').eq(0).innerHeight() : $('.field').eq(0).innerHeight()*parseInt($(this).attr('long'))) + 'px',
      });
    })
    $('.shipsel').toggleClass('rotated');
  },
  randomPos(pos = false) {
    if (!Array.isArray(pos)) {
      pos = false;
    }
    let shipList = store.getters.shipList;
    $(".sea .field").addClass('empty-field').removeClass('shipped rotated').removeClass (function (index, className) {
        return (className.match (/shipped-\d+/g) || []).join(' ');
    }).removeAttr('long ship');
    $('.shipsel').css('visibility','hidden');
    $('.shipsel').each(function() {
      let ship = $(this).attr('ship');
      let colision = false, cy, cx, vert;
      let long = Boolean(pos) == false ? parseInt($(this).attr('long')) : shipList[ship].long;
      //let long = parseInt($(this).attr('long'));
      let move = Boolean(pos) == false ? Math.floor(long / 3) : 0;
      let from = move*-1, to = long-move;
      do {
        colision = false;

        cy = Boolean(pos) == false ? Math.floor(Math.random() * (10 - 1)) + 1 : parseInt(pos[ship].y);
        cx = Boolean(pos) == false ? Math.floor(Math.random() * (10 - 1)) + 1 : parseInt(pos[ship].x);
        vert = Boolean(pos) == false ? Math.random() < 0.5 : pos[ship].vert;

        if (Boolean(pos) == true) {
          break;
        }

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
    store.state.ships = 20;
  },
  resetPos() {
    $(".sea .field").addClass('empty-field').removeClass('shipped rotated').removeClass (function (index, className) {
        return (className.match (/shipped-\d+/g) || []).join(' ');
    }).removeAttr('long ship');
    $('.shipsel').css('visibility','visible');
    store.state.ships = 0;
  },

  loadPos(pos) {
    this.randomPos(pos);
  }

};
