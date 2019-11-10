import Component from '@ember/component';
import { computed } from '@ember/object';
import { isNone } from '@ember/utils';

export default Component.extend({
  beast: null,

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('beast', this.get('model') || {});
  },

  imageFileName: computed('beast.image_file', function() {
    return isNone(this.get('beast.image_file')) ? 'No file selected' : this.get('beast.image_file').split(/(\\|\/)/g).pop();
  }),

  actions: {
    addImageFile(file) {
      this.addFileForUpload('image_file', file);
    }
  }
});
