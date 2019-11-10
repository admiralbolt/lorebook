import Component from '@ember/component';
import { computed } from '@ember/object';
import { isNone } from '@ember/utils';

export default Component.extend({
  place: null,
  // This needs to stay in sync with the types defined in models.py
  placeTypes: ["City", "Dungeon", "Location"],

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('place', this.get('model') || {});
  },

  imageFileName: computed('place.image_file', function() {
    return isNone(this.get('place.image_file')) ? 'No file selected' : this.get('place.image_file').split(/(\\|\/)/g).pop();
  }),

  actions: {
    addImageFile(file) {
      this.addFileForUpload('image_file', file);
    },
    addPointOfInterest() {
      let [...pois] = this.get('place.points_of_interest') || [];
      pois.push({});
      this.set('place.points_of_interest', pois);
    },
    removePointOfInterest(index) {
      let [...pois] = this.get('place.points_of_interest') || [];
      pois.splice(index, 1);
      this.set('place.points_of_interest', pois);
    }
  }
});
