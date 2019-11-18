import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';

// This is based on the pixel amounts set in world.scss.
// Mobile map is set to 900px width.
// Full screen map is set to 2048px width.
let MOBILE_SCALE = 0.439453125;
let WIDTH_THRESHOLD = 500;

export default Component.extend({
  place: null,
  offset: 0,
  dragStartX: null,
  dragStartY: null,

  didInsertElement() {
    this._super(...arguments);
    let mapItem = this.element.getElementsByClassName('map-item')[0];
    this.set('offset', mapItem.offsetWidth / 2);
  },

  position: computed('place.x', 'place.y', 'offset', function() {
    let x = this.get('place.x');
    let y = this.get('place.y');
    if (window.innerWidth < WIDTH_THRESHOLD) {
      x *= MOBILE_SCALE;
      y *= MOBILE_SCALE;
    }
    x -= this.get('offset');
    return new htmlSafe(`left: ${x}px; top: ${y}px;`);
  }),

  getMapWrapper(eventPath) {
    for (let i = 0; i < eventPath.length; i++) {
      if (eventPath[i].className === 'map-wrapper') {
        return eventPath[i];
      }
    }
    return null;
  },

  actions: {
    saveInitialLocation: function(event) {
      this.set('dragStartX', event.x);
      this.set('dragStartY', event.y);
    },
    locationDropped: function(event) {
      let mapWrapper = this.getMapWrapper(event.path);
      let itemWidth = this.element.getElementsByClassName('map-item')[0].offsetWidth;
      let place = this.get('place');

      place.set('x', place.get('x') + (event.x - this.get('dragStartX')));
      place.set('y', place.get('y') + (event.y - this.get('dragStartY')));
      place.save();
    }
  }
});
