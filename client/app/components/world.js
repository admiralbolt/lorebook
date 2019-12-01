import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';

let WIDTH_THRESHOLD = 500;
let IMAGE_WIDTH = 2048;

export default Component.extend({
  api_data: service('api-data'),
  session: service('session'),

  // The scale to apply to the world map image.
  scale: 1.0,

  // A property for tracking the previous scale value as tracked by the pinch
  // event. The event always starts with a scale = 1, and as you zoom in / out
  // the scale changes.
  eventScale: 1.0,
  event: {},

  hammer: null,

  init() {
    this._super(...arguments);
    this.set('scale', (window.innerWidth > WIDTH_THRESHOLD) ? 1.0 : 0.5);
  },

  didInsertElement() {
    this._super(...arguments);
    console.log('didinsert');

    // All of this is a really hacky work around because for some ungodly
    // reason, you can't enable scrolling and pinch gestures at the same time.
    // I mean obviously you can because I'm doing it, it just is really
    // difficult and gross instead of easy like a fucking library should be.
    this.hammer = new Hammer(document.getElementById('map-wrapper'), {touchAction: 'pan-x pan-y'});
    this.element.addEventListener('touchstart', function(event) {
      if (event.touches.length >= 2) {
        this.hammer.get('pinch').set({enable: true});
      }
    }.bind(this));
    this.element.addEventListener('touchend', function(event) {
      if (event.touches.length < 2) {
        this.hammer.get('pinch').set({enable: false});
      }
    }.bind(this));
    this.hammer.on('pinch', function(event) {
      this.pinch(event);
    }.bind(this));
    this.hammer.on('pinchend', function(event) {
      this.pinchEnd(event);
    }.bind(this));
  },

  width: computed('scale', function() {
    return IMAGE_WIDTH * this.get('scale');
  }),

  debugDisplay: computed('scale', 'eventScale', 'event', function() {
    let d = '';
    d += `scale: ${this.get('scale')} <br>`;
    d += `eventScale: ${this.get('eventScale')} <br>`;
    let e = this.get('event');
    for (let prop in e.gesture) {
      d += `event.gesture.${prop} = ${event.gesture[prop]}`;
    }
    return d;
  }),

  pinch: function(event) {
    let scale = this.get('scale');
    let prevEventScale = this.get('eventScale');
    let currentEventScale = event.scale;
    this.set('scale', scale + (currentEventScale - prevEventScale) * scale);
    this.set('eventScale', currentEventScale || 1.0);
  },
  pinchEnd: function(event) {
    this.set('eventScale', 1.0);
  },

  actions: {
    enablePinch: function(event) {
      if (event.touches.length !== 2) return;

    },
    pinch: function(event) {
      let scale = this.get('scale');
      let prevEventScale = this.get('eventScale');
      let currentEventScale = event.gesture.scale;
      this.set('scale', scale + (currentEventScale - prevEventScale) * scale);
      this.set('eventScale', currentEventScale || 1.0);
    },
    // When we stop pinching, we need to reset our previous scale value back to
    // the default.
    pinchEnd: function(event) {
      this.set('eventScale', 1.0);
    },
    pan: function(event) {
      // this.set('event', event);
    },
    dragOver: function(event) {
      event.preventDefault();
    },
    highlight: function() {
      this.set('show', true);
    },
    hide: function() {
      this.set('show', false);
    },
    removeItem: function(event) {
      let api_data = this.get('store');
      let placeId = event.dataTransfer.getData('text');
      let place = api_data.peekRecord('place', placeId) || api_data.findRecord('place', placeId);
      place.set('x', null);
      place.set('y', null);
      place.save();
    }
  }
});
