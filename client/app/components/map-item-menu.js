import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';

export default Component.extend({
  // Passed from world component.
  place: null,
  x: 0,
  y: 0,
  visible: false,
  deleteMapItem: null,

  position: computed('x', 'y', function() {
    return new htmlSafe(`left: ${this.get('x')}px; top: ${this.get('y')}px;`);
  }),

  actions: {
    deleteMapItem: function(place) {
      this.get('deleteMapItem')(place);
    }
  }

});
