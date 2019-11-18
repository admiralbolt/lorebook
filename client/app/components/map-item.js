import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';

// This is based on the pixel amounts set in world.scss.
// Mobile map is set to 1400px width.
// Full screen map is set to 2048px width.
let MOBILE_SCALE = 0.68359375;
let WIDTH_THRESHOLD = 500;

export default Component.extend({
  session: service('session'),
  place: null,
  offsetX: 0,
  offsetY: 0,
  dragStartX: null,
  dragStartY: null,

  didInsertElement() {
    this._super(...arguments);
    let mapItem = this.element.getElementsByClassName('map-item')[0];
    this.set('offsetX', mapItem.offsetWidth / 2);
    this.set('offsetY', mapItem.offsetHeight / 2);
  },

  position: computed('place.x', 'place.y', 'offset', function() {
    let x = this.get('place.x');
    let y = this.get('place.y');
    if (window.innerWidth < WIDTH_THRESHOLD) {
      x *= MOBILE_SCALE;
      y *= MOBILE_SCALE;
    }
    x -= this.get('offsetX');
    y -= this.get('offsetY');
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
      event.dataTransfer.setData('text', event.target.getAttribute('data-id'));
    },
    locationDropped: function(event) {
      // The drop was handled by the remove item dropzone, do nothing.
      if (this.element == null) return;
      
      let mapWrapper = this.getMapWrapper(event.path);
      let itemWidth = this.element.getElementsByClassName('map-item')[0].offsetWidth;
      let place = this.get('place');

      place.set('x', place.get('x') + (event.x - this.get('dragStartX')));
      place.set('y', place.get('y') + (event.y - this.get('dragStartY')));
      place.save();
    }
  }
});
