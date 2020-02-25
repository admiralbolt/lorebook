import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';

let WIDTH_THRESHOLD = 500;
let IMAGE_WIDTH = 2048;
let MAIN_CONTENT_PADDING = 30;

// We need to offset the menuY based on the height of the navbar.
// This should stay in sync with the definition in nav.scss.
let NAVBAR_REM = 5;

export default Component.extend({
  api_data: service('api-data'),
  session: service('session'),

  places: computed('api_data', function() {
    return this.get('api_data').getAllRecords('place');
  }),

  // Bounds for the scale value. Max scale will always be 50% larger than the
  // original value. Minimum scale will be calculated based on the device screen
  // size. The minimum image size should be effectively 100% viewport width.
  minScale: 0.5,
  maxScale: 1.5,

  // Attributes passed to click menu.
  menuX: 0,
  menuY: 0,
  menuVisible: false,

  init() {
    this._super(...arguments);
    this.set('scale', (window.innerWidth > WIDTH_THRESHOLD) ? 1.0 : 0.5);
    this.set('minScale', (window.innerWidth - MAIN_CONTENT_PADDING) / IMAGE_WIDTH);
  },

  didInsertElement() {
    this._super(...arguments);
  },

  click(event) {
    if (!this.get('session').isAuthenticated) return;

    this.set('menuX', event.clientX);
    this.set('menuY', event.clientY - NAVBAR_REM * parseFloat(getComputedStyle(document.documentElement).fontSize));
    this.toggleProperty('menuVisible');
  },

  width: computed('scale', function() {
    return IMAGE_WIDTH * this.get('scale');
  }),

  actions: {
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
    },
    // Function called when clicking on a sub world item.
    mapItemClick: function(place) {
      if (!this.get('session').isAuthenticated) return;

      event.stopPropagation();
      console.log(place);
    },
    // Function called when clicking on the menu to add an item.
    addMapItem: function(place) {
      if (!this.get('session').isAuthenticated) return;

      event.stopPropagation();
      place.set('x', this.get('menuX'));
      place.set('y', this.get('menuY'));
      place.save();
      this.set('menuVisible', false);
    }
  }
});
