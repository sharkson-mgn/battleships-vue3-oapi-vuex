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

  randomNumber(min,max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },

  randomCoord() {
    return {
      x: this.randomNumber(1,10),
      y: this.randomNumber(1,10),
    };
  },

  randomPos(fromEl = '.sea',pos = false) {
    if (!Array.isArray(pos)) {
      pos = false;
    }
    let shipList = store.getters.shipList;
    $(fromEl+" .field").addClass('empty-field').removeClass('shipped rotated').removeClass (function (index, className) {
        return (className.match (/shipped-\d+/g) || []).join(' ');
    }).removeAttr('long ship');
    if ($('.shipsel').length) {
      $('.shipsel').css('visibility','hidden');
    }
    //$('.shipsel').each(function() {
    for (let ship = 0; ship < 10; ship++) {
      //let ship = $(this).attr('ship');
      let colision = false, cy, cx, vert;
      let long = shipList[ship].long;
      //let long = parseInt($(this).attr('long'));
      let move = Boolean(pos) == false ? Math.floor(long / 3) : 0;
      let from = move*-1, to = long-move;
      do {
        colision = false;

        cy = Boolean(pos) == false ? this.randomNumber(1,10) : parseInt(pos[ship].y);
        cx = Boolean(pos) == false ? this.randomNumber(1,10) : parseInt(pos[ship].x);
        vert = Boolean(pos) == false ? Math.random() < 0.5 : pos[ship].vert;

        if (Boolean(pos) == true) {
          break;
        }

        for (let y = (vert ? from : 0) + -1; y <= (vert ? to : 1); y++) {
          for (let x = (vert ? 0 : from) + -1; x <= (vert ? 1 : to); x++) {


            let el = $(fromEl+' .field-' + (cx+x) + '-' + (cy+y));

            if ((cy + y < 0 || cy + y > 11 || cx + x < 0 || cx + x > 11) || ($(el).hasClass('shipped') && !$(el).hasClass('shipped-'+ship))) {
              colision = true;
              continue;
            }

          }
        }
      } while (colision);

      for (let i = from; i < to; i++) {
        let el = $(fromEl+' .field-' + (cx+(vert ? 0 : i)) + '-' + (cy+(vert ? i : 0)));
        $(el).addClass('shipped shipped-'+ship+(vert ? ' rotated' : '')).removeClass('empty-field').attr('ship',ship).attr('long',long);
      }
    }
    //});
    store.state.ships = 20;
  },
  resetPos() {
    $(".sea .field").addClass('empty-field').removeClass('shipped rotated').removeClass (function (index, className) {
        return (className.match (/shipped-\d+/g) || []).join(' ');
    }).removeAttr('long ship');
    $('.shipsel').css('visibility','visible');
    store.state.ships = 0;
  },

  loadPos(fromEl,pos) {
    this.randomPos(fromEl,pos);
  },

  shotBy(x,y,player) {
    return this.shipAt(x,y,player) >= 0;
  },

  shotByPlayer(x,y) {
    return this.shipAt(x,y) >= 0;
  },

  addMargin(xs,ys,className,player) {

    for (let y = ys-1; y <= ys+1; y++) {
      for (let x = xs-1; x <= xs+1; x++) {
        if ($('.'+player+'.sea .field-'+x+'-'+y).length && $('.'+player+' .field-'+x+'-'+y).hasClass('empty-field')) {
          $('.'+player+'.sea .field-'+x+'-'+y).addClass(className);
        }
      }
    }
  },

  addMarginShip(ship,className,player) {
    ship = this.getShipFields(ship,player);
    for (let i in ship) {
      this.addMargin(ship[i].x,ship[i].y,className,player);
    }
  },

  addCorners(xs,ys,className,player) {
    for (let y = ys-1; y <= ys+1; y++) {
      for (let x = xs-1; x <= xs+1; x++) {
        if (
            $('.'+player+'.sea .field-'+x+'-'+y).length &&
            $('.'+player+'.sea .field-'+x+'-'+y).hasClass('empty-field') &&
            !(
              x == xs - 1 ^
              y == ys - 1 ^
              x == xs + 1 ^
              y == ys + 1
            )
          ) {
          $('.'+player+'.sea .field-'+x+'-'+y).addClass(className);
        }
      }
    }
  },

  shipAt(x,y, player) {
    let shipList = store.getters.shipList;
    for (let s in store.state.savedPos[player]) {
      let ship = store.state.savedPos[player][s];
      let vert = ship.vert;
      let sx = parseInt(ship.x);
      let sy = parseInt(ship.y);
      if (
        x >= sx &&
        x <= (sx + (vert ? 0 : shipList[s].long - 1)) &&
        y >= sy &&
        y <= (sy + (vert ? shipList[s].long - 1 : 0))
      ) {
        return s;
      }
    }

    return -1;
  },

  getShipFields(s,player) {
    let long = store.getters.shipList[s].long;
    let ship = store.state.savedPos[player][s];
    let sx = parseInt(ship.x);
    let sy = parseInt(ship.y);
    let fields = [];
    for (let i = 0; i < long; i++) {
      fields.push({
        x: sx + (ship.vert ? 0 : i),
        y: sy + (ship.vert ? i : 0),
      });
    }
    return fields;
  },

  shipDestroyed(ship,player) {
    ship = this.getShipFields(ship,player);
    for (let i in ship) {
      if (!$('.'+player+'.sea .field-'+ship[i].x+'-'+ship[i].y).hasClass('hited')) {
        return false;
      }
    }
    return true;
  },

  cpuThink() {
    if ($('.sea.player .hited').length == 20) {
      return false;
    }
    let x,y,el,coords = [];
    $('.sea.player .field:not(.missed,.hited)').each(function(){
      coords.push({
        x: parseInt($(this).attr('x')),
        y: parseInt($(this).attr('y')),
      })
    });
    //do {
      [x,y] = Object.values(coords[this.randomNumber(0,coords.length-1)]);
      el = '.sea.player .field-'+x+'-'+y;
    //} while (($(el).hasClass('missed') || $(el).hasClass('hited')));
    $(el).click();
  }

};
