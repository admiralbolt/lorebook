import Component from '@ember/component';
import { htmlSafe } from '@ember/template';
import { computed } from '@ember/object';
import { filter } from '@ember/object/computed';

export default Component.extend({

  // All the places not on the map already.
  places: null,

  // A function passed from the world component used for adding places to
  // the map.
  addMapItem: null,

  // Whether or not to show the menu
  visible: false,

  // Menu position
  x: 0,
  y: 0,

  position: computed('x', 'y', function() {
    return new htmlSafe(`left: ${this.get('x')}px; top: ${this.get('y')}px;`);
  }),

  actions: {
    addMapItem: function(place) {
      this.get('addMapItem')(place);
    }
  }
});
