import Component from '@ember/component';
import { computed } from '@ember/object';
import { isNone } from '@ember/utils';

export default Component.extend({
  place: null,

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
    }
  }
});
