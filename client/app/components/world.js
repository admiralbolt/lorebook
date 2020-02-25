import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';

let WIDTH_THRESHOLD = 500;
let IMAGE_WIDTH = 2048;
let MAIN_CONTENT_PADDING = 30;

export default Component.extend({
  api_data: service('api-data'),
  session: service('session'),

  places: computed('api_data', function() {
    return this.get('api_data').getAllRecords('place');
  }),

  // The scale to apply to the world map image.
  scale: 1.0,

  // Bounds for the scale value. Max scale will always be 50% larger than the
  // original value. Minimum scale will be calculated based on the device screen
  // size. The minimum image size should be effectively 100% viewport width.
  min_scale: 0.5,
  max_scale: 1.5,

  // A property for tracking the previous scale value as tracked by the pinch
  // event. The event always starts with a scale = 1, and as you zoom in / out
  // the scale changes.
  event_scale: 1.0,

  // Manually track hammer element for touch gestures.
  hammer: null,

  // Attributes passed to click menu.
  menu_x: 0,
  menu_y: 0,
  visible: false,

  init() {
    this._super(...arguments);
    this.set('scale', (window.innerWidth > WIDTH_THRESHOLD) ? 1.0 : 0.5);
    this.set('min_scale', (window.innerWidth - MAIN_CONTENT_PADDING) / IMAGE_WIDTH);
  },

  didInsertElement() {
    this._super(...arguments);

    // All of this is a really hacky work around because for some ungodly
    // reason, you can't enable scrolling and pinch gestures at the same time.
    // I mean obviously you can because I'm doing it, it just is really
    // difficult and gross instead of easy like a fucking library should be.
    this.hammer = new Hammer(document.getElementById('map-wrapper'), {touchAction: 'pan-x pan-y'});
    this.element.addEventListener('touchstart', function(event) {
      if (event.touches.length < 2) return;

      this.hammer.get('pinch').set({enable: true});
    }.bind(this));

    this.element.addEventListener('touchend', function(event) {
      if (event.touches.length >= 2) return;

      this.hammer.get('pinch').set({enable: false});
    }.bind(this));

    this.hammer.on('pinch', function(event) {
      this.pinch(event);
    }.bind(this));

    this.hammer.on('pinchend', function(event) {
      this.pinchEnd(event);
    }.bind(this));
  },

  click(event) {
    this.set('menu_x', event.clientX);
    this.set('menu_y', event.clientY);
    this.toggleProperty('menu_visible');
  },

  width: computed('scale', function() {
    return IMAGE_WIDTH * this.get('scale');
  }),

  debugDisplay: computed('scale', 'event_scale', 'event', function() {
    let d = '';
    d += `scale: ${this.get('scale')} <br>`;
    d += `event_scale: ${this.get('event_scale')} <br>`;
    let e = this.get('event');
    for (let prop in e.gesture) {
      d += `event.gesture.${prop} = ${event.gesture[prop]}`;
    }
    return d;
  }),

  pinch: function(event) {
    let scale = this.get('scale');
    let prevEventScale = this.get('event_scale');
    let currentEventScale = event.scale;
    let newScale = scale + (currentEventScale - prevEventScale) * scale;
    newScale = Math.max(Math.min(newScale, this.get('max_scale')), this.get('min_scale'));
    this.set('scale', newScale);
    this.set('event_scale', currentEventScale || 1.0);
  },
  pinchEnd: function(event) {
    this.set('event_scale', 1.0);
  },

  actions: {
    enablePinch: function(event) {
      if (event.touches.length !== 2) return;

    },
    pinch: function(event) {
      let scale = this.get('scale');
      let prevEventScale = this.get('event_scale');
      let currentEventScale = event.gesture.scale;
      this.set('scale', scale + (currentEventScale - prevEventScale) * scale);
      this.set('event_scale', currentEventScale || 1.0);
    },
    // When we stop pinching, we need to reset our previous scale value back to
    // the default.
    pinchEnd: function(event) {
      this.set('event_scale', 1.0);
    },
    dragOver: function(event) {
      event.preventDefault();
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
