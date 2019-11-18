import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';

export default Controller.extend({
  api_data: service('api-data'),
  show: false,

  style: computed('show', function() {
    let opacity = this.get('show') ? 1.0 : 0.2;
    return new htmlSafe(`opacity: ${opacity}`);
  }),

  actions: {
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
